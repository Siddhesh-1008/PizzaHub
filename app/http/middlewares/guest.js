//GUEST WILL NOT ALLOW TO GET DIRECT LOGIN INTO THE ACOUNT WITH THE HELP OF URLS
//IF IT IS AUTHENTICATED USER THEN ONLY ABLE TO SEE MENU PAGE
//PASSPORT HELPS US TO GET THIS
//This middleware ensures that authenticated users are redirected to the home page if they try to access the login or register pages.
// guest.js
function guest(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

module.exports = guest;
