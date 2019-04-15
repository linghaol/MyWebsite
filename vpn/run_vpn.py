import os
import string
from flask import json
from random import randint
from datetime import datetime
import schedule
import time
import redis

def generate_pw():
	seq = string.ascii_letters + string.digits
	password = ''.join([seq[randint(0, len(seq)-1)] for i in range(16)])
	return password

def update_pw(initial=False):
	if initial:
		password = json.load(open('./data/config.json', 'r'))['password']
		db = redis.Redis(host="100.0.0.2", port=6379)
		db.set('vpn_password', password)
		return

	os.system('ssserver -d stop')
	password = generate_pw()

	config = json.load(open('./data/config.json', 'r'))
	config['password'] = password
	json.dump(config, open('./data/config.json', 'w'))

	db = redis.Redis(host="100.0.0.2", port=6379)
	db.set('vpn_password', password)

	with open('./data/update.log', 'a') as f:
		f.write('password updated at ' +  datetime.now().strftime('%Y-%m-%d %H:%M:%S')+'\n')

	os.system('ssserver -c ./data/config.json -d start')

schedule.every(5).days.at('00:00').do(update_pw)

if __name__ == '__main__':
	os.system('ssserver -c ./data/config.json -d start')
	update_pw(initial=True)
	while True:
		schedule.run_pending()
		time.sleep(1)












