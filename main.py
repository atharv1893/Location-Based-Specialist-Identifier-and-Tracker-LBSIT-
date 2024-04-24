from flask import Flask, render_template, request, redirect, url_for
import getpass
import smtplib
from pymongo import MongoClient
import hashlib



        
app = Flask(__name__, static_url_path='/static')

# Connect to MongoDB
client = MongoClient('mongodb+srv://resq:resqdata@userdata.mzpptuy.mongodb.net/')
db = client['User_Data']  # Choose your database
collection = db['Register']


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


@app.route('/',methods=['GET', 'POST'])
def home():
    latest_login = collection_login.find_one({}, sort=[('_id', -1)])
    latest_email = latest_login.get('email') if latest_login else None

    db = client['User_Data']  # Choose your database
    fb_collection = db['FeedBack']
    if latest_email:
        user_info = collection.find_one({'email': latest_email})
        latest_firstname = user_info.get('firstname') if user_info else None
    else:
        latest_firstname = None

    if request.method == 'POST':
        # Get form data
        email = request.form['email']
        title = request.form['title']
        description = request.form['description']
        
        feedback = {
                 'email' : email,
            'title' : title,
            'description' : description,
            }
        fb_collection.insert_one(feedback)
        HOST = "smtp-mail.outlook.com"
        PORT = 587
        MAIL_USERNAME = 'resqhealth@outlook.com'
        TO_EMAIL = email 
        subject = f"{title}"
        message_body = f"""
Subject: {subject}
Hello, User

Thank you for your feedback. Below are the details of your submission:

Title: {title}
Description: {description}

We appreciate your effort in helping us enhance our website. Your feedback contributes to our ongoing commitment to deliver the best experience to our users.

If you have any further comments or suggestions, please feel free to reach out to us. We're here to listen and address any concerns you may have.

Thank you once again for your valuable feedback.

Best regards,
ResQ Team
        """

        # Connect to the SMTP server and send the email
        smtp = smtplib.SMTP(HOST, PORT)
        smtp.ehlo()
        
        smtp.starttls()
        
        smtp.login(MAIL_USERNAME, "resq1234")
        
        smtp.sendmail(MAIL_USERNAME, TO_EMAIL, message_body)
        smtp.quit() 
        return render_template('index.html',latest_firstname=latest_firstname)  # Redirect to login page after successful registration


    return render_template('index.html',latest_firstname=latest_firstname)


@app.route('/information', methods=['GET', 'POST'])
def information():
    latest_login = collection_login.find_one({}, sort=[('_id', -1)])
    latest_email = latest_login.get('email') if latest_login else None

    if latest_email:
        user_info = collection_login.find_one({'email': latest_email})
        latest_firstname = user_info.get('firstname') if user_info else None
    else:
        latest_firstname = None

    if request.method == 'POST':
        if 'login_submit' in request.form:  # Check if the login form is submitted
            # Get login form data
            email = request.form['email']
            password = request.form['password']
            hashed_password = hashlib.sha1(password.encode()).hexdigest()

            # Check if user exists in the database
            user = collection_login.find_one({'email': email, 'password': hashed_password})
            if user:
                # User found, redirect to home page
                return redirect(url_for('home'))
            else:
                # User not found, render a popup message
                return render_template('popup.html')

        elif 'feedback_submit' in request.form:  # Check if the feedback form is submitted
            # Get feedback form data
            email = request.form['email']
            title = request.form['title']
            description = request.form['description']
            
            # Insert feedback data into MongoDB
            feedback = {
                'email': email,
                'title': title,
                'description': description,
            }
            fb_collection.insert_one(feedback)

            # Redirect to the same page after successful form submission
            return redirect(url_for('information'))

    return render_template('information.html', latest_firstname=latest_firstname)
collection_login = db['Login']


@app.route('/login', methods=['GET', 'POST'])
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


@app.route('/register', methods=['GET', 'POST'])
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


@app.route('/check')
def check():
    return render_template('check.html')


if __name__ == '__main__':
    app.run(debug=True)
