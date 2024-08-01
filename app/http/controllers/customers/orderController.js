const orderModel=require("../../../models/order")
const moment=require("moment")

function orderController(){
    return{
        store:async function(req,res){
            const{phone,address}=req.body
            console.log("DATA ABOUT PHONE NUMBER AND ADRESS:-",req.body)
            console.log("DATA ABOUT PHONE NUMBER AND ADRESS:-",req.user)
            //VALIDATION TEST IF PHONE NUMBER AND ADRESS IS NOT PRESENT
            if(!phone || !address)
            {
                req.flash("error","ALL FILEDS ARE REQUIRED")
                return res.redirect("/cart")
            }
            //WITH THE HELP OF PASSPORT WE CAN HAVE LOGIN USER ID USING req.user METHOD THAT HAS BENN PROVIDED BY PASSPORT
            const order=await orderModel.create({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone:phone,
                address:address,
            }).then(result=>{
                    req.flash("success","ORDERED PALCED SUCCESSFULLY")
                    //EMPTY THE CART ONCE U HAVE ORDERED it
                    delete req.session.cart
                    return res.redirect("/customer/orders")
            }).catch(err=>{
                req.flash("error","SOMETHING WENT WRONG")
                return res.redirect('/cart')
            })

        },
        index:async function(req,res){
            //MAING USE OF ASYNC AWAIT TO GET THE ORDER DETAILS THAT HAS BEEN PLACED BY LOGED IN  USER
            //SORTING THE ORDERS AS NEW ORDERS WILLL COME FIRST AND THEN OLD ORDERS
            //SORTING THE ORDERS IN RESPECT TO CREATEDAT MEANS TOIMING PASSED null and one object{sort:+ FOR ASCENDING,-FOR DESCENDING}
            const orders=await orderModel.find({customerId:req.user._id},null,{sort:{'createdAt':-1}})
            
            //DELETE CACHE SO THAT WHENVER WE LOAD THE customers/orders.JS WE NO NEED TO DISPLAY SUCCESFULLY ADDED BAR
            res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,precheck=0')
            

            //ORDERS WILL RETURN ARRAY OF ORDERS THAT HAS BEEN DONE BY USER
            res.render("customers/orders",{orders:orders,moment:moment})
            
        }
    }
}
module.exports=orderController