#Imports
from flask import Flask,render_template
from sqlalchemy import create_engine, ForeignKey, String, Integer, column
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


Base = declarative_base()
db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

#Association table
student_lesson = db.Table('student_lesson',
db.column('StudentID', db.Integer, db.ForeignKey('Student.ID')),
db.column('Lessons_UUID', db.Integer, db.ForeignKey('Lessons.UUID'))
)

#Creating Student class 
class Students(Base):
    __tablename__= "Students"
    StudentID= column("StudentID", String, primary_key=True, default=generate_uuid)
    StudentName= column("StudentName", String)
    StudentEmail= column("StudentEmail", String)
    StudentPassword= column("StudentPassword", String)
    Selected = db.relationship('Lessons', secondary= student_lesson, backref='Lessons Selected')

    def __init__(self,StudentName,StudentEmail,StudentPassword):
        self.StudentName = StudentName
        self.StudentEmail = StudentEmail
        self.StudentPassword = StudentPassword

#Creating Lesson class
class Lessons(Base):
    __tablename__="Lessons"
    LessonsID= column("LessonsID", String, primary_key=True, default=generate_uuid)
    LessonTitle= column("UniqueID", String)
    Level= column("Level", String)

    def __init__(self,LessonTitle,Level):
        self.LessonTitle = LessonTitle
        self.Level = Level

#FUNCTION FOR ADDING STUDENTS
def add_students(StudentName,StudentEmail,StudentPassword,session):
    exist = session.query(Students).filter(StudentEmail==StudentEmail).all()
    if len(exist)>0:
        print("This Email Address already exist")
    else:
        student = Students(StudentName,StudentEmail,StudentPassword)
        session.add(student)
        session.commit()
        

db = "sqlite:///socialDB.db"
engine = create_engine(db)
Base.metadata.create_all(bind=engine)


session =sessionmaker(bind=engine)
session = session()


#ADDING LESSONS TO DATABASE
...
#lesson = Lessons(LessonTitle="Fundamentals of Programming",Level="100")
#session.add(student)
#session.commit()
    

app = Flask(__name__)


@app.route("/home")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)