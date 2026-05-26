// Mobile Menu Toggle
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburgerMenu && mobileMenu) {
    hamburgerMenu.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');

        const icon = hamburgerMenu.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    document.addEventListener('click', function (event) {
        if (!hamburgerMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.remove('active');
            const icon = hamburgerMenu.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }

    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            const icon = hamburgerMenu.querySelector('i');
            if (icon) {//remove navigation bar when link is clicked
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Add active state to current page links
const currentLocation = window.location.pathname;
const navLinks = document.querySelectorAll('.link-container a, .mobile-menu a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.style.color = '#f97316';
        link.style.background = 'rgba(249, 115, 22, 0.2)';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== "#" && href !== "") {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        }
    });
});

//=============REGISTRATION VALIDATION====================//

const reggisterModel = document.getElementById('registerModel');
const openRegBtn = document.querySelectorAll('#openReg');
const closeModelBtn = document.querySelectorAll('#close');
const signInLink = document.getElementById('signInLink');
const form = document.getElementById('registerForm');
const errorMessage = document.querySelectorAll('.error-msg');
const inputError = document.querySelectorAll('.form-group input');
const passwordBars = document.querySelectorAll('.strength-bar');
const strengthText = document.getElementById('strengthText');
const passwordInput = document.getElementById('regPassword');
const regPasswordConfirm = document.getElementById('regPasswordConfirm');

// Clearing error messages
function clearError() {
    errorMessage.forEach(error => {
        error.classList.remove('show');
    });
    inputError.forEach(input => {
        input.classList.remove('error');
    });
}

// Close registration modal 
function closeModel() {
    if (reggisterModel) {
        reggisterModel.style.opacity = "0";
        setTimeout(() => {
            reggisterModel.style.display = "none";
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }, 300);
    }
    // console.log("Modal closed");
}

// Open modal function
function openModal() {
    if (reggisterModel) {
        const isMobile = window.innerWidth <= 768;

        reggisterModel.style.display = "flex";
        document.body.style.overflow = "hidden";

        // Prevent scroll jumping on mobile
        if (isMobile) {
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        }

        // Use setTimeout to ensure display is set before opacity transition
        setTimeout(() => {
            reggisterModel.style.opacity = "1";
        }, 10);

        if (form) {
            form.reset();
        }
        clearError();

        // Reset password strength
        passwordBars.forEach(bar => {
            bar.style.background = '#e2e8f0';
            bar.classList.remove('active', 'weak', 'medium', 'strong');
        });
        if (strengthText) {
            strengthText.style.display = 'none';
            strengthText.textContent = '';
        }
    }
}

// Open registration modal 
if (openRegBtn && openRegBtn.length > 0) {
    openRegBtn.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            //console.log('Open registration button clicked');
            openModal(); // Call the open modal function
        });
    });
} else {
    console.error('No elements found with class "openReg"');
}

// Close button event
if (closeModelBtn) {
    closeModelBtn.forEach(btn => {
        btn.addEventListener('click', closeModel);
    });
}

// Close modal when clicking outside
if (reggisterModel) {
    reggisterModel.addEventListener('click', function (e) {

        if (e.target === reggisterModel) {
            closeModel();
        }
    });
}

//======PASSWORD STRENGTH CHECKER======//
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}
//password strength update function
function updatePasswordStrength() {
    if (!passwordInput) return;

    const passwordValue = passwordInput.value;
    const strength = checkPasswordStrength(passwordValue);

    passwordBars.forEach(bar => {
        bar.style.background = '#e2e8f0';
        bar.classList.remove('active', 'weak', 'medium', 'strong');
    });

    for (let i = 0; i < strength && i < passwordBars.length; i++) {
        passwordBars[i].classList.add('active');

        if (strength === 1) {
            passwordBars[i].style.background = '#ef4444';
            passwordBars[i].classList.add('weak');
        } else if (strength === 2) {
            passwordBars[i].style.background = '#f59e0b';
            passwordBars[i].classList.add('medium');
        } else if (strength >= 3) {
            passwordBars[i].style.background = '#10b981';
            passwordBars[i].classList.add('strong');
        }
    }

    // Update strength text
    if (passwordValue.length === 0) {
        if (strengthText) {
            strengthText.style.display = 'none';
            strengthText.textContent = '';
        }
    } else if (strength === 1) {
        if (strengthText) {
            strengthText.style.display = "block";
            strengthText.style.color = "#ef4444";
            strengthText.textContent = 'Weak password - Add uppercase, numbers, or symbols';
        }
    } else if (strength === 2) {
        if (strengthText) {
            strengthText.style.display = "block";
            strengthText.style.color = "#f59e0b";
            strengthText.textContent = 'Medium password - Add uppercase, numbers, or symbols';
        }
    } else if (strength >= 3) {
        if (strengthText) {
            strengthText.style.display = "block";
            strengthText.style.color = "#10b981";
            strengthText.textContent = 'Strong password';
        }
    }
}

