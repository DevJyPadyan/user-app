import { userDeatilObj } from "./user-details.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref as ref2, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"



const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage(app);

let hostelName = localStorage.getItem("hostel-name");
let hostelAddress = localStorage.getItem("hostel-address");
let extraChapatiCost = 1000;
let text = localStorage.getItem("room-details");
let roomDetails = text.split("-");
let bedId = localStorage.getItem("bedId");
let userName = userDeatilObj.name;
let userUid = userDeatilObj.userUid;
let guardianDeatils = "no";
let proofSubmission = "no";
let extrasSelectedMenuCost = [];
let extrasSelectedFoodNames = [];
let total = Number(roomDetails[1])

const loadBillDetails = () => {
    settingPurposeToLogin();
    localStorage.setItem("userRegistrationStatus", "no");
    document.getElementById("hostel-name").innerHTML = hostelName;
    document.getElementById("hostel-address").innerHTML = hostelAddress;
    document.getElementById("cart-room-price").innerHTML = roomDetails[1];
    // document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + " Room - " + roomDetails[2] + " Bed Number - " + bedId;
    document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + "<br> Room - " + roomDetails[4] + " Bed Number - " + bedId;
    document.getElementById("total-payment").innerHTML = Number(roomDetails[1]);
};

window.addEventListener('load', loadBillDetails());

sign_in.addEventListener('click', (e) => {
    console.log(userDeatilObj.name)
    if (userDeatilObj.name == undefined) {
        window.location.href = "././signin.html";
    }
});

function settingPurposeToLogin() {
    if (userDeatilObj.name == undefined) {
        localStorage.setItem("purposeToLogin", "checkout");//setting to check whether we need to do login.
        document.getElementById("showLoginDiv").style.display = "block";
        document.getElementById("showAccountInfoDiv").style.display = "none";
    }
    else {
        localStorage.setItem("purposeToLogin", "login");
        document.getElementById("showLoginDiv").style.display = "none";
        document.getElementById("showAccountInfoDiv").style.display = "block";
        document.getElementById("user-name2").innerHTML = "Name: " + userDeatilObj.name;
        document.getElementById("user-email").innerHTML = "Email : " + userDeatilObj.email;
        document.getElementById("user-phone").innerHTML = "Phone : " + userDeatilObj.phoneNumber || "n/a";

        //hitting DB, to check whether the user has submitted proof submission & guardian details.
        const dbref = ref(db);
        get(child(dbref, "User details/" + userDeatilObj.userUid + '/'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    proofSubmission = snapshot.val().proofSubmission;
                    guardianDeatils = snapshot.val().guardianDetails;
                    if (snapshot.val().proofSubmission == "no" || snapshot.val().guardianDetails == "no") {
                        document.getElementById("showRegistrationDiv").style.display = "block";
                        localStorage.setItem("userRegistrationStatus", "checkout");
                        if (snapshot.val().proofSubmission == "no") {
                            document.getElementById("user-proof").innerHTML = "ID Proof : <strong>Not Submitted</strong>";
                        }
                        else {
                            document.getElementById("user-proof").innerHTML = "ID Proof : Submitted";

                        }
                        if (snapshot.val().guardianDetails == "no") {
                            document.getElementById("user-guardian").innerHTML = "Guardian Details : <strong>Not Submitted</strong>";
                        }
                        else {
                            document.getElementById("user-guardian").innerHTML = "Guardian Details : " + snapshot.val().guardName + ", (M)" + snapshot.val().guardPhone;
                        }
                        alert("Kindly, Complete User Registration Process")
                    }
                    else {
                        localStorage.setItem("userRegistrationStatus", "normal");
                        document.getElementById("user-proof").innerHTML = "ID Proof : Submitted";
                        document.getElementById("user-guardian").innerHTML = "Guardian Details : " + snapshot.val().guardName + ", (M)" + snapshot.val().guardPhone;
                        document.getElementById("showRegistrationDiv").style.display = "none";
                    }
                }
            })
            .catch((error) => {
                alert(error)
            });
    }
    console.log(localStorage.getItem('purposeToLogin'));
}

userRegistrationBtn.addEventListener('click', (e) => {
    if (proofSubmission == "no" && guardianDeatils == "no") {
        localStorage.setItem("userRegistrationStatus", "checkout");
        window.location.href = "././profile.html";
    }
    else {
        localStorage.setItem("userRegistrationStatus", "normal");
    }
});


/** Dynamic Checkboxes are loaded based on the Extras food for paritcular hostel - starts here */

