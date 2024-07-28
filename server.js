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

//ROUTES
app.get("/",function(req,res){
    // res.send("HELLO FROM SERVER")
    res.render("home")
})

//SET VIEW ENGINE AND PATH FOR VIEW
//The app.set('views', path.join(__dirname, '/resources/views')) line in an Express.js application specifies the directory where the view templates (e.g., EJS files) are located.
//AS HOME.EJS PRESENT IN VIEWS FOLDER THEN TO SPECIFY SERVER WHERE TO SEARCH EJS FILE WE ARE SETING A PATH
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))

//VIEW ENGINE
app.set("view engine","ejs")

//PORT LISTENING
app.listen(PORT,()=>{
    console.log(`LISTENING ON ${PORT}`)
})
