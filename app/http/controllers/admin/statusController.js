const orderModel=require("../../../models/order")
function statusController(){
    return{
        update:async function(req,res){
            console.log("ADMIN PAGE NAMEE->",req.body)
            try
             {
                // Perform the update operation
                //UPDATE STATUS IN ORDERMODEL
                //WE ARE GETTING ORDERID ,STATUS FROM name="" FROM ADMIN.JS FILE
                await orderModel.updateOne(
                    { _id:req.body.orderId }, 
                    { status:req.body.status }
                );
        
                //Emit event 
                //get eventemitter from app with help of req.app.get
                const eventEmitter=req.app.get('eventEmitter');
                eventEmitter.emit('orderUpdated', { id:req.body.orderId,status:req.body.status});
                
                // Redirect to /admin/orders
                res.redirect('/admin/orders');
            } catch (err) {
                // Handle the error and redirect to /admin/orders
                console.error('Error updating order:', err);
                res.send(err);
            }
            
            

        }
    }

}

module.exports=statusController