// Event listener for password strength update
if (passwordInput) {
    passwordInput.addEventListener('input', updatePasswordStrength);
}

// ========TOGGLE PASSWORD VISIBILITY FUNCTION========//
const passwordToggle = document.querySelectorAll('.toggle-password');
passwordToggle.forEach(toggle => {
    toggle.addEventListener('click', function () {
        const wrapper = this.closest('.password-wrapper');
        if (!wrapper) return;

        const input = wrapper.querySelector('input');
        const icon = this.querySelector('i');

        if (input && icon) {
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    });
});

//=================REAL-TIME VALIDATION===================//

// Real-time confirm password validation
if (regPasswordConfirm && passwordInput) {
    regPasswordConfirm.addEventListener('input', function () {
        const password = passwordInput.value;
        const formGroup = this.closest('.form-group');
        const confirmError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (this.value && password !== this.value) {
            if (confirmError) {
                confirmError.classList.add('show');
                confirmError.textContent = 'Passwords do not match';
            }
            this.classList.add('error');
            this.classList.remove('success');
        } else if (this.value && password === this.value) {
            if (confirmError) {
                confirmError.classList.remove('show');
            }
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            if (confirmError) {
                confirmError.classList.remove('show');
            }
            this.classList.remove('error', 'success');
        }
    });
}

// Real-time email validation
const regEmail = document.getElementById('regEmail');
if (regEmail) {
    regEmail.addEventListener('input', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const formGroup = this.closest('.form-group');
        const emailError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (this.value && !emailRegex.test(this.value)) {
            if (emailError) emailError.classList.add('show');
            this.classList.add('error');
            this.classList.remove('success');
        } else if (this.value && emailRegex.test(this.value)) {
            if (emailError) emailError.classList.remove('show');
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            if (emailError) emailError.classList.remove('show');
            this.classList.remove('error', 'success');
        }
    });
}

// Real-time phone validation
const regPhone = document.getElementById('regPhone');
if (regPhone) {
    regPhone.addEventListener('input', function () {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        const formGroup = this.closest('.form-group');
        const phoneError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (this.value && !phoneRegex.test(this.value)) {
            if (phoneError) phoneError.classList.add('show');
            this.classList.add('error');
            this.classList.remove('success');
        } else if (this.value && phoneRegex.test(this.value)) {
            if (phoneError) phoneError.classList.remove('show');
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            if (phoneError) phoneError.classList.remove('show');
            this.classList.remove('error', 'success');
        }
    });
}

//=============FORM VALIDATION===================//

