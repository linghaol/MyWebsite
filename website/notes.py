
# To parse notes and update to redis

import os
import redis
from flask import json
from markdown2 import markdown

def note_parser(path):
	note = {}
	with open(path) as f:
		file = f.read().split('//////')
	note["title"] = file[0].strip()
	note["content"] = markdown(file[1].strip(), extras=['fenced-code-blocks'])
	return note


if __name__ == '__main__':
	# redis ip: 192.168.1.2 in a user-defined docker network 192.168.1.1/8
	db = redis.Redis(host="100.0.0.2", port=6379)
	namelist = [_.rsplit('.', maxsplit=1)[0] for _ in os.listdir('./content/notes')]
	for name in namelist:
		if not db.sismember("notename", name):
			db.sadd("notename", name)
			note = note_parser('./content/notes/'+name+'.md')
			db.rpush("notelist", json.dumps(note))













