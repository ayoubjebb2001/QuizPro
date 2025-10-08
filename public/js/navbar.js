
const userButton = document.getElementById('userButton');
const dropdownMenu = document.getElementById('dropdownMenu');

userButton.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    userButton.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    if (!userButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
        userButton.classList.remove('active');
    }
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navbarMenu = document.getElementById('navbarMenu');

mobileToggle.addEventListener('click', function () {
    navbarMenu.classList.toggle('show');
});

document.getElementById('logout').addEventListener('click', async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        const data = await response.json();

        if (data.success) {
            // Redirect to login page after successful logout
            window.location.href = '/auth/login';
        } else {
            console.error('Logout failed:', data.message);
            alert('Failed to logout. Please try again.');
        }

    } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred during logout. Please try again.');
    }
});