function validation() {
    let isValid = true;

    // First name validation
    const firstName = document.getElementById('regFirstName');
    if (firstName) {
        const formGroup = firstName.closest('.form-group');
        const firstNameError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (!firstName.value.trim()) {
            if (firstNameError) firstNameError.classList.add('show');
            firstName.classList.add('error');
            firstName.classList.remove('success');
            isValid = false;
        } else {
            if (firstNameError) firstNameError.classList.remove('show');
            firstName.classList.remove('error');
            firstName.classList.add('success');
        }
    }

    // Last name validation
    const lastName = document.getElementById('regLastName');
    if (lastName) {
        const formGroup = lastName.closest('.form-group');
        const lastNameError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (!lastName.value.trim()) {
            if (lastNameError) lastNameError.classList.add('show');
            lastName.classList.add('error');
            lastName.classList.remove('success');
            isValid = false;
        } else {
            if (lastNameError) lastNameError.classList.remove('show');
            lastName.classList.remove('error');
            lastName.classList.add('success');
        }
    }

    // Email validation
    const email = document.getElementById('regEmail');
    if (email) {
        const formGroup = email.closest('.form-group');
        const emailError = formGroup ? formGroup.querySelector('.error-msg') : null;
        const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;

        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            if (emailError) emailError.classList.add('show');
            email.classList.add('error');
            email.classList.remove('success');
            isValid = false;
        } else {
            if (emailError) emailError.classList.remove('show');
            email.classList.remove('error');
            email.classList.add('success');
        }
    }

    // Phone Validation
    const phone = document.getElementById('regPhone');
    if (phone) {
        const formGroup = phone.closest('.form-group');
        const phoneError = formGroup ? formGroup.querySelector('.error-msg') : null;
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

        if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
            if (phoneError) phoneError.classList.add('show');
            phone.classList.add('error');
            phone.classList.remove('success');
            isValid = false;
        } else {
            if (phoneError) phoneError.classList.remove('show');
            phone.classList.remove('error');
            phone.classList.add('success');
        }
    }

    // Password validation
    const password = document.getElementById('regPassword');
    if (password) {
        const formGroup = password.closest('.form-group');
        const passwordError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (!password.value.trim() || password.value.length < 8) {
            if (passwordError) passwordError.classList.add('show');
            password.classList.add('error');
            password.classList.remove('success');
            isValid = false;
        } else {
            if (passwordError) passwordError.classList.remove('show');
            password.classList.remove('error');
            password.classList.add('success');
        }
    }

    // Confirm password validation
    const confirmPassword = document.getElementById('regPasswordConfirm');
    if (confirmPassword && password) {
        const formGroup = confirmPassword.closest('.form-group');
        const confirmError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (!confirmPassword.value.trim()) {
            if (confirmError) {
                confirmError.classList.add('show');
                confirmError.textContent = 'Please confirm your password';
            }
            confirmPassword.classList.add('error');
            confirmPassword.classList.remove('success');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            if (confirmError) {
                confirmError.classList.add('show');
                confirmError.textContent = 'Passwords do not match';
            }
            confirmPassword.classList.add('error');
            confirmPassword.classList.remove('success');
            isValid = false;
        } else {
            if (confirmError) confirmError.classList.remove('show');
            confirmPassword.classList.remove('error');
            confirmPassword.classList.add('success');
        }
    }

    return isValid;
}

