const form = document.getElementById('form') || document.querySelector('form');
const error_message = document.getElementById("error-message");

// Get possible inputs (some may not exist depending on page)
const firstname_input = document.getElementById('firstname-input');
const lastname_input = document.getElementById('lastname-input');
const email_input = document.getElementById('email-input');
const id_input = document.getElementById('ID-input');
const password_input = document.getElementById('password-input') || document.getElementById('password-input_2');
const repeat_password_input = document.getElementById('repeat-password-input');

// Create forgot password functionality
function createForgotPasswordLink() {
    // Check if we're on login page and forgot password link doesn't exist
    if (email_input && password_input && !repeat_password_input && !document.getElementById('forgot-password-link')) {
        const forgotPasswordDiv = document.createElement('div');
        forgotPasswordDiv.className = 'forgot-password';
        
        const forgotLink = document.createElement('a');
        forgotLink.href = '#';
        forgotLink.id = 'forgot-password-link';
        forgotLink.textContent = 'Forgot Password?';
        
        // Add forgot password functionality
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleForgotPassword();
        });
        
        forgotPasswordDiv.appendChild(forgotLink);
        
        // Insert right after the password input container
        const passwordContainer = password_input.parentElement;
        passwordContainer.parentNode.insertBefore(forgotPasswordDiv, passwordContainer.nextSibling);
    }
}

// Forgot password handler
function handleForgotPassword() {
    const email = email_input?.value.trim();
    
    if (!email) {
        showErrorMessage("Please enter a valid email address first");
        email_input.focus();
    } else if (!isValidEmail(email)) {
        showErrorMessage("Please enter a valid email address first");
        email_input.focus();
    } else {
        sendPasswordReset(email);
    }
}

// Show email prompt for forgot password
function showForgotPasswordPrompt() {
    const email = prompt("Please enter your email address to reset your password:");
    
    if (email === null) {
        // User cancelled
        return;
    }
    
    if (!email.trim()) {
        alert("Email address is required for password reset.");
        return;
    }
    
    if (!isValidEmail(email.trim())) {
        alert("Please enter a valid email address.");
        showForgotPasswordPrompt(); // Ask again
        return;
    }
    
    sendPasswordReset(email.trim());
}

// Simulate sending password reset email
function sendPasswordReset(email) {
    // Show loading state
    showInfoMessage("Sending password reset email...");
    
    // Simulate API call delay
    setTimeout(() => {
        showSuccessMessage(`Password reset email sent to ${email}. Please check your inbox.`);
        
        // Clear message after 5 seconds
        setTimeout(() => {
            hideErrorMessage();
        }, 5000);
    }, 1500);
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if email is already registered
function isEmailAlreadyRegistered(email) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Login validation function - checks if credentials are valid
function isValidLogin(email, password) {
    // First check against registered users from signup
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = registeredUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userExists) {
        // In a real app, you'd hash and compare passwords
        // For demo purposes, we'll accept any password for registered users
        return true;
    }
    
    // Predefined demo credentials
    const validCredentials = [
        { email: "admin@anidaso.com", password: "admin123" },
        { email: "user@example.com", password: "password123" },
        { email: "teacher@anidaso.com", password: "teach2024" },
        { email: "student@anidaso.com", password: "student123" }
    ];
    
    // Check against predefined credentials
    const isValidCredential = validCredentials.some(cred => 
        cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );
    
    if (isValidCredential) {
        return true;
    }
    
    // For additional demo flexibility - remove this in production
    return isValidEmail(email) && password.length >= 8;
}

// Message display helpers
function showErrorMessage(message) {
    error_message.innerText = message;
    error_message.style.color = "#ff4757";
    error_message.style.backgroundColor = "rgba(255, 71, 87, 0.1)";
    error_message.style.borderColor = "#ff4757";
    error_message.style.border = "1px solid";
    error_message.style.padding = "10px";
    error_message.style.borderRadius = "5px";
    error_message.style.marginTop = "10px";
    error_message.style.display = "block";
}

