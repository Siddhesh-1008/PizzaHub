//FIRST OF ALL GETTING OUT OF ROUTES FOLDER THEN NAVIGATING TO PATH GOLDER THEN HTTP FOLDER THEN CONTROLLER FOLDER THEN CONTROLLER.JS
//BASICALLY CONTROLLER.JS EXPORTING MODULE HAVE FUNCTION homeController() WHICH RETURNS OBJECT
const homeController=require("../app/http/controllers/homeController")
const cartController=require("../app/http/controllers/customers/cartController")
const orderController=require("../app/http/controllers/customers/orderController")
const authController=require("../app/http/controllers/authController")
const AdminorderController=require("../app/http/controllers/admin/orderController")
const statusController=require("../app/http/controllers/admin/statusController")
// REQUIRE ALL MIDDLEWARES
const guest=require("../app/http/middlewares/guest")
const ensureAuthenticated=require("../app/http/middlewares/ensureAuthenticated")
const adminSecurity=require("../app/http/middlewares/adminsecurity")
//DEFINING ALL ROUTES HERE INSIDE FUNCITON 
//function initRoutes(app) RECEIVE A PARAMETER app
//AND THEN EXPORT  IT AS MODULE AND THEN REQUIRE IT AT ANY JS FILE
function initRoutes(app){
    //DEFAULT PAGE
    //app.get() BASICALLY app IS AN INSTANCE(OBJECT) THEN IT IS USING GET METHOD(FUNCTION) OF IT WHICH TAKSE TWO PARAMETER FIRST IS ROUTE"/routename" AND OTHER PARAMETER IS function(req,res){}
    //BASICALLY HERE homeController().index DOS THE SAME WORK OF function(req,res){} 
    //AS homeController() RETURNS OBJECT {INDEX:FUNCTION()} homeController().index IS USED FOR ACCESSING THE KEY NAD WE ARE PASSING req,res TO IT {index:function()}
    app.get("/",homeController().index)
    //LOGIN PAGE
    //ADD MIDDLEWARE SO THAT IF USER IS AUTHENTICATED(MEANS LOGGED IN ) HE CAN GO TO ONLY MENU PAGE NOT OTHER Tha THAT 
    //IF USER IS NOT AUTHENTICATED THEN IT CAN GO FOR NEXT REQUEST THAT IS authController().login OR authController().register
    app.get("/login",guest,authController().login)
    //LOGIN POST 
    app.post("/login",authController().postLogin)
    //REGISTER PAGE
    app.get("/register",guest,authController().register)
    //GET DATA FROM INPUT TAGS REGISTER POST
    app.post("/register",authController().postRegister)
    //LOGOUT PAGE
    app.post("/logout",authController().logout)

    //CART PAGE
    app.get("/cart",cartController().index)
    //AXIOS API requesting for route /update-cart to add the pizza data
    app.post("/update-cart",cartController().update)


    //ORDERS PAGE
    app.post("/orders",ensureAuthenticated,orderController().store)
    //ORDER DETAILS TABLE
    app.get("/customer/orders",ensureAuthenticated,orderController().index)
    
    //SINGLE ORDER PAGE ROUTE
    //MAKE USE OF DYNAMCI ROUTING
    app.get("/customer/orders/:orderId/:orderAdress",ensureAuthenticated,orderController().show)

    //ADMIN PAGE
    app.get("/admin/orders",adminSecurity,AdminorderController().index)

    //STATUS ROUTE
    app.post("/admin/order/status",adminSecurity,statusController().update)
}


//EXPORT THE MODULE(THAT CONTAINS FUNCTION) TO REQUIRE IT IN SERVER.JS
module.exports=initRoutes