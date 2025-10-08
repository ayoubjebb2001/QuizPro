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


            res.status(201).render('login',{username : username});

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
                return res.status(400).json({
                    success: false,
                    message: 'Username and password are required'
                });
            }

            const user = await User.findByUsername(username);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            const isPasswordValid = await User.validatePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                })
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.ROLE
            };

            // res.status(200).json({
            //     message: "Login success",
            //     user: req.session.user
            // })

            if(user.ROLE == "user"){
                res.redirect('../home/');
            }else{
                res.redirect("../question/")
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internat server error'
            })
        }

    }

    static logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Logout error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error logging out'
                    });
                }

                // Clear the session cookie
                res.clearCookie('connect.sid');

                res.redirect('auth/login');
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

}

module.exports = AuthController;