console.log("HELLO FROM APP.JS")
import axios from "axios"
import Noty from "noty";
//IMPORT ADMIN.JS HERE
//import{name what u had exported from admin.js} from "path where the admin.js is located "
import initAdmin from './admin'
import moment from "moment";

// QUERYSELECTOR ALL RETURNS ARRAY OF BUTTONS THAT HAS CLASS .add-to-cart
let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter=document.querySelector('#cartCounter')

//DEFINE FUNCTION
function updateCart(pizza){
    //AXIOS TO CALL APIS AND THEN PERFORM GET POST DELETE METHODS ON IT
    //IN THIS .post("api_route_name",json_data_that_we_want_to_Sent_to_the_def_route) 
     axios.post('/update-cart',pizza).then(function(res){
                console.log("DATA COMING FROM cartController->",res.data.totalQty)
                cartCounter.innerText=res.data.totalQty
                //PROMPT OF ITME S ADDED TO CART
                new Noty({
                    type:'success',
                    timeout:1000,
                    text:"ITEM ADDED TO CART",
                    progressBar:false,
                    // layout:'bootomleft'
                }).show()
        }
     )
     .catch(function(err){
        new Noty({
            type:'error',
            timeout:1000,
            text:"Something went wrong..",
            progressBar:false,
            // layout:'bootomleft'
        }).show()
        console.log("Error in Axios request:", err);
    });
}


addToCart.forEach(function(btn){
    console.log("BC")
    console.log(btn);
    btn.addEventListener('click', function(e){
        console.log(e);
        //TO ACCESS THE DATA OF THE PIZZA NAME ID PRICE SIZE THAT ARE COMING FROM home.ejs
        //BASICALLY THE DATA COMING FROM HOME.EJS IS IN STRING FORMAT TO CONVERT IT INTO OBJECT WE NEED TO PARSE IT
        //OBJECT IN STRING FORMAT
        //let pizza=btn.dataset.pizza
        //CONVERTING OBJECT IN STRING FORMAT THEN AGAIN TO OBJECT
        let pizza=JSON.parse(btn.dataset.pizza)
        console.log(pizza)
        //CALLING UPDATE CART FUNCTION
        updateCart(pizza)
    });
});

//ORDER NOW LOGIC
//BASICALLY WILL SHOW THE SUCCESS "ORDERED PALCED SUCCESSFULLY" MSG ONLY FOR 2 SECONDS
const alertMsg=document.querySelector("#success-alert")
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}



//SINGLE ORDER PAGE
//GET ALL THE LI TAGS FROM SINGLEORDER.EJS HERE STATUSES WILL BE ARRAY OF LI TAGS
let statuses=document.querySelectorAll('.status_line')
console.log("ALL STATAUS LINE",statuses)

//IF WE HAVE ORDER STATUS IN INPUT TAG THEN GET THE VALUE FROM IT ELSE IF NOT THEN GIVE NULLL
//TERNIARY OPERATOR
let hiddenInput=document.querySelector("#hiddenInput")
let order=hiddenInput?hiddenInput.value:null
console.log("ACCESING INPUT TAG TO GET DATA  FROM SINGLEORDER.EJS ",order)

//CONVERT ORDER STRING INTO ORDER OBJECT
order=JSON.parse(order)
console.log("CONVERT ORDER STRING INTO ORDER OBJECT->",order)

//ORDER STATUS TIME
let time=document.createElement('small')
time.classList.add("small")


//ADD DIFERENT CLASSES TO <ul><li></li></ul> BASED ON STATUS THAT WE ARE GETTING FROM ORDER.JS 
//data-status="value"  WE CAN GET THE VALUE WITH THE HELP OF DATASET.STATUS
function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted=true
    statuses.forEach(function(status)
    { 
        console.log(`CURRENT LI TAG->`,status)
        //BASICALLY status WILL CONTAIN EACH <li><li> TAG THEN EACH li HAVE data-status="value" WE CAN GET IT WITH THE HELP OF stat.dataset.status
        //dataprop will contain orderplaced or orderconfirmation or preparation or outfordelievery or complete
        let dataProp=status.dataset.status
        //FIRST <li></li> WILL ALWAYS BE ADDED WITH CLASS step-completed BECAUSE IT IS ORDER PALCED
        if(stepCompleted)
        {
            //HINT IF WE WANT TO APPEND THE NEW CLASS NAME BY KEEPING OLD NAME ALSO
            //CHANGE THE COLOR OF LINE DOTS AND TEXT
            status.classList.add('step-completed')
        }
        //THEN COME TO NEXT LINK
        //IF THAT  li data-status IS EQL TO DATABASE ORDER STATUS THEN THAT li WILL GET ADDED WITH CALSSLIST classList.add('step-completed') MEANS THAT WILL GET GRAY AND NEXT SIBLING WILL GET ORANGE
        if(dataProp==order.status)
        {
            stepCompleted=false
            // DISPLAY THE TIME OF STATUS UPDATED
            time.innerText=moment(order.updatedAt).format("hh:mm A")
            //time THAT IS SMALL TAG WILL BE ADDED AFTER SPAN TAG <span></span><small></small>
            status.appendChild(time)
            //CHECK FIRST NEXT ELEMENT IS PRESENT OR NOT IF PRESENT THEN ONLY ADD CLAASS LIST OF CURRENT OTHERWISE NOT
            if(status.nextElementSibling)
            {
                //CURRENT BASICALLY REFERS TO ORANGE COLOR INDICATING THE CURRENT STATUS
                status.nextElementSibling.classList.add('current')
            }
            
        }

    
    })

    
}

updateStatus(order)

//SOCKET
let socket=io('http://localhost:3000'); // Replace with your server URL
//THIS WILL CALLED initAdmin FUNCTION WHICH HAS BENN EXPORTED BY ADMIN.JS MODEL
initAdmin(socket)
//WHENVER U VISIT customer/order/order_id ROUTE IT WILL EMIT EVENT join AND SENT ORDERID TO SERVER 
//JOIN
//SEE AS APP.JS IS COOMON FOR ALL ROUTES AS IT IS PRESNT IN LAYOUT.EJS FILE
//SECONDLY IF U VISIT ANY ROUTE U WILL ABLE TO SEE IN CONSOLE THAT NEW CLIENT CONNECTED AS APP.JS GETS EXECUTE AT EVERY ROUTE
//BUT WHEN U VISIT customer/order/order_id ROUTE THEN AT THAT TIME U RENDER customer/singleorder.EJS FILE 
//THIS customer/singleorder.EJS FILE SENTS ORDER STATUS AND APP.JS  STORES IT IN order
//THEN BELOW CODE GETS EXECUTED AS WE HAVE order BECAUSE OF IT SOCKET WILL EMIT join EVENT AS WELL AS MESSAGE 
//WHICH HAS BEEN RECEIVED ON SERVER SIDE
if(order){
    socket.emit('join',`order_${order._id}`)
}

//GET THE PATH WHERE ADMIN HAS BEEN OPOENED
//ADMIN JOINING TO PRIVATE ROOM
let adminAreaPath=window.location.pathname
console.log("ADMIN PATH->",adminAreaPath)
//TO IDENTIFY WHETEHR IT IS AN ADMIN PATH MAKE USE OF INCLUDE adminAreaPath.include(name)
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom')
}

//
socket.on('orderUpdated',(data)=>{
    //MAKE USE OF SRPREAD OPERATOR TO GET ORDERMODEL
    const updatedOrder={...order}
    updatedOrder.updatedAt=moment().format
    updatedOrder.status=data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
    console.log("data fromserver->",data)
})