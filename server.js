require('dotenv').config()
const express=require('express')
const ejs=require('ejs')
const expressLayout=require('express-ejs-layouts')
const mongoose=require('mongoose')
const path=require('path')
const app=express()
const session=require("express-session")
const flash=require('express-flash')
const MongoDbStore=require('connect-mongo')
const passport=require("passport")


//HERE PROCESS WILL SEARCH IN ENV TO GET THE PORT AND SET IT THERE
//AS ON LIVE SERVER WE DONT KNOW ON WHICH PORT OUR PROJECT WILL RUN
const PORT=process.env.PORT ||3000

//DATABASE CONNECTION
//URL WILLL BE GIVEN
const url='mongodb://localhost/pizza'
//CONNECT 
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
//STORE THE CONNECTION
const connection=mongoose.connection;
//CHECK CONNECTED OR NOT
try{
    connection.once('open',()=>{
    console.log("CONNECTED SUCCESSFULLY")
})
}
catch(err){
    console.log('MongoDB connection error:', err);
}


//SESSIONID STORE IN DATABASE
//CREATE SESSIONS COLLECTION IN DATABASE
let mongoStore=MongoDbStore.create({
    mongoUrl:url,
    collection:"sessions"
})


//SESSION CONFIG 
//ACT AS MIDDLEWARE In an Express.js application, you use middleware (like express-session) to handle sessions. This middleware adds a session object to the req (request) object in your route handlers.
//SESSION BASICALLY ARE THE CONNECTION BETWEEN USER AND SERVER
//WITHOUT SECRET WE CANNOT ENCRYPT THE IDENTITES THAT U WANT TO SET AS A COOKIE ON BROWSER IT HELPS TO IDENTIFY USER WHETHER USER IS AUTHENTICATE USER OR NOT
//USER SENT A REQUEST(IT HAS BASICAALY REQUEST AND RESPONSE HEADER) TO SERVER SERVER SENT A RESPONSE BACK BY SETING COOKIE TO USER
app.use(session({
    //SECRET IS USED TO ENCRYPT COOKIE 
    secret:process.env.COOKIE_SECRET,
    resave:false,
    //BASICALLY IT STORES SESSON ID(COOKIE) IN SESSIONS COLLECTION
    store:mongoStore,
    saveUninitialized:false,
    //DEFINES THE AGE OF COOKIE FOR HOW MUCH TIME COOKIE WILL BE VALID "1000*60*60*24"THIS REFERS TO 24HOURS
    cookie:{maxAge: 1000*60*60*24}

}))

//PASSPORT CONFIG
//IMPORT INIT FUNCTION THAT HAS BEEN EXPORTED FROM passport.js
const passportInit=require("./app/config/passport.js")
//CALLED PASSPORT INIT FUNCITON AND PASSED passport argument to it
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


//EXPRESS FLASH 
//Express Flash is used to provide flash messages in your Express.js application. Flash messages are temporary messages that can be displayed to the user, such as success or error messages.
app.use(flash())

app.use((req, res, next) => {
    console.log("-->",req.session);
    next();
});

//GLOBAL VARIABLE APPLIED TO ALL
//MAKE GLOBAL MIDDLEWARE SO THAT EVERY EJS FILE ABLE TO GET SESSION DATA
//In Express applications that use authentication middleware, such as Passport.js, req.user is a property of the req (request) object that contains information about the currently logged-in user.
    app.use(function(req,res,next){
        res.locals.session=req.session
        res.locals.user=req.user
        next()
    })


//MIDDLEWARE
//TO ACCESS STATIC FILES IN PUBLIC
//IT ACTS AS A MIDDLEEWARE TO TELL EXPRESS WHERE WE NEED TO SEARCH STATIC FILE
app.use(express.static(path.join(__dirname,"/public")))
//Express uses middleware (like express.json()) to parse the body of the request. This middleware converts the JSON data into a JavaScript object that you can easily work with.
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//SET VIEW ENGINE AND PATH FOR VIEW
//The app.set('views', path.join(__dirname, '/resources/views')) line in an Express.js application specifies the directory where the view templates (e.g., EJS files) are located.
//AS HOME.EJS PRESENT IN VIEWS FOLDER THEN TO SPECIFY SERVER WHERE TO SEARCH EJS FILE WE ARE SETING A PATH
app.use(expressLayout)

app.set('views',path.join(__dirname,'/resources/views'))


//VIEW ENGINE
app.set("view engine","ejs")

//ROUTES
//BAISCALLY ROUTES SHOULD COME AFTER VIEW ENGINE AND MIDDLEWARE
//TO MAKE LAYOUT WORK WE NEED TO DEFIEN IT AFTER VIEW ENGINES AND MIDDLEWARE

//DEFINE ALL ROUTES IN WEB.JS 
//IMPORT THE MODULE THAT HAS BEEN EXPORTED FROM WEB.JS AND IMPORT IT 
//require("./routes/web.js") IT RECEIVES THE initRoutes FUNCTION
//allroutes(app) MEANS CALLING THE FUNCTION BY PASSING ARGUMETNS app TO IT
allroutes=require("./routes/web.js")
allroutes(app)



//PORT LISTENING
app.listen(PORT,()=>{
    console.log(`LISTENING ON ${PORT}`)
})
