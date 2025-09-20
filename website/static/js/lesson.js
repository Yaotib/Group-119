class lessonManager{
    constructor(studentId, studentname, level){
        this.studentId = studentId;
        this.studentname = studentname;
        this.level = level;
        this.lessonscatalogue = [];
    }

    confirmationAction(message){
        let answer;
        do {
            answer = prompt(`${message} (yes/no)`);
            if (answer) answer = answer.toLowerCase();
        } while (answer !== 'yes' && answer !== 'no' && answer !== null);
        return answer === "yes";
    }

    addlesson(lesson){
        if(this.lessonscatalogue.length >= 7){
            this.showOutput("You can only register 7 lessons.");
            return;
        }

        if(!this.lessonscatalogue.includes(lesson)){
            this.lessonscatalogue.push(lesson);
            this.showOutput(`The "${lesson}" has been added successfully`);
        }else{
            this.showOutput(`Lesson already added`);
        }       
        this.viewdetails();
    }

    deleteLesson(lesson){
        if(this.confirmationAction(`Are you sure you want to delete this lesson`)){
            let findindex = this.lessonscatalogue.findIndex(findlesson => findlesson == lesson);
            if(findindex !== -1){
                this.lessonscatalogue.splice(findindex, 1);
                
                if (!lessonManager.deleteLog) {
                    lessonManager.deleteLog = [];
                }
                lessonManager.deleteLog.push({
                    studentId: this.studentId,
                    studentname: this.studentname,
                    lesson: lesson,
                    time: new Date().toLocaleString()
                });
                this.showOutput(`${lesson} has been deleted successfully`);
            }else{
                this.showOutput(`${lesson} not found. Deletion cancelled`);
            }
        }
        this.viewdetails();
    }

    updateLesson(oldlesson, newlesson){
        let findIndex1 = this.lessonscatalogue.indexOf(oldlesson);
        if(findIndex1 !== -1){
            if(this.confirmationAction(`Do you really want to replace ${oldlesson} with ${newlesson}?`)){
                this.lessonscatalogue[findIndex1] = newlesson;
                this.showOutput(`${oldlesson} updated to ${newlesson}.`);
            }else{
                this.showOutput(`lesson not updated.`);
            }
        }else{
            this.showOutput(`lesson to update not found`);
        }
        this.viewdetails();
    }

    viewdetails(){
        const output = document.getElementById("output");
        if (output) {
            output.innerHTML = `
            <h3>Student Details</h3>
            <p><b>Student ID:</b> ${this.studentId}</p>
            <p><b>Name:</b> ${this.studentname}</p>
            <p><b>Level:</b> ${this.level}</p>
            <p><b>Lessons:</b> ${this.lessonscatalogue.length > 0 ? this.lessonscatalogue.join(", ") : "No lessons added yet."}</p>
            `;
        }
    }

    showOutput(message){
        const messages = document.getElementById("messages");
        if (messages) {
            const p = document.createElement("p");
            p.textContent = message;
            messages.appendChild(p);
        }
    }
}