//====================FORM SUBMISSION=====================//
const BASE_URL = "https://white-eangles-contructor.onrender.com";
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 1. Run validation FIRST. If it fails, stop and shake.
        if (!validation()) {
            const modal = document.querySelector('.model');
            if (modal) {
                modal.classList.add('shake');
                setTimeout(() => modal.classList.remove('shake'), 300);
            }
            return;
        }

        // 2. Validation passed! Now get the data and hit the API.
        const firstname = document.getElementById('regFirstName').value;
        const lastname = document.getElementById('regLastName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...`;
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${firstname} ${lastname}`,
                    email: email,
                    phone: phone,
                    password: password
                })
            });

            const data = await res.json();

            if (data.success || data.token) {
                // Account created! Close modal and reset form.
                closeModel();
                registerForm.reset();
                localStorage.setItem('sh_token', data.token)
                localStorage.setItem('sh_role', data.role)
                localStorage.setItem('sh_name', data.name || 'User')
                location.reload()
                updateAuthUI()

                updatePasswordStrength();
                clearError();
                document.querySelectorAll('.form-group input').forEach(input => input.classList.remove('success', 'error'));
                alert('Account created successfully!'); // Or use alert()
            } else {
                // Backend rejected it (e.g., email already exists)
                const emailError = document.querySelector('#regEmail').closest('.form-group').querySelector('.error-msg');
                if (emailError) {
                    emailError.textContent = data.message || 'Registration failed';
                    emailError.classList.add('show');
                }
            }
        } catch (error) {
            console.error("Registration error", error);
            alert("Network error. Is the backend running?");
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
// Handle window resize for modal adjustments
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        if (reggisterModel && reggisterModel.style.display === 'flex') {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                const modal = document.querySelector('.model');
                if (modal) {
                    modal.style.maxHeight = '90vh';
                }
            }
        }
    }, 250);
});

// Add shake animation to CSS if not present
if (!document.querySelector('#shake-styles')) {
    const style = document.createElement('style');
    style.id = 'shake-styles';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

//console.log('Script initialized successfully');

// ============= LOGIN MODAL FUNCTIONALITY =============//

const loginModel = document.getElementById('loginModel');
const openLoginBtn = document.querySelectorAll('.openLogin');
const closeLoginBtn = document.getElementById('closeLogin');
const showRegisterLink = document.getElementById('showRegister');
const loginForm = document.getElementById('loginForm');
const showLoginLink = document.getElementById('signInLink')

function openLoginModal() {
    if (loginModel) {
        const isMobile = window.innerWidth <= 768;

        loginModel.style.display = "flex";
        document.body.style.overflow = "hidden";

        if (isMobile) {
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        }

        setTimeout(() => {
            loginModel.style.opacity = "1";
        }, 10);

        // Reset form when opened
        if (loginForm) {
            loginForm.reset();
        }

        // Clear any errors
        const errors = loginModel.querySelectorAll('.error-msg');
        errors.forEach(error => {
            error.classList.remove('show');
        });

        const inputs = loginModel.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
    }
}

// Close login modal
function closeLoginModal() {
    if (loginModel) {
        loginModel.style.opacity = "0";
        setTimeout(() => {
            loginModel.style.display = "none";
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }, 300);
    }
}

// Event listeners for opening login modal
if (openLoginBtn && openLoginBtn.length > 0) {
    openLoginBtn.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Open login button clicked');
            openLoginModal();
        });
    });
}

// Close button event
if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', closeLoginModal);
}

// Close modal when clicking outside
if (loginModel) {
    loginModel.addEventListener('click', function (e) {
        if (e.target === loginModel) {
            closeLoginModal();
        }
    });
}

// Switch from Login to Registration modal
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function (e) {
        e.preventDefault();
        closeLoginModal();

        // Open registration modal after a short delay
        setTimeout(() => {
            if (reggisterModel) {
                openModal(); // Your existing openModal function
            }
        }, 300);
    });
}
//switch from registation to login model
if (showLoginLink) {
    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        closeModel()

        //open login model 
        setTimeout(() => {
            if (loginModel) {
                openLoginModal()

            }
        }, 300)
    })
}

// ============= LOGIN FORM VALIDATION =============//

// Real-time email validation for login
const loginEmail = document.getElementById('loginEmail');
if (loginEmail) {
    loginEmail.addEventListener('input', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const formGroup = this.closest('.form-group');
        const emailError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (this.value && !emailRegex.test(this.value)) {
            if (emailError) emailError.classList.add('show');
            this.classList.add('error');
            this.classList.remove('success');
        } else if (this.value && emailRegex.test(this.value)) {
            if (emailError) emailError.classList.remove('show');
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            if (emailError) emailError.classList.remove('show');
            this.classList.remove('error', 'success');
        }
    });
}

// Real-time password validation for login
const loginPassword = document.getElementById('loginPassword');
if (loginPassword) {
    loginPassword.addEventListener('input', function () {
        const formGroup = this.closest('.form-group');
        const passwordError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (this.value && this.value.length < 6) {
            if (passwordError) {
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordError.classList.add('show');
            }
            this.classList.add('error');
            this.classList.remove('success');
        } else if (this.value && this.value.length >= 6) {
            if (passwordError) {
                passwordError.classList.remove('show');
            }
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            if (passwordError) {
                passwordError.textContent = 'Password is required';
                passwordError.classList.remove('show');
            }
            this.classList.remove('error', 'success');
        }
    });
}

// Login form validation function
function validateLoginForm() {
    let isValid = true;

    // Email validation
    const email = document.getElementById('loginEmail');
    if (email) {
        const formGroup = email.closest('.form-group');
        const emailError = formGroup ? formGroup.querySelector('.error-msg') : null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.value.trim()) {
            if (emailError) emailError.classList.add('show');
            email.classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            if (emailError) emailError.classList.add('show');
            email.classList.add('error');
            isValid = false;
        } else {
            if (emailError) emailError.classList.remove('show');
            email.classList.remove('error');
        }
    }

    // Password validation
    const password = document.getElementById('loginPassword');
    if (password) {
        const formGroup = password.closest('.form-group');
        const passwordError = formGroup ? formGroup.querySelector('.error-msg') : null;

        if (!password.value.trim()) {
            if (passwordError) {
                passwordError.textContent = 'Password is required';
                passwordError.classList.add('show');
            }
            password.classList.add('error');
            isValid = false;
        } else if (password.value.length < 6) {
            if (passwordError) {
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordError.classList.add('show');
            }
            password.classList.add('error');
            isValid = false;
        } else {
            if (passwordError) passwordError.classList.remove('show');
            password.classList.remove('error');
        }
    }

    return isValid;
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (validateLoginForm()) {
            const loginData = {
                email: document.getElementById('loginEmail')?.value || '',
                password: document.getElementById('loginPassword')?.value || ''
            };

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Signing In...`;
            submitBtn.disabled = true;

            try {
                //REAL API CALL TO BACKEND
                const res = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginData)
                });

                const data = await res.json();

                if (data.token) {
                    // Success! Save token and close modal
                    localStorage.setItem('sh_token', data.token);
                    localStorage.setItem('sh_role', data.role);
                    localStorage.setItem('sh_name', data.name || 'User')
                    updateAuthUI()

                    alert('Login successful! Welcome back!', 'success');
                    if (data.role === 'super_admin' || data.role === 'editor') {
                        // alert('Welcome back, Administrator!');

                        setTimeout(() => {
                            window.location.href = '/admin.html';
                        }, 1000)
                    } else {
                        closeLoginModal();
                        //alert("Login successful! Welcome back!")
                    }


                    // setTimeout(() => window.location.href = '/admin.html', 1000);
                } else {
                    // Backend rejected the login
                    const emailError = document.querySelector('#loginEmail').closest('.form-group').querySelector('.error-msg');
                    if (emailError) {
                        emailError.textContent = data.message || 'Invalid credentials';
                        emailError.classList.add('show');
                    }
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("Network error. Is the backend running?");
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } else {
            // Shake effect on error
            const modal = loginModel ? loginModel.querySelector('.model') : null;
            if (modal) {
                modal.classList.add('shake');
                setTimeout(() => modal.classList.remove('shake'), 300);
            }
        }
    });
}

