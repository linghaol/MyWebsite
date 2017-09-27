FROM python:3.6-onbuild

EXPOSE 8000

RUN if [ ! -d "./content/parsed" ]; then mkdir ./content/parsed; fi

RUN python ./update.py

CMD gunicorn myweb:app --log-file - --bind 0.0.0.0:8000 -w 4
