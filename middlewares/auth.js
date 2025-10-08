/**
 * Authentication Middleware
 * Vérifie si l'utilisateur est connecté
 * Redirige vers /auth/login avec message d'erreur si non authentifié
 */
const isAuthenticated = function (req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        // Crée une erreur 401 qui sera gérée par le errorHandler
        const error = new Error('Vous devez être connecté pour accéder à cette page');
        error.status = 401;
        return next(error);
    }
}

module.exports = isAuthenticated;