//CREATING MENU SCHMEA
const mongoose=require('mongoose')

//new Schema({}) IS A CONTRUCTOR FUNCTION THAT CREATES CLASS Schema()
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    // ROLE TO DETERMINE WHETHER USER IS CUSTOMER OR ADMIN
    //ONLY CUSOTMER CAN REGISTER AND ADMIN CANT REGISTER(MANUALLY CREATED)
    role:{
        type:String,
        default:'customer'
    }
},{timestamps:true})

//MODEL CREATION
//MONGOOSE IS AN INSTANCE IT HAS MODEL IN IT WHICH TAKES TOW PAREMETER FIRST COLLECTION NAME WHICH IS IN PLURAL AND SECOND SCHEMA NAME
const UserModel=mongoose.model("User",userSchema)

//export the modules
module.exports=UserModel
