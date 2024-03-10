from flask import Flask, render_template, request, redirect, url_for, flash
from pymongo import MongoClient
import hashlib

app = Flask(__name__, static_url_path='/static')
# Connect to MongoDB
client = MongoClient('mongodb+srv://atharvd1893:atharv@login.wlasiru.mongodb.net/')
db = client['User_Data']  # Choose your database
collection = db['Register']

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/information', methods=['GET', 'POST'])
def information():
    if request.method == 'POST':
        # Get form data
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        email = request.form['email']
        password = request.form['password']
        hashed_password = hashlib.sha1(password.encode()).hexdigest()
        # Check if email already exists in the database
        if collection.find_one({'email': email}):
            return render_template('popup.html')  # Render a template with popup message
        else:
            # Insert data into MongoDB
            user_data = {
                'firstname': firstname,
                'lastname': lastname,
                'email': email,
                'password': hashed_password,
                'code': 0
            }

            collection.insert_one(user_data)
            return redirect(url_for('login'))  # Redirect to login page after successful registration
    else:
        return render_template('information.html')

collection_login = db['Login']
@app.route('/login',methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        hashed_password = hashlib.sha1(password.encode()).hexdigest()

        # Check if user exists in the database
        user = collection.find_one({'email': email})

        if user:
            # Check if password matches
            if user['password'] == hashed_password:
                # Insert data into MongoDB
                user_data = {'email': email}
                collection_login.insert_one(user_data)
                return redirect(url_for('location'))  # Redirect to the 'location' route
            else:
                # Password is incorrect, send alert message to the user
                return render_template('login.html', error=True)
        else:
            # User not found, send alert message to the user
            return render_template('popup_login.html') 
    else:
        return render_template('login.html')


@app.route('/register',methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Get form data
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        email = request.form['email']
        password = request.form['password']
        hashed_password = hashlib.sha1(password.encode()).hexdigest()
        # Check if email already exists in the database
        if collection.find_one({'email': email}):
            return render_template('popup.html')  # Render a template with popup message
        else:
            # Insert data into MongoDB
            user_data = {
                'firstname': firstname,
                'lastname': lastname,
                'email': email,
                'password': hashed_password,
                'code': 0
            }

            collection.insert_one(user_data)
            return redirect(url_for('login'))  # Redirect to login page after successful registration
    else:
        return render_template('register.html')

collection = db['Register']
collection_login = db['Login']

@app.route('/location')
def location():
    latest_login = collection_login.find_one({}, sort=[('_id', -1)])
    latest_email = latest_login.get('email') if latest_login else None

    # Fetch the firstname associated with the latest email from the Register table
    if latest_email:
        user_info = collection.find_one({'email': latest_email})
        latest_firstname = user_info.get('firstname') if user_info else None
    else:
        latest_firstname = None

    return render_template('location.html', latest_firstname=latest_firstname)

@app.route('/popup')
def alert():
    return render_template('popup.html')

@app.route('/map')
def cards():
    latest_login = collection_login.find_one({}, sort=[('_id', -1)])
    latest_email = latest_login.get('email') if latest_login else None

    return render_template('map.html', email=latest_email)
if __name__ == '__main__':
    app.run(debug=True)