function totalExtrasMenu(extrasSelectedMenuCost) {
    total = Number(roomDetails[1]);
    let subTotal = 0;
    for (var i = 0; i < extrasSelectedMenuCost.length; i++) {
        total += Number(extrasSelectedMenuCost[i]);
        subTotal += Number(extrasSelectedMenuCost[i]);
    }
    document.getElementById("total-payment").innerHTML = total;
    document.getElementById("extra-selected-items-total").innerHTML = subTotal;
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

/**
 * Function which loads initially to fetch the hostel extras menu.
 */
async function loadExtrasCheckBoxes() {
    console.log("..inside load checkboxes");
    let foodList;
    const dbref = ref(db, 'Hostel details/' + hostelName + '/extras/');
    try {
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            document.getElementById('noExtrasMsg').style.display = "none";
            let ulContainer = document.getElementById("extrasUl");
            ulContainer.innerHTML='';
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

window.addEventListener('load', loadExtrasCheckBoxes);
/** Dynamic Checkboxes are loaded based on the Extras food for paritcular hostel - ends here */

function storeOrderDetails(paymentResponse) {
    var date = new Date();
    console.log("payment - " + JSON.stringify(paymentResponse) + paymentResponse.razorpay_order_id);
    var extrasMenu = {};
    for (var i = 0; i < extrasSelectedFoodNames.length; i++) {
        extrasMenu[i] = {
            foodName: extrasSelectedFoodNames[i],
            foodPrice: extrasSelectedMenuCost[i]
        };
    }
    update(ref(db, "User details/" + userUid + '/Bookings/' + date + '/RoomDetails/'), {
        bedId: bedId,
        roomType: roomDetails[0],
        floor: roomDetails[3],
        ac: roomDetails[5],
        room: roomDetails[4],
        paymentComplete: "yes",
        totalAmount: total,
        roomRent: roomDetails[1],
        paymentDate: date,
        paymenttransId: paymentResponse.razorpay_payment_id,
        hostelName: hostelName,
        extras: extrasMenu,
        status: 'Booked'
        // paymentOrderId:paymentResponse.razorpay_order_id
    })
        .then(() => {
            alert("Click to continue");
            update(ref(db, 'Hostel details/' + hostelName + '/rooms/' + roomDetails[3] + '/' + roomDetails[0] + '/rooms/' + roomDetails[5] + '/' + roomDetails[4]), {
                bedsAvailable: (Number(roomDetails[2]) - 1)
            })
                .then(() => {
                    alert("Click to place booking");
                    update(ref(db, 'Hostel details/' + hostelName + '/rooms/' + roomDetails[3] + '/' + roomDetails[0] + '/rooms/' + roomDetails[5] + '/' + roomDetails[4] + '/beds/'), {
                        [bedId]: "booked"
                    })
                        .then(() => {
                            update(ref(db, 'Hostel details/' + hostelName + '/rooms/' + roomDetails[3] + '/' + roomDetails[0]), {
                                bedsAvailable: (Number(roomDetails[6]) - 1)
                            })
                                .then(() => {
                                    alert("Room Booked Successfully");
                                    window.location.href = "././confirm-order.html";
                                })
                                .catch((error) => {
                                    alert(error);
                                });
                        })
                        .catch((error) => {
                            alert(error);
                        });
                })
                .catch((error) => {
                    alert(error);
                });
        })
        .catch((error) => {
            alert(error);
        });
}


export { storeOrderDetails };


/** Storing Image proof submission */
// var files = [];
// let imagelink = [];
// document.getElementById("files").addEventListener("change", function (e) {
//     files = e.target.files;
//     for (let i = 0; i < files.length; i++) {
//     }
// });

// document.getElementById("uploadImage").addEventListener("click", async function () {

//     var userName = userDeatilObj.name;
//     var userUid = userDeatilObj.userUid;
//     //checks if files are selected
//     if (files.length != 0) {
//         //Loops through all the selected files
//         for (let i = 0; i < files.length; i++) {
//             const storageRef = ref2(storage, 'userProof/' + userUid + '/govtProof/' + files[i].name);
//             const upload = await uploadBytes(storageRef, files[i]);
//             const imageUrl = await getDownloadURL(storageRef);
//             imagelink.push(imageUrl);
//         }
//         alert("Uploading image");
//         const imageRef = ref(db, 'User details/' + userUid + '/proofData/' + '/');
//         set(imageRef, imagelink)
//             .then(() => {
//                 alert("Image is uploading..");
//                 console.log('Image URLs have been successfully stored!');
//             })
//         update(ref(db, "User details/" + userUid + '/'), {
//             proofSubmission: "yes"
//         })
//             .then(() => {
//                 alert("Govt Proof Submitted successfully");
//                 window.location.reload();
//             })
//             .catch((error) => {
//                 alert(error);
//             });
//     } else {
//         alert("No file chosen");
//     }
// });

/**Storing Guardian Details Code */
// updateGuardianDetailsBtn.addEventListener('click', (e) => {
//     var guardianName = document.getElementById('guardianName').value;
//     var guardianPhone = document.getElementById('guardianPhone').value;
//     if (guardianName != '' && guardianPhone != '') {
//         storeGuardianDetails(guardianName, guardianPhone);
//     }
//     else {
//         alert("Enter Guardian Details..");
//     }
// });
// function storeGuardianDetails(guardianName, guardianPhone) {
//     update(ref(db, "User details/" + userUid), {
//         guardName: guardianName,
//         guardPhone: guardianPhone,
//         guardianDetails: "yes"
//     })
//         .then(() => {
//             alert("Guardian Details Updated successfully.");
//             window.location.reload();
//         })
//         .catch((error) => {
//             alert(error);
//         });
// }
