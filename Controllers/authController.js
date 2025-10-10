const User = require('../Models/User');

class AuthController {
    // Handle user signup
    static async signup(req, res) {
        try {
            const { username, password } = req.body;

            // Input validation
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username and password are required'
                });
            }

            // Check if username is already taken
            const userExists = await User.exists(username);
            if (userExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Create new user
            const newUser = await User.create(username, password);


            res.status(201).render('auth/login', { username: username });

        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async login(req, res) {

        try {


            const { username, password } = req.body;

            if (!username || !password) {
                return res.redirect('/auth/login',{ title: 'Login', error: 'Username and password are required', username: '' });
            }

            const user = await User.findByUsername(username);

            if (!user) {
                return res.redirect('/auth/login',{ title: 'Login', error: 'Invalid username or password', username: username });
            }

            const isPasswordValid = await User.validatePassword(password, user.password);
            if (!isPasswordValid) {
                return res.redirect('/auth/login',{ title: 'Login', error: 'Invalid username or password', username: username });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            // res.status(200).json({
            //     message: "Login success",
            //     user: req.session.user
            // })

            if (user.role == "user") {
                res.redirect('/home');
            } else {
                res.redirect("/admin/questions/")
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }

    }

    static logout(req, res) {
        try {
            // Destroy the session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error logging out'
                    });
                }

                // Clear the session cookie
                res.clearCookie('connect.sid');

                // Send success response
                res.status(200).json({
                    success: true,
                    message: 'Logged out successfully'
                });
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

}

module.exports = AuthController;