
# This is flask-based personal website.
# author: linghaol

from flask import Flask
from flask import render_template
from flask import json
from flask import request
from flask import abort
from flask import redirect
from flask import url_for
import requests

app = Flask(__name__)

# welcome
@app.route('/')
def getWelcome():
	return render_template('welcome.html')

# blogpage
@app.route('/blogpage')
def getBlogpage():
	itemList = None
	return render_template('blogpage.html', itemList=json.load(open('./content/parsed/bloglist.json')))

@app.route('/blogpage-cn')
def getBlogpage_cn():
	itemList = None
	return render_template('blogpage-cn.html', itemList=json.load(open('./content/parsed/bloglist.json')))

# service
@app.route('/service')
def getService():
	return render_template('service.html')

@app.route('/service-cn')
def getService_cn():
	return render_template('service-cn.html')

# verify user input id
@app.route('/verification', methods=['POST'])
def getVerification():
	if request.method == 'POST':
		user_id = request.form['user_id']
		recaptcha = request.form['g-recaptcha-response']
		check = requests.post('https://www.google.com/recaptcha/api/siteverify', 
			data = {'secret':'6LetGDEUAAAAAGr2WSKC4fyuXG5J85pfdJjSzTcf', 
			'response':recaptcha}).json()
		if check['success']:
			userlist = json.load(open('/shared_data/vpn/userlist.json', 'r')).values()
			password = json.load(open('/shared_data/vpn/config.json', 'r'))['password']
			if user_id in userlist:
				return json.dumps({'status':'success', 'password':password})
			else:
				return json.dumps({'status':'failed', 'error_message':'Not found in userlist. Please refresh and try again.'})
		else:
			return json.dumps({'status':'failed', 'error_message': 'reCAPTCHA not passed.'})
	else:
		abort(403)

@app.route('/verification-cn', methods=['POST'])
def getVerification_cn():
	if request.method == 'POST':
		user_id = request.form['user_id']
		userlist = json.load(open('/shared_data/vpn/userlist.json', 'r')).values()
		password = json.load(open('/shared_data/vpn/config.json', 'r'))['password']
		if user_id in userlist:
			return json.dumps({'status':'success', 'password':password})
		else:
			return json.dumps({'status':'failed', 'error_message':'Not found in userlist. Please refresh and try again.'})
	else:
		abort(403)

# stats
@app.route('/stats')
def getStats():
	return redirect(url_for('getError'))
	# render_template('stats.html')

@app.route('/stats-cn')
def getStats_cn():
	return redirect(url_for('getError_cn'))
	# render_template('error-cn.html')

# about me page
@app.route('/about')
def getAbout():
	return redirect(url_for('getError'))
	# render_template('error.html')

@app.route('/about-cn')
def getAbout_cn():
	return redirect(url_for('getError_cn'))
	# render_template('error-cn.html')

# render article
@app.route('/blog/<article_title>')
def getArticle(article_title):
	return render_template('article.html', 
		article=json.load(open('./content/parsed/'+article_title+'.json')))

@app.route('/blog/<article_title>-cn')
def getArticle_cn(article_title):
	return render_template('article-cn.html', 
		article=json.load(open('./content/parsed/'+article_title+'.json')))

@app.route('/error')
def getError():
	return render_template('error.html')

@app.route('/error-cn')
def getError_cn():
	return render_template('error-cn.html')

# load data
@app.route('/load/<dataname>')
def getData(dataname):
	data = json.load(open('./static/data/'+dataname+'.json'))
	return json.dumps(data)

# download data
@app.route('/download/<filename>')
def getFile(filename):
	return redirect(url_for('static', filename='data/'+filename))


if __name__ == "__main__":
	# bind app to port 8000
	app.run(host='0.0.0.0', port=8000)



