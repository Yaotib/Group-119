class lessonManager{
    constructor(studentId,studentname){
        this.studentId = studentId;
        this.studentname = studentname;
        this.lessonscatalogue = [];
      
    }

confirmationAction(message){
    let answer
    do {
        answer = prompt(`${message}  (yes/no)`.toLowerCase());    
    } while (answer !== 'yes' || answer === "no");
    return answer === "yes"
}

    addlesson(lesson){
        if(this.lessonscatalogue.length >= 5){
            showOutput("You can only register 5 lessons.");
        }

        if(!this.lessonscatalogue.includes(lesson)){
            this.lessonscatalogue.push(lesson);
            this.showOutput( `The ${lesson} has been added successfully`);
        }else{
             this.showOutput(`Lesson already added`);
        }       
      this.viewdetails();
    }

    deleteLesson(lesson){
       if(this.confirmationAction(`Are you sure you want to delete this lesson`)){
        let findindex = this.lessonscatalogue.findIndex(findlesson => findlesson == lesson)
        if(findindex !== -1){
            this.lessonscatalogue.splice(findindex,1);
        
    lessonManager.deleteLog.push({
    studentId: this.studentId,
    studentname: this.studentname,
    lesson: lesson,
    time: new Date().toLocaleString()
});
    this.showOutput(`${lesson} has been deleted successfully`) 
        }else{
    this.showOutput(`${lesson} not found. Deletion cancelled`) 
        }
    }
    }

    updateLesson(oldlesson,newlesson){
        let findIndex1 = this.lessonscatalogue.indexOf(oldlesson);
        if(index !== -1){
            if(this.confirmationAction(`Do you really want to replace ${oldlesson} with ${newlesson} ?`)){
            this.lessonscatalogue[findIndex1] = newlesson;
            this.showOutput(`${oldlesson} updated to ${newlesson}.`)
            }else{`lesson not updated.`}
        }else{
            this.showOutput(`lesson to update not found`);
        }
        this.viewdetails();
    }

    viewdetails(){
       const output = document.getElementById("output");
       output.innerHTML = `
       <h3>Student Details</h3>
       <p><b> Student ID: </b>${this.studentId}</p>
       <p><b>Name:</b> ${this.studentname}</p>
       <p><b> Lessons: </b> ${this.lessonscatalogue.length > 0 ? this.lessonscatalogue.join(",") : "No lessons added yet."}</p>
       `;
    }

    showOutput(message){
        const messages = document.getElementById("messages");
        const p = document.createElement("p");
        p.textContent = message;
        messages.appendChild(p);
    }
}

 