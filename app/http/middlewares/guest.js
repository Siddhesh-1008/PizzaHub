//GUEST WILL NOT ALLOW TO GET DIRECT LOGIN INTO THE ACOUNT WITH THE HELP OF URLS
//IF IT IS AUTHENTICATED USER THEN ONLY ABLE TO SEE MENU PAGE
//PASSPORT HELPS US TO GET THIS
function guest(req,res,next){
    //isAuthenticated() TO CHECK WHETHER THE GUEST IS LOGGED IN OR NOT 
    if(!req.isAuthenticated()){
        return next()
    }
    return res.redirect('/')
}

module.exports=guest