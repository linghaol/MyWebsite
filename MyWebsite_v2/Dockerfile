FROM python:3.6-onbuild

EXPOSE 5000

RUN mkdir ./content/parsed

CMD python update.py

CMD gunicorn myweb:app --log-file - --bind 0.0.0.0:5000
