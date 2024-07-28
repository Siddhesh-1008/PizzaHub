const express=require('express')
const ejs=require('ejs')
const expressLayout=require('express-ejs-layouts')
const path=require('path')
const app=express()

//HERE PROCESS WILL SEARCH IN ENV TO GET THE PORT AND SET IT THERE
//AS ON LIVE SERVER WE DONT KNOW ON WHICH PORT OUR PROJECT WILL RUN
const PORT=process.env.PORT ||3000

//MIDDLEWARE
//TO ACCESS STATIC FILES IN PUBLIC
//IT ACTS AS A MIDDLEEWARE TO TELL EXPRESS WHERE WE NEED TO SEARCH STATIC FILE
app.use(express.static(path.join(__dirname,"/public")))


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
app.get("/",function(req,res){
    // res.send("HELLO FROM SERVER")
    res.render("home")
})

//CART PAGE
app.get("/cart",function(req,res){
    //DEFINE THE PATH WHERE CART IS LOCATED AS IF WE SEE BELOW APP.SET("VIEWS") WE HAVE PATH TILL VIEWS
    res.render("customers/cart")
})

//LOGIN PAGE
app.get("/login",function(req,res){
    //DEFINE THE PATH WHERE CART IS LOCATED AS IF WE SEE BELOW APP.SET("VIEWS") WE HAVE PATH TILL VIEWS
    res.render("auth/login")
})

//REGISTER PAGE
app.get("/register",function(req,res){
    //DEFINE THE PATH WHERE CART IS LOCATED AS IF WE SEE BELOW APP.SET("VIEWS") WE HAVE PATH TILL VIEWS
    res.render("auth/register")
})


//PORT LISTENING
app.listen(PORT,()=>{
    console.log(`LISTENING ON ${PORT}`)
})
