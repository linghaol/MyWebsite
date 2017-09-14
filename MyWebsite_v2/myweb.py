# This is flask-based personal website

from flask import Flask
from flask import render_template
from flask import url_for
from flask import json

app = Flask(__name__)

# index & blog
@app.route('/')
def getBlogpage(itemList=None):
	return render_template('blogpage.html', itemList=json.load(open('./content/parsed/bloglist.json')))

# stats
@app.route('/stats')
def getStats():
	return render_template('error.html')

# about me page
@app.route('/about')
def getAbout():
	return render_template('error.html')

# render article
@app.route('/blog/<article_title>')
def getArticle(article_title):
	return render_template('article.html', article=json.load(open('./content/parsed/'+article_title+'.json')))

# error handle
@app.errorhandler(404)
def not_found(error):
	return render_template("error.html"), 404

if __name__ == "__main__":
	# bind app to port 5000
	app.run(host='0.0.0.0', port=5000)



