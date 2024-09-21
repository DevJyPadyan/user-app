import { storeOrderDetails } from "./checkout.js";



function successHandler(response) {
    // Store these values in your Database
    alert("Payment Success 🎉 " + response.razorpay_payment_id);
    storeOrderDetails(response);
}
var options = {
    "key": "rzp_test_dt8ARo16LbgcBt", // Enter the Key ID generated from the Dashboard
    "amount": document.getElementById("total-payment").value, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "name": "Hostel Project",
    "email": "saurabh.daware@razorpay.com",
    "contact": "9167754927",
    "receipt": "tx-" + new Date().getTime(),
    "handler": successHandler,
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
});
document.getElementById('rzp-button1').onclick = function (e) {
    if (document.getElementById("showAccountInfoDiv").style.display == "block"
        && document.getElementById("showCompleteProofDiv").style.display == "none"
        && document.getElementById("showAddGaurdianDetailsDiv").style.display == "none") {
        rzp1.open();
        e.preventDefault();
        document.getElementById("account-li").classList.remove("active");
        document.getElementById("payment-li").classList.add("active");
        document.getElementById("payment-li").classList.remove("active");
        document.getElementById("confirm-li").classList.add("active");
        document.getElementById("showAccountInfoDiv").style.display = "none";
        // setTimeout(()=>{
        //     window.location.href = "././confirm-order.html"
        // },1000);
    }
    else if (document.getElementById("showAccountInfoDiv").style.display == "block"
        && document.getElementById("showCompleteProofDiv").style.display == "block") {
        alert("Complete Government Proof Submission");
    }
    else if(document.getElementById("showAccountInfoDiv").style.display == "block"
    && document.getElementById("showAddGaurdianDetailsDiv").style.display == "block"){
        alert("Complete Guardian Details Submission");
    }
    else {
        alert("Login to make payment");
    }
}