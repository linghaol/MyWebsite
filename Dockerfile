FROM python:3.6-onbuild

EXPOSE 8000

RUN python ./update.py

CMD gunicorn -w 4 myweb:app --log-file - --bind 0.0.0.0:8000
