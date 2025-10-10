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

    /**
     * Get all users with their scores statistics
     * Returns: user info + total games, average score, best score
     */
    static getUsersWithScores(callback) {
        const sql = `
            SELECT 
                u.id,
                u.username,
                u.ROLE,
                COUNT(s.id) as total_games,
                ROUND(AVG(s.score), 2) as average_score,
                MAX(s.score) as best_score,
                MIN(s.score) as worst_score,
                MAX(s.taken_at) as last_played
            FROM users u
            LEFT JOIN scores s ON u.id = s.user_id
            GROUP BY u.id, u.username, u.ROLE HAVING u.role = 'user'
            ORDER BY average_score DESC, total_games DESC
        `;

        conn.query(sql, callback);
    }

    /**
     * Get detailed scores for a specific user
     */
    static getUserScoresById(userId, callback) {
        const sql = `
            SELECT 
                s.id,
                s.score,
                s.taken_at,
                c.NAME as category_name,
                c.description as category_description
            FROM scores s
            LEFT JOIN categories c ON s.category_id = c.id
            WHERE s.user_id = ?
            ORDER BY s.taken_at DESC
        `;

        conn.query(sql, [userId], callback);
    }
}

module.exports = User;