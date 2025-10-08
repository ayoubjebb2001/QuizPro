// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (mobileToggle && navbarMenu) {
        mobileToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    window.location.href = '/auth';
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        });
    }
});
