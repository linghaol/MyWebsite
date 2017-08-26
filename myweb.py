# This is flask-based personal website

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
# from pymongo import MongoClient

app = Flask(__name__)

# index
@app.route('/')
#def recordVisitor():
#	db_client['mywebsite']['visitor']

def index(name=None):
	return render_template('blogpage.html', name='Real Title')

# blog page
@app.route('/blogpage')
def blog():
	return render_template('blogpage.html')

# stats
@app.route('/stats')
def stats():
	return render_template('stats.html')

# about me page
@app.route('/about')
def about():
	return render_template('about.html')

@app.route('/ip')
def ip_check():
	return jsonify({'server ip':request.remote_addr, 'visitor ip':request.environ['REMOTE_ADDR']})

if __name__ == "__main__":
	# connect to DB
	# db_client = MongoClient(host='localhost', port='27017', username=USERNAME, password=KEY)
	# bind app to port 5000
	app.run(host='0.0.0.0', port=5000, debug=True)



