import  axios  from "axios"
import moment from "moment"
import Noty from "noty"


export function initAdmin(socket)
{
    const orderTableBody=document.querySelector("#orderTableBody")
    let orders=[]
    let markup

    // NOW SEND REQUEST FOR THE ROUTE
    //BASICALLY IT SENDS REQUEST TO ROUTE /admin/orders AND GET RESPONSE IN JSON FORMAT
    //res.data COTIANS ALL THE DATA SENT AS THE REPSONSE
    //WE HAD MADE USE OF "X-Requested-With":"XMLHttpRequest" SO THAT SERVER ABLE TO KNOW THAT REQUEST IS MADE BY AJAX AND NOT A REGUALR PAGE REQUEST 
    axios.get('/admin/orders', {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then((res) => {
        orders = res.data;
        console.log("DATA THAT HAS BEEN RECEIVING FROM ADMIN.ORDER.JS", res.data);
        markup = generateMarkup(orders);
        orderTableBody.innerHTML = markup; // Use innerHTML instead of innerText to properly render HTML
    })
    .catch((err) => {
        console.log(err);
    });
    
    
    // BASICALLY THIS FUNCTION IS DEFINED FOR GETIING ALL THE ITEMS VALUE 
    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
      }

    function generateMarkup(orders) {
        // RETURN ARRAY OF TR AND ALL THE ELEMENTS FROM THE ARRAY ARE JOIN TO GET ALL THE ELEMENTS IN A PARTICUALR STRING
        //renderItems(order.items) BAISCIALY CALLED UPPER FUNCTION AND RETURN A STRING BY JOINING ALL TEH VALUES IN AN ARRAY
        //<form action="/admin/order/status" method="POST"> BASICALLY IT WILL POST THE FORM AND MOVE TO THIS ROUTE /admin/order/status AND THEN CHANGE THE STATUS OF ORDER
        //IF ADMIN IS THE ONE WHICH WILL DETERMINE STATUS IS PALCED CONFIRMED PREPARED DELEIVERD COMPLETED
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900"> 
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name }</td>
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.updatedAt).format('hh:mm A') } <!-- Added updatedAt -->
                </td>
                <td class="border px-4 py-2">
                    ${ order.paymentStatus ? 'paid' : 'Not paid' }
                </td>
            </tr>
        `
        }).join('')
    }
    
    //GET THE MESSAGE THAT IS EMITTED FROM SERVER.JS
  
    socket.on('orderPlaced', (order) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'New order!',
            progressBar: false,
        }).show();
        orders.unshift(order)
        // orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    })
}


// export default initAdmin;