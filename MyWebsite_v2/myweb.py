# This is flask-based personal website

from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from pymongo import MongoClient
from datetime import datetime
import json

app = Flask(__name__)

# index
@app.route('/')
def index():
	# connect to DB and record visitor ip, time
	db_client = MongoClient(host='mymongo', port=27017)
	db = db_client['mywebsite']['visitor']
	db.insert_one({'visitor ip':request.headers.get('X-Forwarded-For', request.remote_addr), 'date':datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
	return redirect(url_for('getBlogpage'))

# blog page
@app.route('/blogpage')
def getBlogpage(itemList=None):
	with open('./content/parsed/bloglist', 'r') as f:
		bloglist = json.loads(f.read())
	return render_template('blogpage.html', itemList=sorted(bloglist, key=lambda x: datetime.strptime(x['time'], '%Y-%m-%d'), reverse=True))

# stats
@app.route('/stats')
def getStats():
	return render_template('error.html')

# about me page
@app.route('/about')
def getAbout():
	return render_template('error.html')

# render article
@app.route('/blogpage/<article_title>')
def getArticle(article_title, art=None):
	with open('./content/parsed/'+article_title, 'r') as f:
		art = json.loads(f.read())
	return render_template('article.html', article=art)

# error handle
@app.errorhandler(404)
def not_found(error):
	return render_template("error.html"), 404

if __name__ == "__main__":
	# bind app to port 5000
	app.run(host='0.0.0.0', port=5000)



