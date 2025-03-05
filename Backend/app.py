import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
from decimal import Decimal
import re
import json
import math

app = Flask(__name__)
CORS(app)
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "fwas_db_latest")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Deeksha@123$")

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
@app.route('/user_dashboard', methods=['GET'])
def get_user_dashboard():
    query = """
        SELECT
            (SELECT COUNT(*) FROM public."FWAS_USER") AS total_users,
            (SELECT COUNT(*) FROM public."FWAS_USER" WHERE "ACTIVE" = TRUE) AS active_users,
            (SELECT COUNT(*) FROM public."FWAS_USER" WHERE "ACTIVE" = FALSE) AS inactive_users,
            (SELECT COUNT(DISTINCT "AGENCY") FROM public."FWAS_USER") AS agencies,
            (SELECT COUNT(DISTINCT "TITLE") FROM public."FWAS_USER") AS job_titles,
            (SELECT COUNT(*) FROM public."FWAS_PHONE_PROVIDER") AS phone_providers
    """

    result = {
        "total_users": 0,
        "active_users": 0,
        "inactive_users": 0,
        "agencies": 0,
        "job_titles": 0,
        "phone_providers": 0
    }

    connection = None
    try:
        connection = get_db_connection()  # Function to obtain a database connection
        with connection.cursor() as cursor:
            cursor.execute(query)
            row = cursor.fetchone()
            if row:
                result["total_users"] = row[0] or 0
                result["active_users"] = row[1] or 0
                result["inactive_users"] = row[2] or 0
                result["agencies"] = row[3] or 0
                result["job_titles"] = row[4] or 0
                result["phone_providers"] = row[5] or 0
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        if connection:
            connection.close()

    return jsonify(result)
@app.route('/alert_dashboard', methods=['GET'])
def get_alert_counts():
    query = """
        SELECT 
            COUNT(*) AS total_alerts,
            SUM(CASE WHEN a."ACTIVE" THEN 1 ELSE 0 END) AS active_alerts,
            SUM(CASE WHEN a."EXPIRES_AT" < CURRENT_TIMESTAMP THEN 1 ELSE 0 END) AS expired_alerts,
            SUM(CASE WHEN a."PROCESSING" THEN 1 ELSE 0 END) AS processing_alerts
        FROM "public"."FWAS_ALERT" a
    """

    result = {
        "total_watches": 0,
        "active_watches": 0,
        "expired_watches": 0,
        "processing_watches": 0
    }

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(query)
            row = cursor.fetchone()
            if row:
                result["total_watches"] = row[0] or 0
                result["active_watches"] = row[1] or 0
                result["expired_watches"] = row[2] or 0
                result["processing_watches"] = row[3] or 0
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        if connection:
            connection.close()

    return jsonify(result)

def fetch_data(query):
    data = {}
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(query)
            for row in cur.fetchall():
                date_str = str(row[0])  
                value = row[1]
                if isinstance(value, Decimal):
                    value = float(value)
                data[date_str] = value
    except psycopg2.Error as e:
        print(f"Database error in fetch_data: {e}")
    finally:
        if conn:
            conn.close()

    return data


@app.route('/user_summary', methods=['GET'])
def get_alerts_summary():

    start_date_str = request.args.get("start_date")
    end_date_str = request.args.get("end_date")

    if not start_date_str or not end_date_str:
        return jsonify({"error": "Missing start_date or end_date query parameters."}), 400

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    if start_date > end_date:
        return jsonify({"error": "start_date must be before or equal to end_date."}), 400

    QUERIES = {
        "avg_alerts_per_user": f"""
            SELECT DATE("CREATED_AT") AS date, 
                   COUNT("ID") / NULLIF(COUNT(DISTINCT "CREATEDBY_ID"), 0) AS avg_alerts_per_user
            FROM public."FWAS_ALERT"
            WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY DATE("CREATED_AT");
        """,
        "avg_alert_history_per_user": f"""
            SELECT DATE("CREATED_AT") AS date, 
                   COUNT("ID") / NULLIF(COUNT(DISTINCT "SENT_TO"), 0) AS avg_alert_history_per_user
            FROM public."FWAS_ALERT_HISTORY"
            WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY DATE("CREATED_AT");
        """,
        "user_created": f"""
            SELECT DATE("CREATED_AT") AS date, COUNT("ID") AS user_created
            FROM public."FWAS_USER"
            WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY DATE("CREATED_AT");
        """,
        "user_last_updated": f"""
            SELECT DATE("UPDATED_AT") AS date, COUNT("ID") AS user_last_updated
            FROM public."FWAS_USER"
            WHERE "UPDATED_AT" BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY DATE("UPDATED_AT");
        """,
        "cumulative_users": f"""
            SELECT date,
                   SUM(user_created) OVER (ORDER BY date) AS cumulative_users
            FROM (
                SELECT DATE("CREATED_AT") AS date,
                       COUNT("ID") AS user_created
                FROM public."FWAS_USER"
                WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
                GROUP BY DATE("CREATED_AT")
            ) sub
            ORDER BY date;
        """
    }
    data_avg_alerts = fetch_data(QUERIES["avg_alerts_per_user"])
    data_avg_alert_history = fetch_data(QUERIES["avg_alert_history_per_user"])
    data_user_created = fetch_data(QUERIES["user_created"])
    data_user_last_updated = fetch_data(QUERIES["user_last_updated"])
    data_cumulative_users = fetch_data(QUERIES["cumulative_users"])

    date_list = []
    current_date = start_date
    while current_date <= end_date:
        date_list.append(current_date.strftime("%Y-%m-%d"))
        current_date += timedelta(days=1)

    filled_cumulative_users = {}
    last_value = 0.0
    for d in date_list:
        if d in data_cumulative_users:
            last_value = data_cumulative_users[d]
        filled_cumulative_users[d] = last_value

    json_data = []
    for d in date_list:
        json_data.append({
            "date": d,
            "avg_alerts_per_user": data_avg_alerts.get(d, 0),
            "avg_alert_history_per_user": data_avg_alert_history.get(d, 0),
            "user_created": data_user_created.get(d, 0),
            "user_last_updated": data_user_last_updated.get(d, 0),
            "cumulative_users": filled_cumulative_users[d]
        })

    return jsonify(json_data)

