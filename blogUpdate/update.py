
'''
Update blogs in database
'''

import os
from pymongo import MongoClient
from Blogparser import blogparser

if __name__ == '__main__':
	db_client = MongoClient(host='mymongo', port=27017)
	db = db_client['mywebsite']['blog']
	# update articles in content folder
	articleList = os.listdir('./content')
	for article in articleList:
		if not db.find_one({'title':article.split('.')[0]}):
			parser = blogparser()
			blog = parser.parse('./content/'+article)
			db.insert_one(blog)
	db_client.close()
