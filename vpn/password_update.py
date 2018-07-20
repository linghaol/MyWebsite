import os
import string
from flask import json
from random import randint
from datetime import datetime
import schedule
import time

def pw_generator():
	seq = string.ascii_letters + string.digits
	password = ''.join([seq[randint(0, len(seq)-1)] for i in range(16) ])
	return password

def updateJob():
	os.system('ssserver -d stop')
	conf = json.load(open('/shared_data/vpn/config.json', 'r'))
	conf['password'] = pw_generator()
	json.dump(conf, open('/shared_data/vpn/config.json', 'w'))
	with open('/shared_data/vpn/update.log', 'a') as f:
		f.write('password changed : ' +  datetime.now().strftime('%Y-%m-%d %H:%M:%S')+'\n')
	os.system('ssserver -c /shared_data/vpn/config.json -d start')

schedule.every(5).day.at('00:00').do(updateJob)

if __name__ == '__main__':
	os.system('ssserver -c /shared_data/vpn/config.json -d start')
	while True:
		schedule.run_pending()
		time.sleep(1)












