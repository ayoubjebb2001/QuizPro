/**
 * Admin Authorization Middleware
 * Vérifie si l'utilisateur est connecté ET a le rôle admin
 * Passe une erreur 401 (non authentifié) ou 403 (pas admin) au errorHandler
 */
const isAdmin = function (req, res, next) {
    // Vérifier d'abord si l'utilisateur est connecté
    if (!req.session || !req.session.user) {
        const error = new Error('Vous devez être connecté pour accéder à cette page');
        error.status = 401;
        return next(error);
    }

    // Vérifier si l'utilisateur a le rôle admin
    if (req.session.user.role === 'admin') {
        return next();
    } else {
        const error = new Error('Accès réservé aux administrateurs uniquement');
        error.status = 403;
        return next(error);
    }
}

module.exports = isAdmin;