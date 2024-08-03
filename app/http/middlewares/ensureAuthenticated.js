// ensureAuthenticated.js
//This middleware ensures that non-authenticated users are redirected to the login page if they try to access protected routes.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

module.exports = ensureAuthenticated;
