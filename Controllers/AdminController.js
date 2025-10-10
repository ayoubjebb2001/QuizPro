const User = require('../Models/User');

/**
 * AdminController - Gère les fonctionnalités d'administration
 */
class AdminController {
    /**
     * GET /admin/users - Afficher tous les utilisateurs avec leurs scores
     */
    static showUsers(req, res, next) {
        User.getUsersWithScores((err, users) => {
            if (err) {
                console.error('Error fetching users with scores:', err);
                // Passe l'erreur au middleware de gestion d'erreurs
                return next({
                    status: 500,
                    message: 'Erreur lors du chargement des utilisateurs',
                    error: err
                });
            }

            // res.send(users.filter(u => u.average_score).length);
            res.render('admin/users', {
                title: 'Gestion des Utilisateurs',
                user: req.session.user,
                users: users,
                error: null
            });
        });
    }
}

module.exports = AdminController;