// Course data organized by levels
const courseData = {
    level100: [
        "Algebra and Trigonometry",
        "Statistics and Probability", 
        "Calculus I",
        "Matrices and Geometry", 
        "Programming Fundamentals",
        "Office Productivity Tools",
        "Introduction to Computer Science",
        "Hardware Fundamentals and Circuitry",
        "Critical Thinking"
    ],

    level200: [
        "Academic Writing",
        "Information Systems",
        "Calculus II", 
        "Computer Organization and Architecture",
        "Numerical Methods",
        "Introduction to African Studies",
        "Programming II",
        "Data Structures & Algorithms",
        "Data Communications & Networking I",
        "Computer Ethics",
        "Digital Electronics",
        "Introductory Abstract Algebra",
        "Introductory Computational Mathematics"
    ],

    level300: [
        "Object Oriented Analysis & Design",
        "Discrete Mathematics",
        "Web Technologies and Development",
        "Database Management Systems",
        "Operating Systems",
        "Embedded Systems",
        "Computer Vision",
        "Introduction to Computer Graphics",
        "Programming III (VB .NET)",
        "Design and Analysis of Algorithms",
        "Software Engineering",
        "Introduction to Artificial Intelligence",
        "Research Methods in Computing",
        "Introduction to Robotics",
        "Introduction to Parallel Computing",
        "Advanced Web Technologies"
    ],

    level400: [
        "Compilers",
        "Theory and Survey of Programming Languages",
        "Formal Methods and Models",
        "Accounting Principles in Computing",
        "Software Modeling and Simulation",
        "Data Mining and Warehousing",
        "Data Communication and Networking II",
        "System Programming",
        "Computer Systems Security",
        "Human Computer Interaction",
        "Management Principles in Computing",
        "Multimedia Applications",
        "Expert Systems",
        "Concurrent & Distributed Systems",
        "Mobile Computing"
    ]
};

// Global variables
let currentUser = null;
let lessonManagerInstance = null;
let studentAccount = {
    name: "",
    level: "",
    addedCourses: [],
    deletedCourses: [],
    maxAdds: 7,
    maxDeletes: 2
};

let currentFilter = 'all';
let currentLevelFilter = 'all';
let sectionsVisible = true;

