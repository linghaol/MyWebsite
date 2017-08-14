# This is flask-based personal website

from flask import Flask
from flask import render_template
app = Flask(__name__)

# index
@app.route('/')
def index():
	return render_template('index.html')


# blog page








# about me page






