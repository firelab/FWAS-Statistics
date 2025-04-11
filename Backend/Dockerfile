FROM python:3.8-slim
WORKDIR /app

COPY . /app
RUN pip3 install --upgrade pip && pip install --no-cache-dir -r /app/requirements.txt
RUN chmod 777 /app/bin/boot.sh
EXPOSE 9091

ENTRYPOINT ["/app/bin/boot.sh"]