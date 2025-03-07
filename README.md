
# Fwas Statistics 

This application is used to generate the Statistics about the Fire Weather Alert system with the charts and numbers indicating the total number of users and alerts that were sent out




## Technologies Used
This application can be build using the docker environtment and also the source build. Since teh Ninjastorm server has an existing installation of the dependencies whicha re currently in use by other application. We did not want this application to interfere/ update the depedencies. Using the containerized version we can avoid this by isolating the environments.
### Frontend
- Dependencies : ReactJS, Javascript, HTML, CSS, Material UI, AMCharts
- Motivation : React and MaterialUI were chosen as they are responsive and used within other Fire Lab projects. AMCharts is used to make the maps integration more User freindly after comparing different libraries.

### Backend
- Dependencies : Python, Flask, Psycopg2.
- Motivation : Python flask application is usefull for handling the database queries easier and also performing the required preprocessing to help in responsive output to the frontend which much of the filtering and data processing done in the backend.
## Installation of Frontend

To run this application Frontend on you local machine you can follow one of the two methods
- [Docker Installation](#docker-installation)
- [Build From Source](#build-from-source)


### Docker Installation
- For this method of installtion you need to have a installation of Docker, Docker engine and Docker-Compose in your environment
- Navigate into the Frontend/fwas-statistics directory using
```bash
  cd Frontend/fwas-statistics
```
- Build the container image using Docker build you can also tag the image for future reference using ```-t``` aurgument.
```bash
  docker build -t fwaswebapp .
```
- After building the app you can run the app using the docker run command but you need to map the ports to access it on the local machine here is the general command used to run the environment. You can also name your container running the instance with ```--name``` 
```bash
  docker run -d -p 9090:9090 --name fwasweb fwaswebapp
```
- Now you can access the Frontend application on [http://localhost:9090](http://localhost:9090)

### Build From Source
- For this method of installtion you need to have node-20.17 if you already have node installed on your machine you can find it version using the following command:
```bash 
  node --version
```
- Once you verify the version you can install the packages that are needed using 
```bash
  npm install
```
- Then you can directly run the application using 
```bash
  npm run dev
```

## Installation of Database

To create the application's database on you local machine you can follow one of the two methods
- [Docker Restore](#docker-installation)
- [Local Restore](#build-from-source)


### Docker Installation
- For this method of installtion you need to have a installation of Docker, Docker engine and Docker-Compose in your environment
- Navigate into the Database directory using
```bash
  cd Database
```
- Build the container image using Docker build you can also tag the image for future reference using ```-t``` aurgument.
```bash
  docker build -t fwasdatabase .
```
- After building the container you can run the database using the docker run command but you need to map the ports and the postgresql environmental variables to access it on the local machine here is the general command used to run the environment. You can also name your container running the instance with ```--name``` 
```bash
  docker run -d -p 5431:5432 -e POSTGRES_DB=fwas -e POSTGRES_User=fwas -e POSTGRES_PASSWORD=<same password in backend> --name fwasdb fwasdatabase
```
- Now you can access the database on [http://localhost:5431](http://localhost:5431)

### Build From Source
- For this method of installtion you need to have postgreSQL 17-3.5 if you already have node installed on your machine you can find it version using the following command:
```bash 
  psql -U postgres --version
```
- Once you verify the version you can Create the database using 
```bash
  createdb -U postgres -h localhost -p <same password in backend> fwas
```
- Copy the database dump from technosylva into the database folder.
- Then you can restore the production dump file using 
```bash
  pg_restore -U postgres -Fc -d fwas ./fwas.dump
```

## Installation of Backend
You can run this application on your local using python.

- You need to have the python installation on your local machine.
- Create a virtual environment using the following command so that the appilcation dependencies dont have any conflicts with your existing python installation
```bash
python -m venv fwas
```
- Activate the python environment using
```bash
source fwas/bin/active
```
- Install the dependencies using the following command
```bash
  pip install -r requirements.txt
```
- Check the variable in the starting of the app.py to ensure that the connection to the database is successful.
- Now run the application using 
```bash
python app.py
```

## Bakcend API Reference

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


