from flask import Flask, render_template, request
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['test_database']  # Choose your database
collection = db['users']  # Choose your collection

@app.route('/dbconn', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        name = request.form['name']
        # Insert the user's name into MongoDB
        collection.insert_one({'name': name})
        return 'Name successfully added to MongoDB!'
    return render_template('dbconn.html')

if __name__ == '__main__':
    app.run(debug=True)
