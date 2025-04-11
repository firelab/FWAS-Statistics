#!/bin/sh
gunicorn app:app \
	--workers 2 \
	--threads 2 \
	--bind 0.0.0.0:9091 \
	--capture-output \
	--access-logfile '-' \
	--error-logfile '-'