function showSuccessMessage(message) {
    error_message.innerText = message;
    error_message.style.color = "#27ae60";
    error_message.style.backgroundColor = "rgba(39, 174, 96, 0.1)";
    error_message.style.borderColor = "#27ae60";
    error_message.style.border = "1px solid";
    error_message.style.padding = "10px";
    error_message.style.borderRadius = "5px";
    error_message.style.marginTop = "10px";
    error_message.style.display = "block";
}

function showInfoMessage(message) {
    error_message.innerText = message;
    error_message.style.color = "#3498db";
    error_message.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
    error_message.style.borderColor = "#3498db";
    error_message.style.border = "1px solid";
    error_message.style.padding = "10px";
    error_message.style.borderRadius = "5px";
    error_message.style.marginTop = "10px";
    error_message.style.display = "block";
}

function hideErrorMessage() {
    error_message.innerText = "";
    error_message.style.display = "none";
}

// Handle successful login
function handleSuccessfulLogin(email) {
    // Get user data if they registered through signup
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userData = registeredUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    showSuccessMessage("Login successful! Redirecting to lessons...");
    
    // Store session data
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('loginTime', new Date().toISOString());
    
    // Store additional user data if available
    if (userData) {
        sessionStorage.setItem('userFirstName', userData.firstname);
        sessionStorage.setItem('userLastName', userData.lastname);
        sessionStorage.setItem('userSignupDate', userData.signupDate);
    }
    
    // Redirect after a short delay
    setTimeout(() => {
        // TODO: Replace 'lesson.html' with your actual lesson page URL
        window.location.href = 'lessons.html'; // <-- PUT YOUR LESSON PAGE LINK HERE
    }, 1000);
}

// Handle successful signup
function handleSuccessfulSignup(email, firstname, lastname, password) {
    showSuccessMessage("Account created successfully! Welcome to ANIDASO! Redirecting to lessons...");
    
    // Store user data for future logins
    const userData = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: password, // In production, this should be hashed!
        signupDate: new Date().toISOString(),
        id: Date.now() // Simple ID generation
    };
    
    // Store in localStorage as a simple "database" for demo
    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    users.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Store session data
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userFirstName', firstname);
    sessionStorage.setItem('userLastName', lastname);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('isNewUser', 'true'); // Flag for welcome message
    sessionStorage.setItem('loginTime', new Date().toISOString());
    
    // Redirect after a short delay
    setTimeout(() => {
        // TODO: Replace 'lesson.html' with your actual lesson page URL
        window.location.href = 'lessons.html'; // <-- PUT YOUR LESSON PAGE LINK HERE
    }, 1500);
}

// Handle login failure
function handleLoginFailure() {
    showErrorMessage("Invalid email or password. Please check your credentials and try again.");
    
    // Add visual feedback to form inputs
    if (email_input) email_input.parentElement.classList.add("incorrect");
    if (password_input) password_input.parentElement.classList.add("incorrect");
}

// Form submission handler
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Always prevent default form submission
    let errors = [];

    // Clear previous error states
    clearAllErrorStates();
    
    // Detect form type
    const isSignup = !!firstname_input && !!lastname_input && !!repeat_password_input;
    const isLogin = !!email_input && !!password_input && !repeat_password_input && !firstname_input;

    if (isSignup) {
        // Handle signup form
        errors = getSignupFormErrors(
            firstname_input?.value,
            lastname_input?.value,
            email_input?.value,
            password_input?.value,
            repeat_password_input?.value
        );
        
        if (errors.length === 0) {
            const email = email_input.value.trim();
            const firstname = firstname_input.value.trim();
            const lastname = lastname_input.value.trim();
            const password = password_input.value;
            
            // Check if email is already registered
            if (isEmailAlreadyRegistered(email)) {
                showErrorMessage("An account with this email already exists. Please use a different email or try logging in.");
                email_input.parentElement.classList.add("incorrect");
                return;
            }
            
            handleSuccessfulSignup(email, firstname, lastname, password);
            return;
        }
    } else if (isLogin) {
        // Handle login form
        errors = getLoginFormErrors(
            email_input?.value,
            password_input?.value
        );
        
        if (errors.length === 0) {
            const email = email_input.value.trim();
            const password = password_input.value;
            
            if (isValidLogin(email, password)) {
                handleSuccessfulLogin(email);
                return;
            } else {
                handleLoginFailure();
                return;
            }
        }
    } else {
        // Handle other form types or mixed forms
        errors = getGeneralFormErrors();
    }

    // Show validation errors if any exist
    if (errors.length > 0) {
        showErrorMessage(errors.join(". "));
    }
});

