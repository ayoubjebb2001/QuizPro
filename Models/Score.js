const db = require('../config/database');

/**
 * Modèle Score - Gère les scores des utilisateurs
 */

// Créer un nouveau score
exports.create = (userId, score, categoryId, callback) => {
    const sql = 'INSERT INTO scores (user_id, score, category_id) VALUES (?, ?, ?)';
    db.query(sql, [userId, score, categoryId], callback);
};

// Récupérer tous les scores d'un utilisateur
exports.getByUserId = (userId, callback) => {
    const sql = `
        SELECT s.*, c.NAME as category_name 
        FROM scores s
        JOIN categories c ON s.category_id = c.id
        WHERE s.user_id = ?
        ORDER BY s.date DESC
    `;
    db.query(sql, [userId], callback);
};

// Récupérer les scores d'un utilisateur pour une catégorie
exports.getByUserAndCategory = (userId, categoryId, callback) => {
    const sql = `
        SELECT s.*, c.NAME as category_name 
        FROM scores s
        JOIN categories c ON s.category_id = c.id
        WHERE s.user_id = ? AND s.category_id = ?
        ORDER BY s.date DESC
    `;
    db.query(sql, [userId, categoryId], callback);
};

// Récupérer le meilleur score d'un utilisateur pour une catégorie
exports.getBestScore = (userId, categoryId, callback) => {
    const sql = `
        SELECT MAX(score) as best_score
        FROM scores
        WHERE user_id = ? AND category_id = ?
    `;
    db.query(sql, [userId, categoryId], callback);
};

// Récupérer les meilleurs scores (leaderboard)
exports.getLeaderboard = (limit = 10, callback) => {
    const sql = `
        SELECT u.username, s.score, s.category_id, c.NAME as category_name, s.date
        FROM scores s
        JOIN users u ON s.user_id = u.id
        JOIN categories c ON s.category_id = c.id
        ORDER BY s.score DESC, s.date DESC
        LIMIT ?
    `;
    db.query(sql, [limit], callback);
};

module.exports = exports;
