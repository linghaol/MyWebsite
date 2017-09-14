
'''
Update blogs
'''

import os
import json
from Blogparser import blogparser

if __name__ == '__main__':
	# update articles in content folder
	mdlist = [mdname.split('.')[0] for mdname in os.listdir('./content/markdown')]
	parsedlist = os.listdir('./content/parsed')
	for article in mdlist:
		if article not in parsedlist:
			parser = blogparser()
			blog = parser.parse('./content/markdown/'+article+'.md')
			listitem = dict((i, blog[i]) for i in ['title', 'time', 'author', 'intro'])
			if 'bloglist' not in parsedlist:
				with open('./content/parsed/bloglist', 'w') as f:
					f.write(json.dumps([listitem]))
			else:
				with open('./content/parsed/bloglist', 'r') as f:
					bloglist = json.loads(f.read())
				with open('./content/parsed/bloglist', 'w+') as f:
					bloglist.append(listitem)
					f.write(json.dumps(bloglist))
			with open('./content/parsed/'+article, 'w') as f:
				f.write(json.dumps(blog))
			parsedlist = os.listdir('./content/parsed')
