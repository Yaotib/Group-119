from flask import Blueprint, render_template
from flask_login import  login_required, current_user

views = Blueprint('views', __name__)


@views.route('/')
def log_in():
    return render_template("login.html")

@views.route('/signup')
def signup():
    return render_template("signup.html")

@views.route('/home')
@login_required
def home():
    return render_template("index.html", user=current_user)


@views.route('/lessons')
@login_required
def lessons():
    return render_template("lessons.html", user=current_user)

@views.route('/about-us')
@login_required
def about_us():
    return render_template("about.html", user=current_user)

@views.route('/contact-us')
@login_required
def contact_us():
    return render_template("contact.html", user=current_user)


