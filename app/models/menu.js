//CREATING MENU SCHMEA
const mongoose=require('mongoose')

//new Schema({}) IS A CONTRUCTOR FUNCTION THAT CREATES CLASS Schema()
const menuSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    size:{
        type:String,
        required:true
    }
})

//MODEL CREATION
//MONGOOSE IS AN INSTANCE IT HAS MODEL IN IT WHICH TAKES TOW PAREMETER FIRST COLLECTION NAME WHICH IS IN PLURAL AND SECOND SCHEMA NAME
const MenuModel=mongoose.model("Menu",menuSchema)

//export the modules
module.exports=MenuModel
