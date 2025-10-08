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