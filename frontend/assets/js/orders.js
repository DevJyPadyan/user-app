import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";
import { userDeatilObj } from "./user-details.js";


const app = initializeApp(firebaseConfig);
const db = getDatabase();
let userName = userDeatilObj.name;
let userUid = userDeatilObj.userUid;
let ordersList = [];

function loadOderDetails() {
    const dbref = ref(db, "User details/" + userUid + '/Bookings/');
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
            addOrderDetailsCard(h.key, r.val().bedId, r.val().floor, r.val().roomType, r.val().paymenttransId, r.val().totalAmount, r.val().paymentDate, r.val().roomRent);

        });
    });
}
const postContainer = document.getElementById('ul-orders');
function addOrderDetailsCard(hostelName, bedId, floor, roomType, paymentId, totalAmount, paymentDate, roomRent) {
    const elem = document.createElement('li');
    let date = paymentDate.split('T');
    let time = date[1].split('Z');
    elem.innerHTML = ` <div class="order-box">
                                    <div class="order-box-content">
                                        <div class="brand-icon">
                                            <img class="img-fluid icon" src="assets/images/icons/brand2.png"
                                                alt="brand3">
                                        </div>
                                        <div class="order-details">
                                            <div class="d-flex align-items-center justify-content-between w-100">
                                                <h5 class="brand-name dark-text fw-medium">
                                                Hostel - ${hostelName}
                                                <br>
                                                Room Details
                                                <br>
                                                <span class="fw-normal content-color">Floor:
                                                </span> ${floor},
                                                <br> 
                                                <span class="fw-normal content-color">Room Type:
                                                </span> ${roomType}
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
                                         <a href="#order" class="btn theme-outline details-btn"
                                            data-bs-toggle="modal">Details</a> 
                                    </div>
                                </div>`;
    elem.dataset.hostelName = hostelName;
    elem.dataset.floor = floor;
    elem.dataset.paymentId = paymentId;
    elem.dataset.totalAmount = totalAmount;
    elem.dataset.bedId = bedId;
    elem.dataset.paymentDate = date[0];
    elem.dataset.paymentTime = time[0];
    elem.dataset.roomType = roomType;
    elem.dataset.roomRent = roomRent;
    elem.addEventListener('click', loadDetailsInModal);
    postContainer.appendChild(elem);
}
window.addEventListener('load', loadOderDetails());

function loadDetailsInModal(event) {
    const orderDetails = event.currentTarget;
    document.getElementById('modal-hostel-name').innerHTML = orderDetails.dataset.hostelName;
    document.getElementById('modal-hostel-booking-status').innerHTML = "Booked";
    document.getElementById('modal-grandTotal').innerHTML = orderDetails.dataset.totalAmount;
    document.getElementById('modal-transId').innerHTML = orderDetails.dataset.paymentId;
    document.getElementById('modal-transDate').innerHTML = orderDetails.dataset.paymentDate + " & " + orderDetails.dataset.paymentTime;
    document.getElementById('modal-roomDetails').innerHTML = "Floor - " + orderDetails.dataset.floor + " <br> Room Type - " + orderDetails.dataset.roomType;
    const dbref = ref(db, "Hostel details/" + orderDetails.dataset.hostelName);
    onValue(dbref, (snapshot) => {
        document.getElementById('modal-hostelAddress').innerHTML = snapshot.val().hostelAddress1 + " , " + snapshot.val().hostelCity;
    });
    
    clearingExistingValue()//Before adding the data , if i do not empty the existing , again n again the loop run and it gets redudantly added with the existing li's.
    // so i will be removing the existing li's and add the li's again, since im looping from the begining no data will be missed.
    
    const dbref2 = ref(db, "User details/" + userUid + '/Bookings/' + orderDetails.dataset.hostelName + '/RoomDetails/extras');
    onValue(dbref2, (snapshot) => {
        let ulContainer = document.getElementById("modal-ul-bill-list");
        const elem = document.createElement('li');
        elem.innerHTML = ` <li>
                            <div class="order-content-box">
                                <div class="d-flex align-items-center justify-content-between">
                                    <h6>Room Rent</h6>
                                    <h6>${orderDetails.dataset.roomRent}</h6>
                                </div>
                            </div>
                        </li>
                        Extra menu`;
        ulContainer.append(elem);
        snapshot.forEach(extra => {
            const elem = document.createElement('li');
            elem.innerHTML = `<li>
                            <div class="order-content-box">
                                <div class="d-flex align-items-center justify-content-between">
                                    <h6>${extra.val().foodName}</h6>
                                    <h6>${extra.val().foodPrice}</h6>
                                </div>
                            </div>
                        </li>`;
            ulContainer.append(elem);
        })
    });
}
/**
 * New way to clear the existing fields in HTML
 * just by giving raw js as elem.innerHTML="" is same as removing the child elements by manually accessing it by their individual Id's 
 * this is an alternative approach for it
 * 
 * 
 * eg: there is UL inside it we might have 2,3 li's if i want to remove it ill be accessing the each li by an specific id and ill remove those
 * 
 * but NEW alternate approach is UL ill be accessing it with an ID , so under that parent UL , all the Child li's are not required
 * just access that parent UL and give that parent Ul elem.innterHTML=""
 */
function clearingExistingValue(){
    const element = document.getElementById("modal-ul-bill-list");
    element.innerHTML='';
}