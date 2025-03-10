FROM python:3.8-slim
WORKDIR /app

COPY . /app
RUN pip3 install --upgrade pip && pip install --no-cache-dir -r /app/requirements.txt
EXPOSE 9091

CMD ["gunicorn","app:app","-b","0.0.0.0:9091","-w","4"]