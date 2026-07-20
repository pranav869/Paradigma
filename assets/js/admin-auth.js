// admin-auth.js

// Hardcoded credentials for simple local authentication
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const dashboardContent = document.getElementById('dashboard-content');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // Check session storage for existing login
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        showDashboard();
    } else {
        showLogin();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            showDashboard();
        } else {
            loginError.style.display = 'block';
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('isAdminLoggedIn');
            showLogin();
        });
    }

    function showDashboard() {
        loginOverlay.style.display = 'none';
        dashboardContent.style.display = 'flex';
        // Trigger a custom event to load data after auth
        document.dispatchEvent(new Event('AdminAuthenticated'));
    }

    function showLogin() {
        loginOverlay.style.display = 'flex';
        dashboardContent.style.display = 'none';
        loginError.style.display = 'none';
        loginForm.reset();
    }
});
