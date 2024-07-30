console.log("HELLO FROM APP.JS")
import axios from "axios"
import Noty from "noty";

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
    console.log(btn);
    btn.addEventListener('click', function(e){
        console.log(e);
        //TO ACCESS THE DATA OF THE PIZZA NAME ID PRICE SIZE THAT ARE COMING FROM home.ejs
        //BASICALLY THE DATA COMING FROM HOME.EJS IS IN STRING FORMAT TO CONVERT IT INTO OBJECT WE NEED TO PARSE IT
        //OBJECT IN STRING FORMAT
        //let pizza=btn.dataset.pizza
        //CONVERTING OBJECT IN STRING FORMAT AGAIN TO OBJECT
        let pizza=JSON.parse(btn.dataset.pizza)
        console.log(pizza)
        //CALLING UPDATE CART FUNCTION
        updateCart(pizza)
    });
});




