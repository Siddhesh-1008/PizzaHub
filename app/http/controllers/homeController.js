//CLOSURE ARE SIMILAR TO LEXICAL ENVIRONMENT MEANS VALUES DEFINE INSIDE THE FUNCTION ARE NOT ACCESSIBLE OUTSIDE THE FUNCTION IT WIILL BE ACCESSIBLE IN ITS LOCAL SCOPE{}
//FACTORY FUNCTIONS:SIMPLE RETURNS OBJECT

//IMPORTING MODELS
//CONTROLLERS SE BAHAR AAO THEN HTTPS SE BAHAR AAO U ARE NOW IN APP FOLDER THEN NAVIGATE TO MODELS THEN MENU.JS
const MenuModel=require("../../models/menu.js")

function homeController()
{
    return{
        index:async function(req,res)
        {
        // TO GET ALL THE IDENTITIES OF MENU MODEL
        
        const pizzas=await MenuModel.find() 
        return res.render("home",{pizzas:pizzas})   
        }
    }
}

// EXPORTING THE MDULE THAT CONTAINS homeController()
module.exports=homeController