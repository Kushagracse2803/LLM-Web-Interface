from flask import Flask,render_template,request,jsonify
import openai
import os
from dotenv import load_dotenv

app=Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

if __name__=='__main__':
    app.run(debug=True)
