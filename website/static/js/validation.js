const form = document.getElementById('form') || document.querySelector('form');
const error_message = document.getElementById("error-message");

// Get possible inputs (some may not exist depending on page)
const firstname_input = document.getElementById('firstname-input');
const lastname_input = document.getElementById('lastname-input');
const email_input = document.getElementById('email-input');
const id_input = document.getElementById('ID-input');
const password_input = document.getElementById('password-input') || document.getElementById('password-input_2');
const repeat_password_input = document.getElementById('repeat-password-input');

form.addEventListener('submit', (e) => {
    let errors = [];

    // Detect if signup or login form
    const isSignup = !!email_input && !!repeat_password_input;

    if (isSignup) {
        errors = getSignupFormErrors(
            firstname_input?.value,
            lastname_input?.value,
            email_input?.value,
            password_input?.value,
            repeat_password_input?.value
        );
    } else {
        errors = getLoginFormErrors(
            firstname_input?.value,
            lastname_input?.value,
            id_input?.value,
            password_input?.value
        );
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    }
});

function getSignupFormErrors(firstname, lastname, email, password, repeatPassword) {
    let errors = [];

    if (!firstname) {
        errors.push("Firstname is required");
        firstname_input.parentElement.classList.add("incorrect");
    }
    if (!lastname) {
        errors.push("Lastname is required");
        lastname_input.parentElement.classList.add("incorrect");
    }
    if (!email) {
        errors.push("Email is required");
        email_input.parentElement.classList.add("incorrect");
    }

    if (!password) {
        errors.push("Password is required");
        password_input.parentElement.classList.add("incorrect");
    } else if (password.length !== 8) {
        errors.push("Password must have exactly 8 characters");
        password_input.parentElement.classList.add("incorrect");
    }

    if (!repeatPassword) {
        errors.push("Repeat password is required");
        repeat_password_input.parentElement.classList.add("incorrect");
    } else if (password !== repeatPassword) {
        errors.push("Passwords do not match");
        password_input.parentElement.classList.add("incorrect");
        repeat_password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}

function getLoginFormErrors(firstname, lastname, id, password) {
    let errors = [];

    if (!firstname) {
        errors.push("Firstname is required");
        firstname_input.parentElement.classList.add("incorrect");
    }
    if (!lastname) {
        errors.push("Lastname is required");
        lastname_input.parentElement.classList.add("incorrect");
    }
    if (!id) {
        errors.push("ID is required");
        id_input.parentElement.classList.add("incorrect");
    }
    if (!password) {
        errors.push("Password is required");
        password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}

// Remove error highlight on input
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
        error_message.innerText = '';
        input.parentElement.classList.remove('incorrect');
    });
});

