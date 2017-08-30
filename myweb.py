# This is flask-based personal website

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from pymongo import MongoClient
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
	db = db_client['mywebsite']['blog']
	blogs = db.find()
	db_client.close()
	return render_template('blogpage.html', itemList=blogs)

# blog page
@app.route('/blogpage')
def blogpage(itemList=None):
	db_client = MongoClient(host='mymongo', port=27017)
	db = db_client['mywebsite']['blog']
	blogs = db.find()
	db_client.close()
	return render_template('blogpage.html', itemList=blogs)

# stats
@app.route('/stats')
def stats():
	return render_template('error.html')

# about me page
@app.route('/about')
def about():
	return render_template('error.html')

# error handle
@app.errorhandler(404)
def not_found(error):
	return render_template("error.html"), 404

if __name__ == "__main__":
	# bind app to port 5000
	app.run(host='0.0.0.0', port=5000, debug=True)



