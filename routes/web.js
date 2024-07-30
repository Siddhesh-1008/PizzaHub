//FIRST OF ALL GETTING OUT OF ROUTES FOLDER THEN NAVIGATING TO PATH GOLDER THEN HTTP FOLDER THEN CONTROLLER FOLDER THEN CONTROLLER.JS
//BASICALLY CONTROLLER.JS EXPORTING MODULE HAVE FUNCTION homeController() WHICH RETURNS OBJECT
const homeController=require("../app/http/controllers/homeController")
const cartController=require("../app/http/controllers/customers/cartController")
const authController=require("../app/http/controllers/authController")


//DEFINING ALL ROUTES HERE INSIDE FUNCITON 
//function initRoutes(app) RECEIVE A PARAMETER app
//AND THEN EXPORT  IT AS MODULE AND THEN REQUIRE IT AT ANY JS FILE
function initRoutes(app){
    //DEFAULT PAGE
    //app.get() BASICALLY app IS AN INSTANCE(OBJECT) THEN IT IS USING GET METHOD(FUNCTION) OF IT WHICH TAKSE TWO PARAMETER FIRST IS ROUTE"/routename" AND OTHER PARAMETER IS function(req,res){}
    //BASICALLY HERE homeController().index DOS THE SAME WORK OF function(req,res){} 
    //AS homeController() RETURNS OBJECT {INDEX:FUNCTION()} homeController().index IS USED FOR ACCESSING THE KEY NAD WE ARE PASSING req,res TO IT {index:function()}
    app.get("/",homeController().index)
 
    //CART PAGE
    app.get("/cart",cartController().index)
    
    //AXIOS API requesting for route /update-cart to add the pizza data
    app.post("/update-cart",cartController().update)

    //LOGIN PAGE
    app.get("/login",authController().login)
    
    //REGISTER PAGE
    app.get("/register",authController().register)
}

//EXPORT THE MODULE(THAT CONTAINS FUNCTION) TO REQUIRE IT IN SERVER.JS
module.exports=initRoutes