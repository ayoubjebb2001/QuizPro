/**
 * Error Handler Middleware
 * Gère les erreurs de manière centralisée avec redirection appropriée
 */

/**
 * Middleware pour gérer les erreurs d'authentification et autres erreurs
 */
const errorHandler = (err, req, res, next) => {
    // Log l'erreur pour le débogage
    console.error('Error occurred:', {
        message: err.message,
        status: err.status,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Définir le status code
    const statusCode = err.status || err.statusCode || 500;

    // Gestion spécifique selon le type d'erreur
    switch (statusCode) {
        case 401: // Unauthorized - Authentication required
            if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
                // Si c'est une requête AJAX/API
                return res.status(401).json({
                    success: false,
                    message: err.message || 'Authentication required',
                    redirectTo: '/auth/login'
                });
            } else {
                // Si c'est une requête normale
                req.session.errorMessage = err.message || 'Vous devez vous connecter pour accéder à cette page';
                return res.redirect('/auth/login');
            }

        case 403: // Forbidden - Insufficient permissions
            if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
                return res.status(403).json({
                    success: false,
                    message: err.message || 'Insufficient permissions',
                    redirectTo: '/home'
                });
            } else {
                req.session.errorMessage = err.message || 'Vous n\'avez pas les permissions nécessaires';
                return res.redirect('/home');
            }

        case 404: // Not Found
            return res.status(404).render('error', {
                title: 'Page Non Trouvée',
                message: err.message || 'La page demandée n\'existe pas',
                error: process.env.NODE_ENV === 'development' ? err : {},
                user: req.session?.user || null
            });

        case 500: // Internal Server Error
        default:
            if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
                return res.status(statusCode).json({
                    success: false,
                    message: err.message || 'Une erreur est survenue',
                    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
                });
            } else {
                return res.status(statusCode).render('error', {
                    title: 'Erreur',
                    message: err.message || 'Une erreur est survenue',
                    error: process.env.NODE_ENV === 'development' ? err : {},
                    user: req.session?.user || null
                });
            }
    }
};

/**
 * Middleware pour attraper les erreurs 404 (routes non trouvées)
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error('Page non trouvée');
    error.status = 404;
    next(error);
};

/**
 * Wrapper pour les fonctions async dans les routes
 * Attrape automatiquement les erreurs des async/await
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
