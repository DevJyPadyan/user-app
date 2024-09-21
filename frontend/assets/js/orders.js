import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";
import { userDeatilObj } from "./user-details.js";


const app = initializeApp(firebaseConfig);
const db = getDatabase();
let userName = userDeatilObj.name;
let ordersList = [];

function loadOderDetails() {
    const dbref = ref(db, "User details/" + userName + '/Bookings/');
    onValue(dbref, (snapshot) => {
        ordersList = [];
        snapshot.forEach(h => {
            ordersList.push(h);
        })
        if (ordersList.length == 0) {
            document.getElementById("no-orders-msg").style.display = "block";
        }
        else {
            document.getElementById("no-orders-msg").style.display = "none";
            iterateOrderDetails();

        }

    })
}
function iterateOrderDetails() {

    ordersList.forEach(h => {
        console.log(h.key)
        h.forEach(r => {
            addOrderDetailsCard(h.key,r.val().bedId, r.val().floor, r.val().paymenttransId, r.val().totalAmount,r.val().paymentDate);

        });
    });
}
const postContainer = document.getElementById('ul-orders');
function addOrderDetailsCard(hostelName,bedId, floor, paymentId, totalAmount, paymentDate) {
    const elem = document.createElement('li');
    let date = paymentDate.split('T');
    elem.innerHTML = ` <div class="order-box">
                                    <div class="order-box-content">
                                        <div class="brand-icon">
                                            <img class="img-fluid icon" src="assets/images/icons/brand2.png"
                                                alt="brand3">
                                        </div>
                                        <div class="order-details">
                                            <div class="d-flex align-items-center justify-content-between w-100">
                                                <h5 class="brand-name dark-text fw-medium">
                                                ${hostelName}
                                                </h5>
                                                <h6 class="fw-medium content-color text-end">
                                                Payment Made on: ${date[0]}
                                                </h6>
                                            </div>
                                            <h6 class="fw-medium dark-text">
                                                <span class="fw-normal content-color">Transaction Id :
                                                </span>
                                                ${paymentId}
                                            </h6>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-between mt-sm-3 mt-2">
                                        <h6 class="fw-medium dark-text">
                                            <span class="fw-normal content-color">Total Amount :</span>
                                            ${totalAmount}
                                        </h6>
                                        <!-- <a href="#order" class="btn theme-outline details-btn"
                                            data-bs-toggle="modal">Details</a> -->
                                    </div>
                                </div>`;
    postContainer.appendChild(elem);
}
window.addEventListener('load', loadOderDetails());