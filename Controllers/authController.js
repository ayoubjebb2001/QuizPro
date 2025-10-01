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

            // Success response
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    role: newUser.role
                }
            });

        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

}

module.exports = AuthController;