// Clear all error states
function clearAllErrorStates() {
    hideErrorMessage();
    const allInputs = [firstname_input, lastname_input, email_input, id_input, password_input, repeat_password_input].filter(Boolean);
    allInputs.forEach(input => {
        input.parentElement.classList.remove('incorrect');
    });
}

function getSignupFormErrors(firstname, lastname, email, password, repeatPassword) {
    let errors = [];

    // First name validation
    if (!firstname || firstname.trim() === '') {
        errors.push("First name is required");
        if (firstname_input) firstname_input.parentElement.classList.add("incorrect");
    } else if (firstname.trim().length < 2) {
        errors.push("First name must be at least 2 characters");
        if (firstname_input) firstname_input.parentElement.classList.add("incorrect");
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstname.trim())) {
        errors.push("First name can only contain letters, spaces, apostrophes, and hyphens");
        if (firstname_input) firstname_input.parentElement.classList.add("incorrect");
    }

    // Last name validation
    if (!lastname || lastname.trim() === '') {
        errors.push("Last name is required");
        if (lastname_input) lastname_input.parentElement.classList.add("incorrect");
    } else if (lastname.trim().length < 2) {
        errors.push("Last name must be at least 2 characters");
        if (lastname_input) lastname_input.parentElement.classList.add("incorrect");
    } else if (!/^[a-zA-Z\s'-]+$/.test(lastname.trim())) {
        errors.push("Last name can only contain letters, spaces, apostrophes, and hyphens");
        if (lastname_input) lastname_input.parentElement.classList.add("incorrect");
    }

    // Email validation
    if (!email || email.trim() === '') {
        errors.push("Email address is required");
        if (email_input) email_input.parentElement.classList.add("incorrect");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please enter a valid email address");
        if (email_input) email_input.parentElement.classList.add("incorrect");
    }

    // Password validation
    if (!password) {
        errors.push("Password is required");
        if (password_input) password_input.parentElement.classList.add("incorrect");
    } else {
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
            if (password_input) password_input.parentElement.classList.add("incorrect");
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
            if (password_input) password_input.parentElement.classList.add("incorrect");
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
            if (password_input) password_input.parentElement.classList.add("incorrect");
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push("Password must contain at least one number");
            if (password_input) password_input.parentElement.classList.add("incorrect");
        }
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
            errors.push("Password must contain at least one special character");
            if (password_input) password_input.parentElement.classList.add("incorrect");
        }
    }

    // Confirm password validation
    if (!repeatPassword) {
        errors.push("Please confirm your password");
        if (repeat_password_input) repeat_password_input.parentElement.classList.add("incorrect");
    } else if (password !== repeatPassword) {
        errors.push("Passwords do not match");
        if (password_input) password_input.parentElement.classList.add("incorrect");
        if (repeat_password_input) repeat_password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = [];

    // Email validation
    if (!email || email.trim() === '') {
        errors.push("Email address is required");
        if (email_input) email_input.parentElement.classList.add("incorrect");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please enter a valid email address");
        if (email_input) email_input.parentElement.classList.add("incorrect");
    }

    // Password validation
    if (!password) {
        errors.push("Password is required");
        if (password_input) password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}

function getGeneralFormErrors() {
    let errors = [];

    // Handle mixed form types or fallback validation
    if (firstname_input && (!firstname_input.value || firstname_input.value.trim() === '')) {
        errors.push("First name is required");
        firstname_input.parentElement.classList.add("incorrect");
    }

    if (lastname_input && (!lastname_input.value || lastname_input.value.trim() === '')) {
        errors.push("Last name is required");
        lastname_input.parentElement.classList.add("incorrect");
    }

    if (id_input && (!id_input.value || id_input.value.trim() === '')) {
        errors.push("ID is required");
        id_input.parentElement.classList.add("incorrect");
    }

    if (email_input && email_input.value) {
        if (!isValidEmail(email_input.value.trim())) {
            errors.push("Please enter a valid email address");
            email_input.parentElement.classList.add("incorrect");
        }
    }

    if (password_input && (!password_input.value)) {
        errors.push("Password is required");
        password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}

// Remove error highlight on input and clear messages
const allInputs = [
    firstname_input,
    lastname_input,
    email_input,
    id_input,
    password_input,
    repeat_password_input
].filter(Boolean);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        hideErrorMessage();
        input.parentElement.classList.remove('incorrect');
    });
    
    // Also clear on focus for better UX
    input.addEventListener('focus', () => {
        input.parentElement.classList.remove('incorrect');
    });
});

