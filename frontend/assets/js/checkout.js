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

const loadBillDetails = () => {
    settingPurposeToLogin();
    document.getElementById("hostel-name").innerHTML = hostelName;
    document.getElementById("hostel-address").innerHTML = hostelAddress;
    document.getElementById("cart-room-price").innerHTML = roomDetails[1];
    // document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + " Room - " + roomDetails[2] + " Bed Number - " + bedId;
    document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + " Bed Number - " + bedId;

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

        //hitting DB, to check whether the user has submitted proof submission.
        const dbref = ref(db);
        get(child(dbref, "User details/" + userDeatilObj.name + '/'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.val().proofSubmission == "no") {
                        document.getElementById("showCompleteProofDiv").style.display = "block";
                        document.getElementById("user-proof").innerHTML = "ID Proof : Not Submitted";
                    }
                    else {
                        document.getElementById("showCompleteProofDiv").style.display = "none";
                        document.getElementById("user-proof").innerHTML = "ID Proof : Submitted";

                    }
                    if (snapshot.val().guardianDetails == "no") {
                        document.getElementById("showAddGaurdianDetailsDiv").style.display = "block";
                        document.getElementById("user-guardian").innerHTML = "Guardian Details : Not Submitted";
                    }
                    else {
                        document.getElementById("showAddGaurdianDetailsDiv").style.display = "none";
                        document.getElementById("user-guardian").innerHTML = "Guardian Details : "+snapshot.val().guardName + ", (M)" + snapshot.val().guardPhone;

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

var files = [];
let imagelink = [];
document.getElementById("files").addEventListener("change", function (e) {
    files = e.target.files;
    for (let i = 0; i < files.length; i++) {
    }
});

document.getElementById("uploadImage").addEventListener("click", async function () {

    var userName = userDeatilObj.name;
    //checks if files are selected
    if (files.length != 0) {
        //Loops through all the selected files
        for (let i = 0; i < files.length; i++) {
            const storageRef = ref2(storage, 'userProof/' + userName + '/govtProof/' + files[i].name);
            const upload = await uploadBytes(storageRef, files[i]);
            const imageUrl = await getDownloadURL(storageRef);
            imagelink.push(imageUrl);
        }
        alert("Uploading image");
        const imageRef = ref(db, 'User details/' + userName + '/proofData/' + '/');
        set(imageRef, imagelink)
            .then(() => {
                alert("Image is uploading..");
                console.log('Image URLs have been successfully stored!');
            })
        update(ref(db, "User details/" + userName + '/'), {
            proofSubmission: "yes"
        })
            .then(() => {
                alert("Govt Proof Submitted successfully");
                window.location.reload();
            })
            .catch((error) => {
                alert(error);
            });
    } else {
        alert("No file chosen");
    }
});

function storeOrderDetails(paymentResponse) {
    var date = new Date();
    console.log("payment - " + JSON.stringify(paymentResponse) + paymentResponse.razorpay_order_id);
    console.log("User details/" + userName + '/Bookings/' + hostelName + '/RoomDetails/');
    update(ref(db, "User details/" + userName + '/Bookings/' + hostelName + '/RoomDetails/'), {
        bedId: bedId,
        roomType: roomDetails[0],
        floor: roomDetails[3],
        ac:roomDetails[4],
        paymentComplete: "yes",
        totalAmount: 5000,
        paymentDate:date,
        paymenttransId: paymentResponse.razorpay_payment_id
        // paymentOrderId:paymentResponse.razorpay_order_id
    })
        .then(() => {
            alert("Room Booked");
            window.location.href = "././confirm-order.html";
        })
        .catch((error) => {
            alert(error);
        });
}


export { storeOrderDetails };

/**Storing Guardian Details Code */
updateGuardianDetailsBtn.addEventListener('click',(e)=>{
    var guardianName = document.getElementById('guardianName').value;
    var guardianPhone = document.getElementById('guardianPhone').value;
    if(guardianName != '' && guardianPhone != ''){
        storeGuardianDetails(guardianName,guardianPhone);
    }
    else{
        alert("Enter Guardian Details..");
    }
});
function storeGuardianDetails(guardianName, guardianPhone) {
    update(ref(db, "User details/" + userName), {
        guardName:guardianName,
        guardPhone:guardianPhone,
        guardianDetails: "yes"
    })
        .then(() => {
            alert("Guardian Details Updated successfully.");
            window.location.reload();
        })
        .catch((error) => {
            alert(error);
        });
}