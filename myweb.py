# This is flask-based personal website

from flask import Flask
from flask import render_template
app = Flask(__name__)

# index
@app.route('/')
def index():
	return render_template('blogpage.html')


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



if __name__ == "__main__":
	app.run(host='0.0.0.0', port=5000, debug=True)