// Password toggle for login modal (if not already covered)
/* const loginPasswordToggles = document.querySelectorAll('#loginModel .toggle-password');

loginPasswordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const wrapper = this.closest('.password-wrapper');
        if (!wrapper) return;
        
        const input = wrapper.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input && icon) {
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    });
}); */



document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot-nav');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const heroSection = document.querySelector('.hero-section');


    let currentSlide = 0;
    let slideInterval
    const autoPlayDelay = 500000;

    //let check if the slide exist 
    if (slides.length === 0) {
        console.warn('No slides found in the hero section');
        return;
    }



    //=====================image error haandling===================
    function handleImageError(slide) {
        const bgImage = slide.style.backgroundImage;
        const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/);

        if (urlMatch && urlMatch[1]) {
            const imgUrl = urlMatch[1];
            const testImg = new Image();



            testImg.onerror = function () {
                console.error(`Failed to load image: ${imgUrl}`);

                slide.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                slide.style.background = 'cover'


            };
            testImg.src = imgUrl;
        }
    }
    //check if all slides exist
    slides.forEach(slide => handleImageError(slide));

    //=========SLIDE FUNCTION

    function showSlide(index) {
        if (index < 0) {
            index = slides.length - 1;

        } else if (index >= slides.length) {
            index = 0;
        }

        //Remove active class from all slides and dots
        slides.forEach(slide => {
            slide.classList.remove('active');
        })
        dots.forEach(dot => {
            dot.classList.remove('active')
        })

        //Add active class to the curreent slide and dots
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        currentSlide = index //update current slide index

        //slide chang animation to content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'none';

            setTimeout(() => {
                heroContent.style.animation = 'fadeInUp 0.8s ease-out';
            }, 10);
        }

    }
    function nextSlide() {
        const next = currentSlide + 1;
        showSlide(next);
        resetAutoPlay()
    }
    function prevSlide() {
        const prev = currentSlide - 1;
        showSlide(prev);
        resetAutoPlay();

    }
    function goToSlide(index) {
        showSlide(parseInt(index))
        resetAutoPlay();
    }
    //=============AUTO PLAY FUNCTION==========///
    function startAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, autoPlayDelay)
    }
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    //====================EVENT LISTENERS =============

    //previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            prevSlide();
        });

    }
    //next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            nextSlide();
        })

    }

    //dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function (e) {
            e.preventDefault();
            goToSlide(index);
        })
    });

    //pausing auto-playing on hover
    if (heroSection) {
        heroSection.addEventListener("mouseenter", stopAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay)
    }

    //==============KEYBOARD NAVIGATION=============/
    document.addEventListener('keydown', function (e) {
        if (heroSection && heroSection.offsetParent != null) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                e.preventDefault();
            }
        }
    });

    //=================TOUCH SWIPE SUPPORT=================

    let touchStartX = 0;
    let touchEndX = 0;

    if (heroSection) {
        heroSection.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        heroSection.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        })
    }
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }
    //==================RESPONSIVE HANDLING===========
    let resizeTimer;

    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {

            //re-adjust slide background position
            slides.forEach(slide => {
                if (slide.classList.contains('active')) {
                    const bgImage = slide.style.backgroundImage;

                    if (bgImage) {
                        //Force reflow to fix background position
                        slide.style.backgroundImage = 'none';
                        setTimeout(() => {
                            slide.style.backgroundImage = bgImage;
                        }, 10);
                    }
                }
            });
            //log current viewpoint size
            console.log(`Viewport resized: ${window.innerWidth} X ${window.innerHeight}`)

        }, 250)
    });
    //=======PRELOAD IMAGES============
    function preloadImage() {
        const imageUrls = []

        slides.forEach(slide => {
            const bgImage = slide.style.backgroundImage;
            const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/)

            if (urlMatch && urlMatch[1]) {
                imageUrls.push(urlMatch[1]);
            }
        })
        //preload image
        imageUrls.forEach(url => {
            const img = new Image();

            img.src = url;
            img.onload = () => {
                console.log(`Preloaded : ${url} `);
            }
            img.onerror = () => {
                console.warn(`failed to preload: ${url}`)
            }

        });
        console.log(`Preloading ${imageUrls.length} images`)
    }

    //==============Initialize slider==========
    function initSlider() {
        showSlide(0)//show first slide
        startAutoPlay()//start auto-play
        preloadImage()//preload images

        console.log(`Hero slider initialized with ${slides.length} slides`)
    }

    initSlider();

})
// ========== ADDITIONAL UTILITY FUNCTIONS ==========
// Function to manually control slider from console (for debugging)
window.heroSlider = {
    next: () => {
        const nextBtn = document.querySelector('.slider-next');
        if (nextBtn) nextBtn.click();
    },
    prev: () => {
        const prevBtn = document.querySelector('.slider-prev');
        if (prevBtn) prevBtn.click();
    },
    goTo: (index) => {
        const dots = document.querySelectorAll('.dot-nav');
        if (dots[index]) dots[index].click();
    },
    pause: () => {
        console.log('Auto-play paused');

    },
    play: () => {
        console.log('Auto-play resumed');
    }
};

