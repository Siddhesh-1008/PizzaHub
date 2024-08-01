//CREATING MENU SCHMEA
const mongoose=require('mongoose')


//new Schema({}) IS A CONTRUCTOR FUNCTION THAT CREATES CLASS Schema()
const orderSchema=mongoose.Schema({
    //ONE WHICH HAS ORDERED NEED TO STORE ID OF USER
    customerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
            },
            items:{
                type:Object,
                required:true
            },
            phone:{
                type:String,
                required:true

            },
            address:{
                type:String,
                required:true
            },
            paymentType:{
                type:String,
                default:'COD'
            },
            status:{
                type:String,
                default:'order_placed'
            }

},{timestamps:true})

//MODEL CREATION
//MONGOOSE IS AN INSTANCE IT HAS MODEL IN IT WHICH TAKES TOW PAREMETER FIRST COLLECTION NAME WHICH IS IN PLURAL AND SECOND SCHEMA NAME
const OrderModel=mongoose.model("Order",orderSchema)

//export the modules
module.exports=OrderModel
