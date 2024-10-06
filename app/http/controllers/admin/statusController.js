const orderModel=require("../../../models/order")
function statusController(){
    return{
        update:async function(req,res){
            console.log("ADMIN PAGE NAMEE->",req.body)
            try
             {
                const updatedAt = new Date();
                // Perform the update operation
                //UPDATE STATUS IN ORDERMODEL
                //WE ARE GETTING ORDERID ,STATUS FROM name="" FROM ADMIN.JS FILE
                const updatedOrder = await orderModel.findOneAndUpdate(
                    { _id:req.body.orderId }, 
                    // { status:req.body.status },
                    // { new: true }
                    { 
                        $set: {
                          status: req.body.status,
                          updatedAt: updatedAt // Set updatedAt to the current date and time
                        }
                      },
                      { new: true }
                    
                );
                
        
                //Emit event 
                //get eventemitter from app with help of req.app.get
                const eventEmitter=req.app.get('eventEmitter');
                eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status,updatedAt:updatedAt.toISOString()});
                
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