import psycopg2
import json
import re
from datetime import datetime, timedelta

DB_CONFIG = {
    "dbname": "fwas_db_latest",
    "user": "postgres",
    "password": "Deeksha@123$",
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

def extract_forecast_date(text):
    match = re.search(r'for\s+\d{2}:\d{2}\s+(\d{2}/\d{2}/\d{2})', text)
    if match:
        date_str = match.group(1)
        month, day, year = date_str.split('/')
        return f"20{year}-{month.zfill(2)}-{day.zfill(2)}"
    return None

forecast_types = ["Wind Speed", "Wind Gust", "Precipitation"]
warning_keywords = [
    "Flood Warning", 
    "Flood Advisory", 
    "Flood Watch", 
    "Special Weather Statement", 
    "Winter Weather Advisory", 
    "Hydrologic Outlook"
]

start_date = get_date_input("Enter start date (YYYY-MM-DD): ")
end_date = get_date_input("Enter end date (YYYY-MM-DD): ")

if start_date > end_date:
    print("Start date must be before end date!")
    exit()

QUERY = f"""
    SELECT "CREATED_AT", "CONTENT_JSON"
    FROM "public"."FWAS_ALERT_HISTORY"
    WHERE "CREATED_AT" BETWEEN '{start_date}' AND '{end_date}'
"""

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()
cur.execute(QUERY)
rows = cur.fetchall()
cur.close()
conn.close()

aggregated_data = {}

for row in rows:
    created_at, content_json = row
    if isinstance(content_json, list):
        alerts = content_json
    else:
        try:
            alerts = json.loads(content_json)
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
                    if forecast_date is None:
                        forecast_date = created_at.date().strftime("%Y-%m-%d")
                    if forecast_date not in aggregated_data:
                        aggregated_data[forecast_date] = {ft: 0 for ft in forecast_types}
                        aggregated_data[forecast_date].update({kw: 0 for kw in warning_keywords})
                    aggregated_data[forecast_date][display_name] += 1
        elif display_name == "NWS Warnings":
            day = created_at.date().strftime("%Y-%m-%d")
            if day not in aggregated_data:
                aggregated_data[day] = {ft: 0 for ft in forecast_types}
                aggregated_data[day].update({kw: 0 for kw in warning_keywords})
            for entry in entries:
                if entry.get("type") == "weather_warning":
                    text = entry.get("metric_plain_text", "")
                    for keyword in warning_keywords:
                        if keyword in text:
                            aggregated_data[day][keyword] += 1

current_date = start_date
while current_date <= end_date:
    d = current_date.strftime("%Y-%m-%d")
    if d not in aggregated_data:
        aggregated_data[d] = {ft: 0 for ft in forecast_types}
        aggregated_data[d].update({kw: 0 for kw in warning_keywords})
    current_date += timedelta(days=1)

output_data = []
cumulative = {field: 0 for field in forecast_types + warning_keywords}
for day in sorted(aggregated_data.keys()):
    entry = {"date": day}
    for field in forecast_types + warning_keywords:
        count = aggregated_data[day].get(field, 0)
        entry[field] = count
        cumulative[field] += count
        entry["cumulative_" + field.replace(" ", "_")] = cumulative[field]
    output_data.append(entry)

json_filename = f"alert_counts_{start_date}_to_{end_date}.json"
with open(json_filename, "w") as outfile:
    json.dump(output_data, outfile, indent=4)

print(f"Data saved to {json_filename}")