// Add CSS for styling
const style = document.createElement('style');
style.textContent = `
    .incorrect input {
        border: 2px solid #ff6b6b !important;
        background-color: #ffebee !important;
    }
    
    .incorrect input:focus {
        outline: 2px solid #ff6b6b !important;
        box-shadow: 0 0 5px rgba(255, 107, 107, 0.3) !important;
    }
    
    .forgot-password {
        text-align: right;
        margin: 10px 0;
    }
    
    .forgot-password a {
        color: #666;
        text-decoration: none;
        font-size: 14px;
        position: relative;
        transition: color 0.3s ease;
    }
    
    .forgot-password a::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -3px;
        left: 50%;
        background: #666;
        transition: all 0.3s ease;
    }
    
    .forgot-password a:hover {
        color: #333;
    }
    
    .forgot-password a:hover::after {
        width: 100%;
        left: 0;
    }
    
    #error-message {
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
    }
    
    /* Loading animation for buttons during form submission */
    .submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .submit.loading::after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 8px;
        border: 2px solid transparent;
        border-top: 2px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Smooth transitions for form states */
    input {
        transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    /* Form validation feedback */
    .form-success {
        border: 2px solid #27ae60 !important;
        background-color: #f8fff8 !important;
    }
    
    .form-success:focus {
        outline: 2px solid #27ae60 !important;
        box-shadow: 0 0 5px rgba(39, 174, 96, 0.3) !important;
    }
`;
document.head.appendChild(style);

// Utility function to show loading state on submit button
function setSubmitButtonLoading(loading = true) {
    const submitButton = form.querySelector('.submit');
    if (submitButton) {
        if (loading) {
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.dataset.originalText = submitButton.textContent;
            submitButton.textContent = submitButton.textContent.includes('LOGIN') ? 'LOGGING IN' : 'CREATING ACCOUNT';
        } else {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            if (submitButton.dataset.originalText) {
                submitButton.textContent = submitButton.dataset.originalText;
            }
        }
    }
}

// Enhanced form submission with loading states
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show loading state
    setSubmitButtonLoading(true);
    
    // Add small delay to show loading state
    setTimeout(() => {
        // Reset loading state
        setSubmitButtonLoading(false);
        
        // Your existing form submission logic here
        // (This is handled by the existing submit event listener above)
    }, 500);
});

// Initialize forgot password functionality when page loads
document.addEventListener('DOMContentLoaded', () => {
    createForgotPasswordLink();
    
    // Add welcome message for returning users
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userEmail = sessionStorage.getItem('userEmail');
    
    if (isLoggedIn && userEmail && window.location.pathname.includes('login')) {
        // User is already logged in, redirect to lessons
        window.location.href = 'lesson.html'; // <-- PUT YOUR LESSON PAGE LINK HERE
    }
});

// Also run immediately in case DOMContentLoaded already fired
createForgotPasswordLink();

// Helper function to get user data (useful for other pages)
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

// Helper function to logout user
function logoutUser() {
    sessionStorage.clear();
    window.location.href = 'login.html'; // Redirect to login page
}

// Make helper functions globally available
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
