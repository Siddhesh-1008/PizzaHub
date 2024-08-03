const orderModel=require("../../../models/order.js")
function AdminorderController(){
    return {
        index:async function(req,res)
        {
            //FIRST OF ALL DONOT SHOW ORDERS THAT ARE COMPLETED AS WELL AS POPULATE customerId  BECAUSE cusstomerId HAS ID OF LOGGEND IN USER AS WELL AS WE HAD PUT REF:USER SO WE CAN PUT WHOLE DETAILS OF USER IN IT
            //{status:{ $ne:"completed"}} MEANS SHOW ONLY THAT ORDERS THAT ARE NOT COMPLETED $ne:"completed" MEANS NOTEQL TO COMPLETED
            //SECOND PARAM IS NULL
            //{sort:{'createdAt':1}} BASICALLY SORT THE ORDERS IN DESCENDING ORDER
            //.POPULATE(IDENTITY WHERE U HAVE USED REF:USER) THIS BASICALLY MEANS CUSTOMER ID HAS LOGGED IN USER ID WITH THE HELP OF THIS WE CAN EASILY BRING WHOLE IDENTITY OF A USER IN CUSTOMER ID
            //.populate("","-password") WHILE POPULATING DONT GET THE PASSWORD FROM IT 
            //.exec() method in Mongoose is used to execute a query and return a promise. BASICALLY IT ALLOWS TO BRING ALL THE ASYNC CODE IN LINE BY LINE
            let orders=await orderModel.find({status:{ $ne:"completed"}},null,{sort:{'createdAt':1}}).populate('customerId','-password').exec()
            console.log("ADMIN",orders)
            //IF AXIOS.GET CALL HA BEEN MADE TO THIS ROUTE THEN RETURN json DATA ALONG WITH orders IN IT
            //ELSE RENDER THE admin/orders.ejs
            if(req.xhr){
                console.log()
                return res.json(orders)
            }
            res.render("admin/orders.ejs")

        }
    }
    
}

module.exports=AdminorderController