//CLOSURE ARE SIMILAR TO LEXICAL ENVIRONMENT MEANS VALUES DEFINE INSIDE THE FUNCTION ARE NOT ACCESSIBLE OUTSIDE THE FUNCTION IT WIILL BE ACCESSIBLE IN ITS LOCAL SCOPE{}
//FACTORY FUNCTIONS:SIMPLE RETURNS OBJECT
const userModel=require("../../models/user.js")
const bcrypt=require("bcrypt")
const passport=require("passport")

function authController(){
    return{
        login:function(req,res){
            res.render("auth/login")
        },
        postLogin:function(req,res,next){
            //HERE PASSPORT.AUTHENTICATE USE TO GET DONE() MEEAGES
            //HERE done(null or err,user or false,message:{}) IS SIMILAR TO  (err,user,info)
            //BASICALLY PASSPORT.JS RETURNS VALUE AND HRE WE ARE ACCEPTING IT
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message)
                    //FOR EERRO HANDLING
                    return next(err)
                }
                
                // IF done returns(null,false,{message:""}) MEANS user IS FALSE 
                if(!user){
                    console.log(info.message)
                    req.flash('error',info.message)
                    res.redirect("/login")
                }


                //BELOW CODE WILL EXEXUTE ONLY WHEN done(null,user,{message:"email is correct and password gets matched"})
                //In Passport.js, req.logIn is a method used to log in a user and establish a session. 
                //And as well as set set user _id in session using passport.serializeUser
                // It is a part of the Express request object (req) and is used to manually establish a session for a user after successful authentication.
                req.logIn(user,function(err){
                    if(err){
                    req.flash("error",info.message)
                    return next(err)
                    }
                    // REDIRECT TO HOME PAGE
                    return res.redirect("/")
                })
            })(req,res,next)

            
        },
        register:function(req,res){
            res.render("auth/register")
        },
        postRegister:async function(req,res){
            // DESTRUCTURING OF OBJECT
            //REQ.BODY WILL CONTAIN {name:"",email:"",passowrd:""}
            const {name,email,password}=req.body
            
            //VALIDATE REQUEST(IF ANY ONE OF THETHING IS NOT PRESENT)
            if(!name || !email || !password)
            {
                //res.redirect doesnot sent value from server to client as res.render(".ejs",{data:data}does)
                //SO WE MAKE USE OF FLASH
                //req.flash("key","statement")SENT A REQUEST FROM SERVER TO CLIENT 
                //ON register.ejs RECEIVE IT IN FORM OF "messages.keyname"
                req.flash("error","ALL FIELDS ARE REQUIRED")
                //TO SET TH WRITEN NAME AND EMAIL DATA IN VALUE OF INPUT TAG SO TEHY DOESNT GET LOST AFTER REDIRECTING
                req.flash("name",name)
                req.flash("email",email)
                res.redirect("/register")
            }
            console.log(req.body)

            //CHECK IF EMAIL EXISTS
            await userModel.exists({email:email}).then(result=>{
                if(result){
                    req.flash("error","EMAIL ALREADY EXISTS")
                    req.flash("name",name)
                    req.flash("email",email)
                    res.redirect("/register")
                }
            }).catch(err => {
                //Handle the error
                req.flash("error", "An error occurred");
                res.redirect("/register");
            });
                
            

            //HASH PASSword before saving to usermodel
            const hashedPassword=await bcrypt.hash(password,10)
            //CREATE A USER
            const user=await userModel.create({
                name:name,
                email:email,
                password:hashedPassword
            })
            //THEN SAVE THE CHANGES
            user.save().then((user)=>{
                //LOGIN
                res.redirect("/login")
            }).catch((err)=>{
                req.flash("error","SOMETHING WENT WRONG")
                res.redirect("/register")
            })






        },
        logout:function(req,res){
            //DESTROY THE SESSION ONCE LOGOUT
            req.logout(
                function(err)
                {
                    if (err) {
                        return next(err);
                    }
                    req.session.destroy(function(err) {
                        if (err) {
                            return next(err);
                            }
                        res.redirect('/login'); 
                    })
                 })
            

        }
    }
}

// EXPORTING THE MDULE THAT CONTAINS authController()
module.exports=authController