console.log('Hero slider script loaded. Use window.heroSlider to control manually.');


//==========================
// SHOW ADMIN LINK IF ADMIN LOGIN
//==========================

// SMART NAVBAR - SHOW ADMIN LINK IF ADMIN
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('sh_token');
    const role = localStorage.getItem('sh_role');
    const adminLink = document.getElementById('adminLink');
    const publicLoginBtn = document.getElementById('publicLoginBtn');

    if (token && (role === 'super_admin' || role === 'editor')) {
        // User is an Admin! Show the secret link
        if (adminLink) adminLink.style.display = 'inline-flex';
        if (publicLoginBtn) publicLoginBtn.style.display = 'none';
    } else if (token) {
        // User is a Customer. Hide admin link
        if (adminLink) adminLink.style.display = 'none';
        if (publicLoginBtn) publicLoginBtn.textContent = 'MY ACCOUNT';
    }
});

/* 
QUOTES SECTION JAVASCRIPT

*/
document.addEventListener('DOMContentLoaded', function () {
    const quotes = document.querySelectorAll('.quote-content');
    const dots = document.querySelectorAll('.quotes-dot');
    const prevBtn = document.querySelector('.quotes-arrow-prev');
    const nextBtn = document.querySelector('.quotes-arrow-next');
    const counterCurrent = document.querySelector('.quotes-counter-current');
    const progressBarEl = document.querySelector('.quotes-progress-bar');
    const carousel = document.querySelector('.quotes-carousel');

    let currentIndex = 0;
    let autoTimer = null;
    const AUTO_INTERVAL = 4000;

    function goToQuote(index, resetAuto = true) {
        if (index === currentIndex) return;

        // Remove active from current
        quotes[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // Set new current index
        currentIndex = index;

        // Add active to new current
        quotes[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        // Update counter text
        if (counterCurrent) {
            counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
        }

        resetProgress();
        if (resetAuto) startAuto();
    }
    function nextQuote() {
        const next = (currentIndex + 1) % quotes.length;
        goToQuote(next, false);
    }

    function prevQuote() {
        const prev = (currentIndex - 1 + quotes.length) % quotes.length;
        goToQuote(prev, false);
    }
    function resetProgress() {
        if (progressBarEl) {
            progressBarEl.classList.remove('running');
            progressBarEl.style.width = '0%';
            // Force reflow to restart CSS transition
            void progressBarEl.offsetWidth;
            progressBarEl.classList.add('running');
        }
    }
    function startAuto() {
        stopAuto();
        resetProgress();
        autoTimer = setInterval(nextQuote, AUTO_INTERVAL);
    }
    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }
    // Event Listeners for Arrows
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextQuote(); startAuto();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevQuote(); startAuto();
        });
    }

    // Event Listeners for Dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            goToQuote(parseInt(dot.dataset.index, 10));
        });
    });
    let touchStartX = 0;
    if (carousel) {
        carousel.addEventListener('touchstart', e => {
            e.preventDefault();
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextQuote() : prevQuote();
                startAuto();
            }
        }, { passive: true });

        // Pause on Hover
        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', startAuto);
    }


    startAuto();
})

