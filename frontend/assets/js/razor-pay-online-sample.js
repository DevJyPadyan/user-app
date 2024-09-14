const RAZORPAY_API_KEY_ID = "rzp_test_dt8ARo16LbgcBt";
const BACKEND_HOSTNAME = "";

// You may want to accept these values from user or pass through the order
const userInputValues = {
    amount: 1, // 1 rs
    name: "Saurabh Daware",
    email: "saurabh.daware@razorpay.com",
    contact: "9167754927",
    receipt: "tx-" + new Date().getTime(), // you can change this to any id you want.
};

// Callbacks
function successHandler(response) {
    console.log(JSON.stringify(response));
    // Store these values in your Database
    alert("Payment Success 🎉 " + response.razorpay_payment_id);
    console.log(response.razorpay_payment_id);
    console.log(response.razorpay_order_id);
    console.log(response.razorpay_signature);
}

function failureHandler(response) {
    // throw error to user.
    console.log(response.error.code);
    console.log(response.error.description);
    console.log(response.error.source);
    console.log(response.error.step);
    console.log(response.error.reason);
    console.log(response.error.metadata.order_id);
    console.log(response.error.metadata.payment_id);
}

// Create Payment Orders
async function createOrder(orderOptions) {
    // Creates initial order and returns orderid
    const response = await (
        await fetch(BACKEND_HOSTNAME + "/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderOptions }),
        })
    ).json();
    return response;
}

// Payment Options
const options = {
    key: RAZORPAY_API_KEY_ID, // Enter the Key ID generated from the Dashboard
    amount: userInputValues.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Saurabh Corp",
    description: "Test Transaction",
    image: "https://saurabhdaware.in/assets/images/logo-192.png",
    order_id: "order_GRs4HQJL6FCK65", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: successHandler,
    prefill: {
        name: userInputValues.name,
        email: userInputValues.email,
        contact: userInputValues.contact,
    },
    notes: {
        address: "Razorpay Corporate Office",
    },
    theme: {
        color: "#0099ff",
    },
};

// Pay Button Handler
async function payButtonHandler(e) {
    // If you have separate order and checkout page, you can move createOrder code to initial order creation page.
    const orderResp = await createOrder({
        amount: options.amount,
        receipt: userInputValues.receipt,
    });

    options.order_id = orderResp.id;

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", failureHandler);

    // Opens Razorpay widget for payment
    rzp.open();
    e.preventDefault();
}

document
    .getElementById("rzp-pay-button")
    .addEventListener("click", payButtonHandler);
