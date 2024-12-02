import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";
import { userDeatilObj } from "./user-details.js";


const app = initializeApp(firebaseConfig);
const db = getDatabase();
let userUid = userDeatilObj.userUid;
let hostelName;
let bookingkey = localStorage.getItem('edit-order-details');
let extrasMenuList = [];
let userSelectedExtrasMenu = [];
let roomString = "";
let hostelString = "";
let total = 0;

async function loadOrderDetails() {

    if (hostelName != 'empty') {

        //fetching user details room booking details.
        const dbref = await ref(db, "User details/" + userUid + '/Bookings/' + bookingkey + '/RoomDetails');
        try {
            const h = await get(dbref);
            roomString = "Floor - " + h.val().floor + "<br> Room - " + h.val().room + ", " + h.val().bedId + "<br> Rent - " + h.val().roomRent + " (" + h.val().ac + " room)";
            hostelName = h.val().hostelName;
        } catch (error) {
            console.error('Error fetching floor:', error);
        }

        //fetching user details extras menu details.
        const dbref4 = await ref(db, "User details/" + userUid + '/Bookings/' + bookingkey + '/RoomDetails/extras');
        try {
            const snapshot = await get(dbref4);
            snapshot.forEach(h => {
                userSelectedExtrasMenu.push(h.val())
            })
        } catch (error) {
            console.error('Error fetching floor:', error);
        }
        iterateExtras();

        //fetching hostel details.
        const dbref2 = ref(db, "Hostel details/" + hostelName);
        try {
            const h = await get(dbref2);
            hostelString = h.val().hostelName + "<br>" + h.val().hostelAddress1 + " " + h.val().hostelCity + " " + h.val().hostelPin + "<br> Ph - " + h.val().hostelPhone
        } catch (error) {
            console.error('Error fetching floor:', error);
        }

        //updating the hostel and room details in the section
        document.getElementById('hostelDetails').innerHTML = hostelString;
        document.getElementById('roomDetails').innerHTML = roomString;

        //fetching hostel extras menu details for the booked hostel.
        extrasMenuList = [];
        const dbref3 = ref(db, "Hostel details/" + hostelName + "/extras");
        try {
            const snapshot = await get(dbref3);
            snapshot.forEach(h => {
                extrasMenuList.push(h.val())
            })
        } catch (error) {
            console.error('Error fetching floor:', error);
        }
        // iterateExtras();

    }
}
/**
 * Iterating through the extras menu selected by user and disaplying it in the edit box
 */
function iterateExtras() {
    const postContainer = document.getElementById('extraMenuDetails');
    total = 0;
    userSelectedExtrasMenu.forEach(h => {
        const div = document.createElement("div");
        div.innerHTML = `<div style="display: flex; flex-direction: row;gap: 30px; justify-content:space-between;">
                                            <h6>${h.foodName} </h6>
                                            <h6>Rs. ${h.foodPrice}</h6>
                                        </div>`
        postContainer.appendChild(div);
        total += Number(h.foodPrice);
    })
    loadExtrasTotal(total, postContainer)//calculating the total of the extras menu selected by user
}

/**
 * 
 * @param {*} total 
 * @param {*} postContainer//passing the parent div to append the totalAmount child into that div.
 * //calculating the total of the extras menu selected by user
 */
function loadExtrasTotal(total, postContainer) {
    const div = document.createElement("div");
    div.innerHTML = `<hr>
        <div style="display: flex; flex-direction: row;gap: 30px; justify-content:space-between;">
                                            <h6 style="font-weight:bolder;">Extras menu total </h6>
                                            <h6 id="extras-total" style="font-weight:bolder;">Rs. ${total}</h6>
                                        </div>`
    postContainer.appendChild(div);
    loadExtrasCheckBoxes();
}

window.addEventListener('load', loadOrderDetails());


/**
 * Function which loads initially to fetch the hostel extras menu. when user click edit button
 * the modal opens and the check box of the existing menus are shown and user can click and add/edit menu
 */
async function loadExtrasCheckBoxes() {
    let foodList;
    const dbref = ref(db, 'Hostel details/' + hostelName + '/extras/');
    try {
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            document.getElementById('noExtrasMsg').style.display = "none";
            let ulContainer = document.getElementById("extrasUl");
            foodList = snapshot.val();
            foodList.forEach(element => {
                //checks the availability of the extras menu
                if (element.available == "yes") {
                    //creating li element
                    let libox = document.createElement('li');
                    libox.style.display = "flex";
                    libox.style.gap = "4px";

                    // creating checkbox element
                    let checkbox = document.createElement('input');

                    // Assigning the attributes and click event for the created checkbox
                    checkbox.type = "checkbox";
                    checkbox.name = "extrasCheckBox";
                    checkbox.value = element.foodPrice;
                    checkbox.id = element.foodName;
                    //iterating to check whether user as selected any food before, the checkbox inside the edit modal will appear checked.
                    userSelectedExtrasMenu.forEach(h => {
                        if (element.foodName == h.foodName) {
                            checkbox.checked = true;
                        }
                    })
                    checkbox.addEventListener('click', getCheckedBoxes);

                    // creating label for checkbox
                    let label = document.createElement('label');

                    // assigning attributes for the created label tag 
                    label.htmlFor = checkbox.id;

                    // appending the created text to 
                    // the created label tag 
                    label.appendChild(document.createTextNode(element.foodName + " - Rs." + element.foodPrice));

                    libox.appendChild(checkbox);
                    libox.appendChild(label);
                    ulContainer.appendChild(libox);
                }
            });
        } else {
            document.getElementById('noExtrasMsg').style.display = "block";
        }
    } catch (error) {
        console.error('Error fetching floor:', error);
    }
}

let extrasSelectedMenuCost = [];
let extrasSelectedFoodNames = [];


function totalExtrasMenu(extrasSelectedMenuCost) {
    total = 0;
    for (var i = 0; i < extrasSelectedMenuCost.length; i++) {
        total += Number(extrasSelectedMenuCost[i]);
    }
    document.getElementById("extras-total").innerHTML = total;
    // document.getElementById("extra-selected-items-total").innerHTML = subTotal;
}
/**
 * When extra food menu is checked, this function will trigger to check.
 * which checked boxes are checked and will push it to the array.
 * @returns 
 */
function getCheckedBoxes() {
    extrasSelectedMenuCost = [];
    extrasSelectedFoodNames = [];
    var checkboxes = document.getElementsByName("extrasCheckBox");
    var checkboxesChecked = [];
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i]);
            extrasSelectedMenuCost.push(checkboxes[i].value);
            extrasSelectedFoodNames.push(checkboxes[i].id);
        }
    }
    totalExtrasMenu(extrasSelectedMenuCost);//calls the filter method , for the selected checkboxes in floor filters.
}

// function clearingExistingValue() {
//     const element = document.getElementById("modal-ul-bill-list");
//     element.innerHTML = '';
// }

updateExtrasBtn.addEventListener('click', () => {
    var extrasMenu = {};
    for (var i = 0; i < extrasSelectedFoodNames.length; i++) {
        extrasMenu[i] = {
            foodName: extrasSelectedFoodNames[i],
            foodPrice: extrasSelectedMenuCost[i]
        };
    }
    update(ref(db, "User details/" + userUid + '/Bookings/' + hostelName + '/RoomDetails/'), {
        extras: extrasMenu
    })
        .then(() => {
            alert("Extras Menu is updated.");
            location.reload();
        })
})

updateRoomBtn.addEventListener('click',()=>{
    window.location.href = "././menu-listing-2.html";
});