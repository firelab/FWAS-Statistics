
# Fwas Statistics 

This application is used to generate the Statistics about the Fire Weather Alert system with the charts and numbers indicating the total number of users and alerts that were sent out

## API Reference

#### Get User Statistcs

```http
  GET /user_dashboard
```
Returns 

| Response | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `total_users`      | `integer` | Total Users using the app |
| `active_users`      | `integer` | Total Active Users |
| `inactive_users`      | `integer` | Total Inactive Users |
| `agencies`      | `integer` | Total distinct agencies using the app |
| `job_titles`      | `integer` | Total distinct job titles of the users |

#### Get User Charts Data

```http
  GET /user_summary?start_date={StartDate}&end_date={EndDate}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `StartDate`      | `Date{YYYY-MM-DD}` | **Required**. start date of the results |
| `EndDate`      | `Date{YYYY-MM-DD}` | **Required**. end date of the results |

Returns
list of objects with following field on 1 day intervals
| Response | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `date`      | `string` | Date coresponding to the data in the object |
| `user_created`      | `integer` | Number of users created on that date |
| `cumulative_users`      | `integer` | Total Users created from the start date|
| `user_last_updated`      | `integer` | Users Last active on this date |
| `avg_alerts_per_user`      | `integer` | average number of watches per users |
| `avg_alert_history_per_user`      | `integer` | average alerts that were sent out |



#### Get Alert Statistcs

```http
  GET /alert_dashboard
```
Returns 

| Response | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `total_watches`      | `integer` | Total Watches |
| `active_watches`      | `integer` | Total Active Watches |
| `expired_watches`      | `integer` | Total Expired Watches |
| `processing_watches`      | `integer` | Watches in processing state |

#### Get Alerts Charts Data

```http
  GET /alert_summary?start_date={StartDate}&end_date={EndDate}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `StartDate`      | `Date{YYYY-MM-DD}` | **Required**. start date of the results |
| `EndDate`      | `Date{YYYY-MM-DD}` | **Required**. end date of the results |

Returns
list of objects with following field on 1 day intervals
| Response | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `date`| `string`  | Date corresponding to the data in the object         |
| `Flood Advisory`| `integer` | Number of Flood Advisory alerts issued on this date  |
| `Flood Warning`| `integer` | Number of Flood Warning alerts issued on this date   |
| `Flood Watch`| `integer` | Number of Flood Watch alerts issued on this date     |
| `Hydrologic Outlook`| `integer` | Number of Hydrologic Outlook alerts issued on this date |
| `Precipitation`| `integer` | Number of Precipitation alerts issued on this date   |
| `Special Weather Statement`| `integer` | Number of Special Weather Statement alerts on this date |
| `Wind Gust`| `integer` | Number of Wind Gust alerts issued on this date       |
| `Wind Speed`| `integer` | Number of Wind Speed alerts issued on this date      |
| `Winter Weather Advisory`| `integer` | Number of Winter Weather Advisory alerts on this date |
| `cumulative_Flood_Advisory`| `integer` | Total Flood Advisory alerts issued since start date  |
| `cumulative_Flood_Warning`| `integer` | Total Flood Warning alerts issued since start date   |
| `cumulative_Flood_Watch`| `integer` | Total Flood Watch alerts issued since start date     |
| `cumulative_Hydrologic_Outlook`| `integer` | Total Hydrologic Outlook alerts issued since start date |
| `cumulative_Precipitation`| `integer` | Total Precipitation alerts issued since start date   |
| `cumulative_Special_Weather_Statement` | `integer` | Total Special Weather Statement alerts issued since start date |
| `cumulative_Wind_Gust`| `integer` | Total Wind Gust alerts issued since start date|
| `cumulative_Wind_Speed`| `integer` | Total Wind Speed alerts issued since start date      |
| `cumulative_Winter_Weather_Advisory` | `integer` | Total Winter Weather Advisory alerts issued since start date |


