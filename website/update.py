
'''
author: linghaol

Update blogs
'''

import os
from flask import json
from datetime import datetime
from Blogparser import blogparser

if __name__ == '__main__':
	# update articles in content folder
	mdlist = [mdname.rsplit('.', maxsplit=1)[0] for mdname in os.listdir('./content/markdown')]
	parsedlist = [psname.rsplit('.', maxsplit=1)[0] for psname in os.listdir('./content/parsed')]
	for article in mdlist:
		if article not in parsedlist:
			parser = blogparser()
			blog = parser.parse('./content/markdown/'+article+'.md')
			listitem = {i: blog[i] for i in ['title', 'link', 'date', 'author', 'intro']}
			bloglist = json.load(open('./content/parsed/bloglist.json', 'r'))
			bloglist.append(listitem)
			json.dump(sorted(bloglist, key=lambda x: datetime.strptime(x['date'].split(maxsplit=2)[-1], '%b %d, %Y'), reverse=True), 
					      open('./content/parsed/bloglist.json', 'w'))
			json.dump(blog, open('./content/parsed/'+article+'.json', 'w'))
			parsedlist = [psname.split('.')[0] for psname in os.listdir('./content/parsed')]
