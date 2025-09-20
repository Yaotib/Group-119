from . import db
from flask_login import UserMixin

class Student(db.Model, UserMixin):
    __tablename__ = 'student'  # lowercase
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    lessons = db.relationship('Lesson', backref='student', lazy=True)


class Lesson(db.Model):
    __tablename__ = 'lessons'  # lowercase
    id = db.Column(db.Integer, primary_key=True)
    lesson_title = db.Column(db.String(50), nullable=False)
    level = db.Column(db.String(50))
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)  # matches Student.__tablename__
