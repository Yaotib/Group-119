

class lesson{
    constructor(){
this.studentlessons = {
    level100: ["Algebra and Trignometery","Statistics and Probability","Calculus1","Matrices and Geometry", "Programming Fundamentals",
        "Office Productivity tools","Introduction to Computer Science","Hardware Fundamentals and Circuitry","Critical Thinking"],

    level200: ["Academic Writing","Information Systems","Calculus II", "computer Organization and Architcture","Numerical Methods","Intruduction to African Studies",
         "Programming II","Data Structures & Algorithms","Data Communications & Networking I","Computer Ethics","Digital Electronics","Introductory Abstract Algebra",
         "Introductory Computational mathematics"],

    level300:["Object Oriented Analysis & Design","Discrete Matheamtics","Web Technologies and Development","Database Management Systems","Operating Systems",
        "Embedded Systems","Computer Vision","Introduction to Computer Graphics","Programming III(VB .NET)","Design and Analysis of Algorithms","Software Engineering ", 
        "Introduction to Artificial Intelligence","Research Methods in Computing","Introduction to Robotics","Introduction to Parallel Computing","Advanced Web Technologies"],

    level400:["Compilers","Theory and Survry of Programming Languages","Formal Methods and Models","accounting Principles in Computing","Software Modeling and Simulation",
        "Data Mining an& Warehousing","Data Communication and Networking II","System Programming","Computer Systems Security","Human Computer Interaction",
        "Management Principles in Computing","Multimedia Applications","Expert Systems","Concurrent & Distributed Systems","Mobile Computing"]
    
}
} 
}

window.onload = function(){
    const lessonSelect = document.getElementById("lessonSelect");
    if(lessonSelect){
        available.forEach(lesson =>{
            let option = document.createElement("option");
            option.value = lesson;
            option.textContent = lesson;
            lessonSelect.appendChild(option);
        });
    }
};


let student;

function getStudent(){
    const studentId = document.getElementById("studentId").value;
    const studentName = document.getElementById("studentName").value;
    if(!student){
        student = new lessonManager(studentId, studentName);
    }
    return student;
}

function addlesson() {
    const s = getStudent();
    const lesson = document.getElementById("lessonSelect").value;
    s.addlesson(lesson);
}

function deleteLesson(){
    const s = getElementById();
    const oldlesson = prompt("Enter the lesson you want to update: ");
    const newlesson = document.getElementById("lessonSelect").value;
    s.updatelesson(oldlesson,newlesson);
}


