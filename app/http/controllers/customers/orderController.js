const orderModel=require("../../../models/order")
const moment=require("moment")

function orderController(){
    return{
        // store:async function(req,res){
        //     const{phone,address}=req.body
        //     console.log("DATA ABOUT PHONE NUMBER AND ADRESS:-",req.body)
        //     console.log("DATA ABOUT PHONE NUMBER AND ADRESS:-",req.user)
        //     //VALIDATION TEST IF PHONE NUMBER AND ADRESS IS NOT PRESENT
        //     if(!phone || !address)
        //     {
        //         req.flash("error","ALL FILEDS ARE REQUIRED")
        //         return res.redirect("/cart")
        //     }
            
        //     //WITH THE HELP OF PASSPORT WE CAN HAVE LOGIN USER ID USING req.user METHOD THAT HAS BENN PROVIDED BY PASSPORT
        //     const order=await orderModel.create({
        //         customerId:req.user._id,
        //         items:req.session.cart.items,
        //         phone:phone,
        //         address:address,
        //     })
        //     .then(result=>{
        //             console.log("result",result)
        //             req.flash("success","ORDERED PALCED SUCCESSFULLY")
        //             //EMPTY THE CART ONCE U HAVE ORDERED it
        //             delete req.session.cart

        //             //EMIT
        //             const eventEmitter=req.app.get('eventEmitter')
        //             eventEmitter.emit('orderPlaced',result)
        //             return res.redirect("/customer/orders")
        //     })
        //     .catch(err=>{
        //         req.flash("error","SOMETHING WENT WRONG")
        //         return res.redirect('/cart')
        //     })

        // },
        store:async function(req, res) {
            const { phone, address } = req.body;
            console.log("DATA ABOUT PHONE NUMBER AND ADDRESS:", req.body);
            console.log("DATA ABOUT PHONE NUMBER AND ADDRESS:", req.user);
        
            // Validation check
            if (!phone || !address) {
                req.flash("error", "ALL FIELDS ARE REQUIRED");
                return res.redirect("/cart");
            }
        
            // Create order
            const order=await orderModel.create({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address,
            })
            order.save().then(result => {
                console.log("result", result);
                req.flash("success", "ORDER PLACED SUCCESSFULLY");
        
                // Empty the cart
                delete req.session.cart;
        
                // Emit event
                const eventEmitter=req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced', result);
        
                // Redirect to orders page
                res.redirect("/customer/orders");
            })
            .catch(error => {
                console.log("ERROR", error);
                req.flash("error", "SOMETHING WENT WRONG");
                res.redirect('/cart');
            });
        },
        index:async function(req,res){
            //MAING USE OF ASYNC AWAIT TO GET THE ORDER DETAILS THAT HAS BEEN PLACED BY LOGED IN  USER
            //SORTING THE ORDERS AS NEW ORDERS WILLL COME FIRST AND THEN OLD ORDERS
            //SORTING THE ORDERS IN RESPECT TO CREATEDAT MEANS  PASSED null and one object{sort:createdAt:order +FOR ASCENDING,-FOR DESCENDING}
            const orders=await orderModel.find({customerId:req.user._id},null,{sort:{'createdAt':-1}})
            
            //DELETE CACHE SO THAT WHENVER WE LOAD THE customers/orders.JS WE NO NEED TO DISPLAY SUCCESFULLY ADDED BAR
            res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,precheck=0')
            

            //ORDERS WILL RETURN ARRAY OF ORDERS THAT HAS BEEN DONE BY USER
            res.render("customers/orders",{orders:orders,moment:moment})
            
        },
        show:async function(req,res){
            console.log(req.params.orderId,"<-->",req.params.orderAdress)
            //GET ALL THE DETAILS OF ORDERED USER 
            //AS CUSTOMER ID CONTIANS LOGGED IN USER ID
            //WITH THE HELP OF THESE WE CAN GET WHOLE DETAILS OF ORDER
            const orderStatus=await orderModel.findById(req.params.orderId)
            console.log("OREDER STATUS->",orderStatus)
            //NOW ONLY ALLOW THE USER TO SEE STATUS WHICH HE OR SHE HAS ORDERED
            // res.send(orderStatus)
            if(req.user._id.toString()===orderStatus.customerId.toString()){
                console.log("OREDER STATUS INSIDE->",orderStatus)
                return res.render('customers/singleOrder',{orderStatus:orderStatus})
            }else{
                return res.redirect("/")
            }



        }
    }
}
module.exports=orderController