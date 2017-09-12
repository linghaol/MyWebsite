# This is flask-based personal website

from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from pymongo import MongoClient
from pymongo import DESCENDING
from datetime import datetime

app = Flask(__name__)

# index
@app.route('/')
def index(itemList=None):
	# connect to DB and record visitor ip, time
	db_client = MongoClient(host='mymongo', port=27017)
	db = db_client['mywebsite']['visitor']
	db.insert_one({'visitor ip':request.headers.get('X-Forwarded-For', request.remote_addr),
				   'date':datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
	db_client.close()
	return redirect(url_for('getBlogpage'))

# blog page
@app.route('/blogpage')
def getBlogpage(itemList=None):
	db_client = MongoClient(host='mymongo', port=27017)
	db = db_client['mywebsite']['blog']
	blogs = db.find(projection={'_id':False, 'detail': False}).sort('time', DESCENDING)
	db_client.close()
	return render_template('blogpage.html', itemList=blogs)

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
	db_client = MongoClient(host='mymongo', port=27017)
	db = db_client['mywebsite']['blog']
	art = db.find_one(filter={'title':article_title}, projection={'_id':False, 'intro':False})
	db_client.close()
	return render_template('article.html', article=art)

# error handle
@app.errorhandler(404)
def not_found(error):
	return render_template("error.html"), 404

if __name__ == "__main__":
	# bind app to port 5000
	app.run(host='0.0.0.0', port='5000')



