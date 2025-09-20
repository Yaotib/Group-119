print(">>> Running auth.py from:", __file__)

from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import Student
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        student = Student.query.filter_by(email=email).first()
        if student:  # Check the instance, not the class
            if check_password_hash(student.password_hash, password):  # Use password_hash
                flash('Logged in successfully', category='success')
                login_user(student, remember=True)  # Pass the instance, not the class
                return redirect(url_for('views.home'))
            else:
                flash('Incorrect password, try again.', category='error')
        else:
            flash('Email does not exist, try again.', category='error')
    return render_template("login.html")

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        password1 = request.form.get('password')
        password2 = request.form.get('repeat_password')

        student = Student.query.filter_by(email=email).first()

        if student:  # Check the instance, not the class
            flash('Email already exists', category='error')
        elif len(email) < 4:
            flash('Email must be more than 4 characters', category='error')
        elif len(first_name) < 2:
            flash('First name must be more than a character.', category='error')
        elif len(last_name) < 2:
            flash('Last name must be more than a character', category='error')
        elif password1 != password2:  # Password confirmation check
            flash('Passwords don\'t match.', category='error')
        elif len(password1) < 8:
            flash('Password must be more than 7 characters.', category='error')
        else:
            # Create new student with password_hash field
            new_student = Student(
                first_name=first_name, 
                last_name=last_name, 
                email=email, 
                password_hash=generate_password_hash(password1, method='pbkdf2:sha256')
            )
            db.session.add(new_student)
            db.session.commit()
            login_user(new_student, remember=True)  # Pass the new instance
            flash('Account created!', category='success')
            return redirect(url_for('views.home'))
        
    return render_template("signup.html")