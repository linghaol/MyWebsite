FROM python:3.6-onbuild

EXPOSE 5000

RUN if [ ! -d "./content/parsed" ]; then mkdir ./content/parsed; fi

RUN python ./update.py

CMD gunicorn myweb:app --log-file - --bind 0.0.0.0:5000