// ==========================================
// FOOTER CHAT FORM SUBMISSION
// ==========================================

const footerChatForm = document.getElementById('footerChatForm');

if (footerChatForm) {
    footerChatForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.btn-chat-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;


        const data = {
            name: document.getElementById('chatName').value,
            email: document.getElementById('chatEmail').value,
            phone_number: document.getElementById('chatPhone').value,
            message: document.getElementById('chatMessage').value,

        };

        try {
            const res = await fetch(`${BACKEND_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await res.json();

            if (result.success) {
                toast('Message send successfully! We will get back to you soon', 'success');
                footerChatForm.reset();

            } else {
                toast(result.message || 'Something went wrong', 'error')
            }



        } catch (err) {
            toast('Network error. Please try again.', 'error')

        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    })
}


// ==========================================
// DYNAMIC NAVBAR - SHOW USER NAME
// ==========================================

function updateAuthUI() {
    const token = localStorage.getItem('sh_token');
    const role = localStorage.getItem('sh_role');
    const name = localStorage.getItem('sh_name');


    const loginBtns = document.querySelectorAll('.openLogin');
    const regBtns = document.querySelectorAll('#openReg');


    const userInfos = document.querySelectorAll('.authUserInfo');
    const displayNames = document.querySelectorAll('.userDisplayName');
    const adminLinks = document.querySelectorAll('.adminLink');

    if (token && name) {
        // LOGGED IN: Hide login/register, Show Welcome
        loginBtns.forEach(btn => btn.style.display = 'none');
        regBtns.forEach(btn => btn.style.display = 'none');

        userInfos.forEach(el => el.style.display = 'flex');
        displayNames.forEach(el => el.textContent = name);

        // Show Admin link if role is admin
        if (role === 'super_admin' || role === 'editor') {
            adminLinks.forEach(link => link.style.display = 'inline-flex');
        } else {
            adminLinks.forEach(link => link.style.display = 'none');
        }

    } else {
        // LOGGED OUT: Show login/register, Hide Welcome
        loginBtns.forEach(btn => btn.style.display = 'inline-flex');
        regBtns.forEach(btn => btn.style.display = 'inline-flex');

        userInfos.forEach(el => el.style.display = 'none');
        adminLinks.forEach(link => link.style.display = 'none');
    }
}


document.addEventListener('DOMContentLoaded', updateAuthUI);


function logoutUser() {
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_role');
    localStorage.removeItem('sh_name');
    updateAuthUI();
}

/* // Add this to see what's happening
window.addEventListener('load', async () => {
    console.log('Testing API connection...');

    try {
        const res = await fetch('https://white-eangles-contructor.onrender.com/api/project');
        const data = await res.json();
        console.log('✅ API is reachable:', data);
    } catch (error) {
        console.error('❌ API is NOT reachable:', error);
    }
}); */