const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport) {
     //When using passport-local, the default fields that Passport expects in the request body are username and password. However, in many applications, the email address is used as the identifier instead of a username. To handle this, you can configure the LocalStrategy to use the email field instead of the username field.
    //{usernameField:'email'} specifies that Passport should look for the email field in the request body instead of the default username field.
    //email,password->THIS COMES FROM THE USER LOGIN INPUT FIELD WHILE DONE IS A CALL BACK FUNCTION that signals the completion of an authentication attempt.
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
             //LOGIN
            // Check if email exists
            const user = await userModel.findOne({ email: email });

            if (!user) {
                //NULL NO ERROR WHILE AUTHENTICATING PROCESS
                //FALSE REFERS TO USER IS NOT AUTHENTICATED
                //MESSAGE ARE THE EXTRA DATA THAT U WANT TO PASS
                return done(null, false, { message: 'No user with this email' });
            }

            // Compare password with stored password
            //COMPARE USER PASSWORD WITH DATABASE USERMODEL STORED PASSOWRD
            //user BASICALLY CONTAINS USER DATA OF SPECIFIED ID IN FINDONE UPPER CODE
            //bcrypt.compare() WILL RETURN RESPONSE OR ERROR
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Password matches
                //NULL NO ERROR IN AUTHENTICATION PROCESS
                //USER AUTHENTICATED USER
                //MESSSAGE EXTRA DATA
                return done(null, user, { message: 'Logged in successfully' });
            } else {
                // Password doesn't match
                //IF MATCH IS FALSE
                //IF USER PASSWORD DOESNT MATCH USERMODEL STORED PASSWORD
                return done(null, false, { message:'Wrong username or password' });
            }
        } catch (err) {
            // Handle errors
            return done(err);
        }
    }));

    //BASICALY IT STORES USERS UNIQUE_ID IN SESSION ONCE IT GETS LOGED IN
    //WE WILL GET USER FROM UPPER CODE WHERE PASSWORD GETS MATCH
    passport.serializeUser((user, done) => {
        //WHAT TO STORE IN SESSION IS THE SECOND PARAMETER HERE WE HAD TO STORE USER UNIQUE ID "_id" IN SESSION
        // Store user ID in session
        done(null, user._id);
    });

    //BASICALLY USED FOR GETTING LOGIN USER DETAILS
    //userModel.findOne(_id:id) HERE FIRST _id IS IDENTITY FROM USER MODEL AND SECOND id IS THE id THAT STORED IN SESSION 
    passport.deserializeUser(async (id, done) => {
        try {
            // Retrieve user by ID
            //GET USER WHO HAS LOGGED IN
            //await userModel.findOne({ _id:id },function(err,user){
            //IF WE HAVE ID THEN GET user THUS WE WILL GET LOGIN USER ALL DETAILS
            //IF USER DOESNT FIND THEN SHOW EERROR
            const user = await userModel.findOne({ _id: id }).exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = init;