// Initialize the page
function init() {
    currentUser = getCurrentUser();
    
    if (!currentUser) {
        alert('Please log in to access lessons');
        window.location.href = 'login.html';
        return;
    }

    initializeStudentAccount();
    
    lessonManagerInstance = new lessonManager(
        currentUser.email.split('@')[0],
        `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email,
        studentAccount.level
    );

    updateProfileInfo();
    createLevelDropdown();
    renderCourses();
    updateStats();
    
    if (currentUser.isNewUser) {
        showMessage(`Welcome to ANIDASO, ${currentUser.firstName || 'Student'}! 🎉`, 'success');
        sessionStorage.removeItem('isNewUser');
    }
}

function initializeStudentAccount() {
    studentAccount.name = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email;
    
    let savedLevel = localStorage.getItem(`${currentUser.email}_level`);
    if (!savedLevel) {
        savedLevel = prompt('What is your current level? (100/200/300/400)', '100');
        if (savedLevel && ['100', '200', '300', '400'].includes(savedLevel)) {
            localStorage.setItem(`${currentUser.email}_level`, savedLevel);
        } else {
            savedLevel = '100';
        }
    }
    studentAccount.level = savedLevel;

    const savedAdded = localStorage.getItem(`${currentUser.email}_addedCourses`);
    const savedDeleted = localStorage.getItem(`${currentUser.email}_deletedCourses`);
    
    if (savedAdded) studentAccount.addedCourses = JSON.parse(savedAdded);
    if (savedDeleted) studentAccount.deletedCourses = JSON.parse(savedDeleted);
}

function saveStudentData() {
    localStorage.setItem(`${currentUser.email}_level`, studentAccount.level);
    localStorage.setItem(`${currentUser.email}_addedCourses`, JSON.stringify(studentAccount.addedCourses));
    localStorage.setItem(`${currentUser.email}_deletedCourses`, JSON.stringify(studentAccount.deletedCourses));
}

function createLevelDropdown() {
    const dropdown = document.getElementById('levelDropdown');
    if (!dropdown) return;

    const levels = ['all', '100', '200', '300', '400'];
    dropdown.innerHTML = levels.map(level => 
        `<option value="${level}" ${level === 'all' ? 'selected' : ''}>
            ${level === 'all' ? 'All Levels' : `Level ${level}`}
         </option>`
    ).join('');

    dropdown.addEventListener('change', (e) => {
        filterByLevel(e.target.value);
    });
}

function filterByLevel(level) {
    currentLevelFilter = level;
    
    const sections = document.querySelectorAll('.level-section');
    sections.forEach(section => {
        const sectionLevel = section.id.replace('section-level', '');
        
        if (level === 'all' || level === sectionLevel) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });

    filterCourses(currentFilter);
}

function toggleProfile() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

function updateProfileInfo() {
    const studentNameElement = document.getElementById('studentName');
    const studentLevelElement = document.getElementById('studentLevel');
    
    if (studentNameElement) {
        studentNameElement.textContent = studentAccount.name;
    }
    if (studentLevelElement) {
        studentLevelElement.textContent = `Level ${studentAccount.level} Student`;
    }
}

function changeLevel() {
    const newLevel = prompt('Enter your new level (100/200/300/400):', studentAccount.level);
    if (newLevel && ['100', '200', '300', '400'].includes(newLevel) && newLevel !== studentAccount.level) {
        studentAccount.level = newLevel;
        saveStudentData();
        updateProfileInfo();
        showMessage(`Level updated to ${newLevel}!`, 'success');
        
        if (lessonManagerInstance) {
            lessonManagerInstance.level = newLevel;
        }
    }
}

function viewProfile() {
    const profileInfo = `
        Name: ${studentAccount.name}
        Email: ${currentUser.email}
        Level: ${studentAccount.level}
        Courses Added: ${studentAccount.addedCourses.length}/${studentAccount.maxAdds}
        Courses Deleted: ${studentAccount.deletedCourses.length}/${studentAccount.maxDeletes}
        Joined: ${currentUser.signupDate ? new Date(currentUser.signupDate).toLocaleDateString() : 'N/A'}
    `;
    alert(profileInfo);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showMessage('Logging out...', 'warning');
        setTimeout(() => {
            sessionStorage.clear();
            window.location.href = 'index.html'; // Redirect to index.html
        }, 1000);
    }
}

function addCourse(courseId, courseName, level) {
    if (studentAccount.addedCourses.length >= studentAccount.maxAdds) {
        showMessage(`Maximum number of courses added (${studentAccount.maxAdds}). Cannot add more courses.`, 'error');
        return;
    }

    if (studentAccount.addedCourses.includes(courseId)) {
        showMessage('Course already added to your account.', 'warning');
        return;
    }

    if (studentAccount.deletedCourses.includes(courseId)) {
        showMessage('Cannot add a deleted course. Please contact administrator.', 'error');
        return;
    }

    studentAccount.addedCourses.push(courseId);
    saveStudentData();
    
    if (lessonManagerInstance) {
        lessonManagerInstance.addlesson(courseName);
    }
    
    showMessage(`"${courseName}" has been added to your courses!`, 'success');
    updateCourseCard(courseId);
    updateStats();
    updateLevelHeaders();
}

function deleteCourse(courseId, courseName, level) {
    if (studentAccount.deletedCourses.length >= studentAccount.maxDeletes) {
        showMessage(`Maximum number of courses deleted (${studentAccount.maxDeletes}). Cannot delete more courses.`, 'error');
        return;
    }

    if (!studentAccount.addedCourses.includes(courseId)) {
        showMessage('Cannot delete a course that is not in your account.', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
        studentAccount.addedCourses = studentAccount.addedCourses.filter(id => id !== courseId);
        studentAccount.deletedCourses.push(courseId);
        saveStudentData();
        
        if (lessonManagerInstance) {
            lessonManagerInstance.deleteLesson(courseName);
        }
        
        showMessage(`"${courseName}" has been deleted from your courses.`, 'success');
        updateCourseCard(courseId);
        updateStats();
        updateLevelHeaders();
    }
}

function startLearning(courseId, courseName) {
    showMessage(`Starting "${courseName}"... Loading course content.`, 'success');
    setTimeout(() => {
        alert(`Welcome to ${courseName}! Course content would load here.`);
    }, 1000);
}

function updateCourseCard(courseId) {
    const card = document.getElementById(courseId);
    if (!card) return;

    const isAdded = studentAccount.addedCourses.includes(courseId);
    const isDeleted = studentAccount.deletedCourses.includes(courseId);

    card.className = 'course-card';
    if (isAdded && !isDeleted) {
        card.classList.add('added');
    } else if (isDeleted) {
        card.classList.add('deleted');
    }

    let statusHtml = '';
    if (isAdded && !isDeleted) {
        statusHtml = '<div class="course-status status-added">Added</div>';
    } else if (isDeleted) {
        statusHtml = '<div class="course-status status-deleted">Deleted</div>';
    }

    const existingStatus = card.querySelector('.course-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    if (statusHtml) {
        card.insertAdjacentHTML('afterbegin', statusHtml);
    }

    const actions = card.querySelector('.course-actions');
    const courseName = card.querySelector('.course-title').textContent;
    const level = card.dataset.level;

    let actionsHtml = '';
    if (isDeleted) {
        actionsHtml = '<button class="action-btn" disabled style="background: #9ca3af;">Course Deleted</button>';
    } else if (isAdded) {
        actionsHtml = `
            <button class="action-btn delete-btn" onclick="deleteCourse('${courseId}', '${courseName}', '${level}')" 
                    ${studentAccount.deletedCourses.length >= studentAccount.maxDeletes ? 'disabled' : ''}>
                Delete Course
            </button>
            <button class="action-btn start-btn" onclick="startLearning('${courseId}', '${courseName}')">
                Start Learning
            </button>
        `;
    } else {
        actionsHtml = `
            <button class="action-btn add-btn" onclick="addCourse('${courseId}', '${courseName}', '${level}')"
                    ${studentAccount.addedCourses.length >= studentAccount.maxAdds ? 'disabled' : ''}>
                Add Course
            </button>
        `;
    }

    actions.innerHTML = actionsHtml;
}

function updateStats() {
    const elements = {
        addedCount: document.getElementById('addedCount'),
        deletedCount: document.getElementById('deletedCount'),
        remainingAdds: document.getElementById('remainingAdds'),
        remainingDeletes: document.getElementById('remainingDeletes')
    };

    if (elements.addedCount) elements.addedCount.textContent = studentAccount.addedCourses.length;
    if (elements.deletedCount) elements.deletedCount.textContent = studentAccount.deletedCourses.length;
    if (elements.remainingAdds) elements.remainingAdds.textContent = studentAccount.maxAdds - studentAccount.addedCourses.length;
    if (elements.remainingDeletes) elements.remainingDeletes.textContent = studentAccount.maxDeletes - studentAccount.deletedCourses.length;
}

function updateLevelHeaders() {
    Object.keys(courseData).forEach(level => {
        const levelNum = level.replace('level', '');
        const courses = courseData[level];
        const addedCount = courses.filter(course => 
            studentAccount.addedCourses.includes(generateCourseId(course, level)) && 
            !studentAccount.deletedCourses.includes(generateCourseId(course, level))
        ).length;
        
        const infoElement = document.querySelector(`#section-${level} .courses-added-info`);
        if (infoElement) {
            infoElement.textContent = `${addedCount} of ${courses.length} courses added`;
        }
    });
}

