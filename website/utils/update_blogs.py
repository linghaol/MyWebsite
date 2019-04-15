'''
Author: linghaol

script for updating blogs(local)
'''

import os
import sys
from flask import json
from datetime import datetime
from Tools import FileParser

if __name__ == '__main__':
	_, *filenames = sys.argv
	os.chdir(os.path.dirname(os.path.realpath(__file__)))
	if not filenames:
		filenames = [f.rsplit('.', maxsplit=1)[0] for f in os.listdir('../content/blogs')]
	
	bloglist = json.load(open('../content/parsed_blogs/bloglist.json', 'r'))
	
	for fname in filenames:
		attr1, attr2 = FileParser.parse('../content/blogs/'+fname+'.md', 'blog')

		# update bloglist
		for i, blog in enumerate(bloglist):
			if blog['label'] == attr1['label']:
				bloglist.pop(i)
				break
		bloglist.append(attr1)
		bloglist.sort(key=lambda x: datetime.strptime(x['date'].split(maxsplit=2)[-1], '%b %d, %Y'), reverse=True)

		# dump full blog
		attr1.update(attr2)
		json.dump(attr1, open('../content/parsed_blogs/'+fname+'.json', 'w'))

	# dumps bloglist
	json.dump(bloglist, open('../content/parsed_blogs/bloglist.json', 'w'))
