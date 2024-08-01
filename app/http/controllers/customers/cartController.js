//CLOSURE ARE SIMILAR TO LEXICAL ENVIRONMENT MEANS VALUES DEFINE INSIDE THE FUNCTION ARE NOT ACCESSIBLE OUTSIDE THE FUNCTION IT WIILL BE ACCESSIBLE IN ITS LOCAL SCOPE{}
//FACTORY FUNCTIONS:SIMPLE RETURNS OBJECT

function cartController(){
    return{
        // index name can be anythong it can be cart,xyz AS PER VIDEO I HAD WRITTEN index
        index:function(req,res){
            res.render("customers/cart")
        },
        update:function(req,res)
        {
            
            //req.session is an object where you can store data specific to the current user’s session. For example, you might store user login status,
            //req.session.cart: This is a custom property you might define on the req.session object to store the user's shopping cart data.
            //WITH THE HELP OF req.session.cart we are able to store cart data in session
            //FIRST CHECK WHETHER SESSION COLLECTION HAS CART OR NOT
            if(!req.session.cart)
            {
                //IF NOT THERE THEN CREATE EMPTY CART(object) IN IT
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
            }
            //IF THERE SESSION STORE CONTIANS CART THEN GET IT IN VARIABLE
            let cart=req.session.cart
            console.log("PIIZA DATA THAT HAS BEEN CLICKED BY USER->",req.body)


            //NOW CHECK WHETHER THE PIZZA THAT U HAVE SELECTED IS ALREADY PRESENT IN CART OR NOT
            //CART KE ITEMS KEY KE ANDAR KUCH PRESNET AHE KI NHI cart={items:{req.body,_id:value}}
            if(!cart.items[req.body._id])
            {
                //req.body contains the data sent in the body of the HTTP request. For POST requests, the data is included in the request body
                //middleware like express.json() parses the JSON data from the request body and makes it available in req.body
                //IF CART DOESNT HAVE THAT ITEM THEN ADD NEW ITEM IN CART AND INCREMENT THE QTY
                //BASICALLY ADD ITEM,QTY TO PARTICULAR USERID cart.items[key_id]
                // AND TOTAL_QTY,TOTAL_PRICE 
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1
                },
                cart.totalQty=cart.totalQty+1
                cart.totalPrice=cart.totalPrice+req.body.price
            }
            else
            { 
                //IF PIZZA ID IS ALREADY PRESNT TN THE CART 
                //THEN INCREASE THE QTY BY 1
                //SIMILAR FOR PRICE AND TOTAL QTY
                cart.items[req.body._id].qty=cart.items[req.body._id].qty+1
                cart.totalQty=cart.totalQty+1
                cart.totalPrice=cart.totalPrice+req.body.price

            }
            //TOTAL QTY ARE BASICALLY TOTAL NUMBER OF PIZZAS ADDED ALL =TOGETHER
            //QTY REFERS TO QTY OF THAT CLICKED USER PIZZA
            console.log("SESSION DEKHO",req.session)
            console.log("SERVER SIDE CONSOLE->",req.session.cart)
            return res.json({totalQty:req.session.cart.totalQty})
            
        }

    }
}

// EXPORTING THE MDULE THAT CONTAINS authController()
module.exports=cartController