function renderCourses() {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(courseData).forEach(level => {
        const levelNum = level.replace('level', '');
        const courses = courseData[level];
        
        const sectionHtml = `
            <div class="level-section" id="section-${level}">
                <div class="level-header">
                    <div class="level-title">Level ${levelNum}</div>
                    <div class="courses-added-info">
                        0 of ${courses.length} courses added
                    </div>
                </div>
                <div class="courses-grid" id="grid-${level}">
                    ${courses.map(course => {
                        const courseId = generateCourseId(course, level);
                        
                        return `
                            <div class="course-card" id="${courseId}" data-level="${level}">
                                <div class="course-title">${course}</div>
                                <div class="course-actions">
                                    <button class="action-btn add-btn" onclick="addCourse('${courseId}', '${course}', '${level}')">
                                        Add Course
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', sectionHtml);
    });

    Object.keys(courseData).forEach(level => {
        courseData[level].forEach(course => {
            const courseId = generateCourseId(course, level);
            updateCourseCard(courseId);
        });
    });

    updateLevelHeaders();

    if (currentLevelFilter !== 'all') {
        filterByLevel(currentLevelFilter);
    }
    if (currentFilter !== 'all') {
        filterCourses(currentFilter);
    }
}

function generateCourseId(courseName, level) {
    return `${level}-${courseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}

function filterCourses(filter, tabElement) {
    currentFilter = filter;
    
    if (tabElement) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        tabElement.classList.add('active');
    }

    document.querySelectorAll('.course-card').forEach(card => {
        const courseId = card.id;
        const isAdded = studentAccount.addedCourses.includes(courseId);
        const isDeleted = studentAccount.deletedCourses.includes(courseId);
        
        let shouldShow = false;
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'added':
                shouldShow = isAdded && !isDeleted;
                break;
            case 'deleted':
                shouldShow = isDeleted;
                break;
            case 'available':
                shouldShow = !isAdded && !isDeleted;
                break;
        }

        card.style.display = shouldShow ? 'block' : 'none';
    });

    document.querySelectorAll('.level-section').forEach(section => {
        const visibleCards = section.querySelectorAll('.course-card[style*="block"], .course-card:not([style*="none"])');
        const isLevelVisible = currentLevelFilter === 'all' || section.id.includes(currentLevelFilter);
        section.style.display = (visibleCards.length > 0 && isLevelVisible) ? 'block' : 'none';
    });
}

function searchCourses() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        filterByLevel(currentLevelFilter);
        filterCourses(currentFilter);
        return;
    }

    document.querySelectorAll('.course-card').forEach(card => {
        const courseTitle = card.querySelector('.course-title').textContent.toLowerCase();
        const shouldShow = courseTitle.includes(searchTerm);
        card.style.display = shouldShow ? 'block' : 'none';
    });

    document.querySelectorAll('.level-section').forEach(section => {
        const visibleCards = section.querySelectorAll('.course-card[style*="block"], .course-card:not([style*="none"])');
        const isLevelVisible = currentLevelFilter === 'all' || section.id.includes(currentLevelFilter);
        section.style.display = (visibleCards.length > 0 && isLevelVisible) ? 'block' : 'none';
    });
}

function toggleAllSections() {
    const arrow = document.querySelector('.dropdown-arrow');
    const sections = document.querySelectorAll('.level-section');
    
    if (!arrow || !sections.length) return;
    
    sectionsVisible = !sectionsVisible;
    arrow.classList.toggle('rotated');
    
    sections.forEach(section => {
        if (sectionsVisible) {
            section.classList.remove('hidden');
            section.style.display = 'block';
        } else {
            section.classList.add('hidden');
            section.style.display = 'none';
        }
    });
}

function showMessage(text, type) {
    let container = document.getElementById('messageContainer');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'messageContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
        `;
        document.body.appendChild(container);
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeaa7' : '#b8daff'};
        border-radius: 4px;
        padding: 12px 16px;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 1.4;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    container.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (container.contains(messageDiv)) {
                container.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}

function getCurrentUser() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        return null;
    }
    
    return {
        email: sessionStorage.getItem('userEmail'),
        firstName: sessionStorage.getItem('userFirstName'),
        lastName: sessionStorage.getItem('userLastName'),
        isNewUser: sessionStorage.getItem('isNewUser') === 'true',
        loginTime: sessionStorage.getItem('loginTime'),
        signupDate: sessionStorage.getItem('userSignupDate')
    };
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Close profile dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.user-profile')) {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});

// Auto-save data when page is about to unload
window.addEventListener('beforeunload', function() {
    if (currentUser) {
        saveStudentData();
    }
});
