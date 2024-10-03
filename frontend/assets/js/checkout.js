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

const loadBillDetails = () => {
    settingPurposeToLogin();
    localStorage.setItem("userRegistrationStatus","no");
    document.getElementById("hostel-name").innerHTML = hostelName;
    document.getElementById("hostel-address").innerHTML = hostelAddress;
    document.getElementById("cart-room-price").innerHTML = roomDetails[1];
    // document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + " Room - " + roomDetails[2] + " Bed Number - " + bedId;
    document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + "<br> Room - " + roomDetails[4] + " Bed Number - " + bedId;

    document.getElementById("extra-chapati").innerHTML = extraChapatiCost;
    let chapatiChecked = document.getElementById('extra_chapati_check').checked;
    extraChapatiCost = chapatiChecked ? 1000 : 0;
    document.getElementById("total-payment").innerHTML = Number(roomDetails[1]) + extraChapatiCost;
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
                        localStorage.setItem("userRegistrationStatus","checkout");
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
                        localStorage.setItem("userRegistrationStatus","normal");
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

extra_chapati_check.addEventListener('click', (e) => {
    let chapatiChecked = document.getElementById('extra_chapati_check').checked;
    extraChapatiCost = chapatiChecked ? 1000 : 0;
    document.getElementById("total-payment").innerHTML = Number(roomDetails[1]) + extraChapatiCost;
})

userRegistrationBtn.addEventListener('click', (e) => {
    if(proofSubmission == "no" && guardianDeatils == "no"){
        localStorage.setItem("userRegistrationStatus","checkout");
        window.location.href = "././profile.html";   
    }
    else{
        localStorage.setItem("userRegistrationStatus","normal");
    }
});

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

function storeOrderDetails(paymentResponse) {
    var date = new Date();
    console.log("payment - " + JSON.stringify(paymentResponse) + paymentResponse.razorpay_order_id);
    update(ref(db, "User details/" + userUid + '/Bookings/' + hostelName + '/RoomDetails/'), {
        bedId: bedId,
        roomType: roomDetails[0],
        floor: roomDetails[3],
        ac: roomDetails[5],
        paymentComplete: "yes",
        totalAmount: 5000,
        paymentDate: date,
        paymenttransId: paymentResponse.razorpay_payment_id
        // paymentOrderId:paymentResponse.razorpay_order_id
    })
        .then(() => {
            alert("Click to continue");
            update(ref(db, "Hostel details/" + hostelName + '/rooms/' + "floor" + roomDetails[3] + '/' + "room" + roomDetails[4] + '/'), {
                roomCount: (Number(roomDetails[2]) - 1)
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
}


export { storeOrderDetails };

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