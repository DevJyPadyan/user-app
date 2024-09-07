import {userDeatilObj} from "./user-details.js";


let hostelName = localStorage.getItem("hostel-name");
let hostelAddress = localStorage.getItem("hostel-address");
let extraChapati = 1000;

const loadBillDetails = () => {
    settingPurposeToLogin();
    document.getElementById("hostel-name").innerHTML = hostelName ;
    document.getElementById("hostel-address").innerHTML = hostelAddress;
    let text = localStorage.getItem("room-details");
    let bedId = localStorage.getItem("bedId");
    let roomDetails = text.split("-");
    document.getElementById("cart-room-price").innerHTML = roomDetails[1];
    document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + " Room - " + roomDetails[2] + " Bed Number - " + bedId;
    document.getElementById("extra-chapati").innerHTML = extraChapati;
    document.getElementById("total-payment").innerHTML = Number(roomDetails[1])+extraChapati;
};

window.addEventListener('load', loadBillDetails()); 

sign_in.addEventListener('click',(e)=>{
    console.log(userDeatilObj.name)
    if(userDeatilObj.name == undefined){
        window.location.href = "././signin.html";
    }
});

function settingPurposeToLogin(){
    if(userDeatilObj.name == undefined){
        localStorage.setItem("purposeToLogin","checkout");//setting to check whether we need to do login.
        document.getElementById("showLoginDiv").style.display = "block";
        document.getElementById("showAccountInfoDiv").style.display = "none";
    }
    else{
        localStorage.setItem("purposeToLogin","login");
        document.getElementById("showLoginDiv").style.display = "none";
        document.getElementById("showAccountInfoDiv").style.display = "block";
        document.getElementById("user-name").innerHTML = userDeatilObj.name;
        document.getElementById("user-email").innerHTML = "Email : "+userDeatilObj.email;
        document.getElementById("user-phone").innerHTML = "Phone : "+userDeatilObj.phoneNumber;

    }
}