def extract_forecast_date(text):
    match = re.search(r'for\s+\d{2}:\d{2}\s+(\d{2}/\d{2}/\d{2})', text)
    if match:
        date_str = match.group(1)
        month, day, year = date_str.split('/')
        return f"20{year}-{month.zfill(2)}-{day.zfill(2)}"
    return None

@app.route('/alert_summary', methods=['GET'])
def get_alert_charts():
    start_date_str = request.args.get("start_date")
    end_date_str = request.args.get("end_date")

    if not start_date_str or not end_date_str:
        return jsonify({"error": "Missing start_date or end_date query parameters."}), 400

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    if start_date > end_date:
        return jsonify({"error": "start_date must be before or equal to end_date."}), 400

    forecast_types = ["Wind Speed", "Wind Gust", "Precipitation"]
    warning_keywords = [
        "Flood Warning", 
        "Flood Advisory", 
        "Flood Watch", 
        "Special Weather Statement", 
        "Winter Weather Advisory", 
        "Hydrologic Outlook"
    ]
    
    def init_daily_counts():
        counts = {ft: 0 for ft in forecast_types}
        counts.update({kw: 0 for kw in warning_keywords})
        return counts

    query = f"""
        SELECT "CREATED_AT", "CONTENT_JSON", "SENT", "ERRORED", "SENT_TO"
        FROM public."FWAS_ALERT_HISTORY"
        WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
    """
    
    total_alerts = 0
    alerts_sent_successfully = 0
    alerts_errored = 0
    distinct_sent_to = set()
    
    aggregated_data = {}  
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
        conn.close()
    except Exception as e:
        return jsonify({"error": "Database error: " + str(e)}), 500

    for row in rows:
        created_at, content_json, sent, errored, sent_to = row
        total_alerts += 1
        if sent:
            alerts_sent_successfully += 1
        if errored:
            alerts_errored += 1
        if sent_to:
            distinct_sent_to.add(sent_to)
        
        try:
            alerts = content_json if isinstance(content_json, list) else json.loads(content_json)
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            continue
        
        for alert in alerts:
            display_name = alert.get("displayName", "")
            entries = alert.get("entries", [])
            if display_name in forecast_types:
                for entry in entries:
                    if entry.get("type") == "forecasted":
                        forecast_date = extract_forecast_date(entry.get("metric_plain_text", ""))
                        if not forecast_date:
                            forecast_date = created_at.date().strftime("%Y-%m-%d")
                        if forecast_date not in aggregated_data:
                            aggregated_data[forecast_date] = init_daily_counts()
                        aggregated_data[forecast_date][display_name] += 1
            elif display_name == "NWS Warnings":
                day = created_at.date().strftime("%Y-%m-%d")
                if day not in aggregated_data:
                    aggregated_data[day] = init_daily_counts()
                for entry in entries:
                    if entry.get("type") == "weather_warning":
                        text = entry.get("metric_plain_text", "")
                        for keyword in warning_keywords:
                            if keyword in text:
                                aggregated_data[day][keyword] += 1

    date_range = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d")
                  for i in range((end_date - start_date).days + 1)]
    for d in date_range:
        if d not in aggregated_data:
            aggregated_data[d] = init_daily_counts()

    chart_data = []
    cumulative = {field: 0 for field in forecast_types + warning_keywords}
    for day in sorted(aggregated_data.keys()):
        entry = {"date": day}
        for field in forecast_types + warning_keywords:
            count = aggregated_data[day].get(field, 0)
            entry[field] = count
            cumulative[field] += count
            entry["cumulative_" + field.replace(" ", "_")] = cumulative[field]
        chart_data.append(entry)

    avg_alerts_per_user = math.ceil(total_alerts / len(distinct_sent_to)) if distinct_sent_to else 0

    summary_data = {
        "total_alerts": total_alerts,
        "alerts_sent_successfully": alerts_sent_successfully,
        "alerts_errored": alerts_errored,
        "avg_alerts_per_user": avg_alerts_per_user
    }

    return jsonify({
        "chart_data": chart_data,
        "summary_data": summary_data
    })

@app.route('/alerts_locations', methods=['GET'])
def get_alerts_locations():
    query = """
        SELECT 
            "ID" as id,
            ST_X(ST_Transform("CENTROID", 4326)) AS long,
            ST_Y(ST_Transform("CENTROID", 4326)) AS lat
        FROM public."FWAS_ALERT"
    """
    
    results = []
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()
            for row in rows:
                results.append({
                    "title": row[0],
                    "longitude": row[1],
                    "latitude": row[2]
                })
    except Exception as e:
        return jsonify({"error": "Database error: " + str(e)}), 500
    finally:
        if connection:
            connection.close()
    
    return jsonify(results)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
