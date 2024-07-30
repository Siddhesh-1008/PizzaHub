//CLOSURE ARE SIMILAR TO LEXICAL ENVIRONMENT MEANS VALUES DEFINE INSIDE THE FUNCTION ARE NOT ACCESSIBLE OUTSIDE THE FUNCTION IT WIILL BE ACCESSIBLE IN ITS LOCAL SCOPE{}
//FACTORY FUNCTIONS:SIMPLE RETURNS OBJECT

function authController(){
    return{
        login:function(req,res){
            res.render("auth/login")
        },
        register:function(req,res){
            res.render("auth/register")
        }
    }
}

// EXPORTING THE MDULE THAT CONTAINS authController()
module.exports=authController