import psycopg2 
import json
from datetime import datetime, timedelta
from decimal import Decimal

DB_CONFIG = {
    "dbname": "fwas_db_latest",
    "user": "postgres",
    "password": "Fwas@5775$",
    "host": "localhost",
    "port": "5432"
}

def get_date_input(prompt):
    while True:
        try:
            date_str = input(prompt).strip()
            return datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            print("Invalid date format! Please use YYYY-MM-DD.")

start_date = get_date_input("Enter start date (YYYY-MM-DD): ")
end_date = get_date_input("Enter end date (YYYY-MM-DD): ")

if start_date > end_date:
    print("Start date must be before end date!")
    exit()

QUERIES = {
    "avg_alerts_per_user": f"""
        SELECT DATE("CREATED_AT") AS date, 
               COUNT("ID") / NULLIF(COUNT(DISTINCT "CREATEDBY_ID"), 0) AS avg_alerts_per_user
        FROM "public"."FWAS_ALERT"
        WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY DATE("CREATED_AT");
    """,
    "avg_alert_history_per_user": f"""
        SELECT DATE("CREATED_AT") AS date, 
               COUNT("ID") / NULLIF(COUNT(DISTINCT "SENT_TO"), 0) AS avg_alert_history_per_user
        FROM "public"."FWAS_ALERT_HISTORY"
        WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY DATE("CREATED_AT");
    """,
    "user_created": f"""
        SELECT DATE("CREATED_AT") AS date, COUNT("ID") AS user_created
        FROM "public"."FWAS_USER"
        WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY DATE("CREATED_AT");
    """,
    "user_last_updated": f"""
        SELECT DATE("UPDATED_AT") AS date, COUNT("ID") AS user_last_updated
        FROM "public"."FWAS_USER"
        WHERE "UPDATED_AT" BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY DATE("UPDATED_AT");
    """,
    "cumulative_users": f"""
        SELECT date,
               SUM(user_created) OVER (ORDER BY date) AS cumulative_users
        FROM (
            SELECT DATE("CREATED_AT") AS date,
                   COUNT("ID") AS user_created
            FROM "public"."FWAS_USER"
            WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY DATE("CREATED_AT")
        ) sub
        ORDER BY date;
    """
}

def fetch_data(query):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(query)
    data = {}
    for row in cur.fetchall():
        key = str(row[0]) 
        value = row[1]
        if isinstance(value, Decimal):
            value = float(value)
        data[key] = value
    cur.close()
    conn.close()
    return data

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

json_filename = f"alerts_summary_{start_date}_to_{end_date}.json"
with open(json_filename, "w") as jsonfile:
    json.dump(json_data, jsonfile, indent=4)

print(f" Data saved to {json_filename}")
