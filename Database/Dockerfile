FROM postgis/postgis:17-3.5-alpine
WORKDIR /data
COPY . /data/
COPY ./entrypoint.sh /docker-entrypoint-initdb.d/initdb.sh
RUN chmod 755 /data/entrypoint.sh