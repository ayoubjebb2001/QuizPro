

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
    try {
        const response = await fetch('http://127.0.0.1:3001/auth/logout', {
            method: 'POST',
        })

        if (!response.ok) {
            throw new Error(`Error Message : ${response.message}`);
        }

    } catch (error) {
        return {
            message: "Failed to logout",
            error: `${response.message}`
        }
    }
});