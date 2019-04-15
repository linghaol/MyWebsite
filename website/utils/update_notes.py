'''
Author: linghaol

script for updating notes(database)
'''

import os
import sys
import redis
from flask import json
from Tools import FileParser


if __name__ == '__main__':
	_, *notenames = sys.argv
	os.chdir(os.path.dirname(os.path.realpath(__file__)))
	if not notenames:
		notenames = [_.rsplit('.', maxsplit=1)[0] for _ in os.listdir('../content/notes')]
	
	# redis ip: 100.0.0.2 in a customized docker network
	db = redis.Redis(host="100.0.0.2", port=6379)

	for name in notenames:
		attr = FileParser.parse('../content/notes/'+name+'.md', 'note')
		if not db.sismember("notename", name):
			db.sadd("notename", name)
			db.rpush("notelist", json.dumps(attr))
		else:
			index = int(name[-1])-1
			db.lset("notelist", index, json.dumps(attr))
	














