
'''
Update blogs
'''

import os
from flask import json
from datetime import datetime
from Blogparser import blogparser

if __name__ == '__main__':
	# update articles in content folder
	mdlist = [mdname.split('.')[0] for mdname in os.listdir('./content/markdown')]
	parsedlist = [psname.split('.')[0] for psname in os.listdir('./content/parsed')]
	for article in mdlist:
		if article not in parsedlist:
			parser = blogparser()
			blog = parser.parse('./content/markdown/'+article+'.md')
			listitem = dict((i, blog[i]) for i in ['title', 'time', 'author', 'intro'])
			bloglist = json.load(open('./content/parsed/bloglist.json', 'r'))
			bloglist.append(listitem)
			json.dump(sorted(bloglist, key=lambda x: datetime.strptime(x['time'], '%Y-%m-%d'), reverse=True), 
					      open('./content/parsed/bloglist.json', 'w'))
			json.dump(blog, open('./content/parsed/'+article+'.json', 'w'))
			parsedlist = [psname.split('.')[0] for psname in os.listdir('./content/parsed')]
