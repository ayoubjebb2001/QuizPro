const bcrypt = require('bcrypt');
const conn = require('../config/database');

class User {
    constructor(username, password, role = 'user') {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Create a new user with hashed password
    static async create(username, password, role = 'user') {
        try {
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            return new Promise((resolve, reject) => {
                const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
                conn.query(sql, [username, hashedPassword, role], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: result.insertId,
                            username: username,
                            role: role
                        });
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    }

    // Find user by username
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            conn.query(sql, [username], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0] || null);
                }
            });
        });
    }

    // Find user by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            conn.query(sql, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0] || null);
                }
            });
        });
    }

    // Validate password
    static async validatePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    // Check if username already exists
    static async exists(username) {
        try {
            const user = await User.findByUsername(username);
            return user !== null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;