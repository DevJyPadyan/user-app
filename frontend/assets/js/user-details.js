/**
 * User-details.js
 * Script file used to fetch the user details from localstorage
 * convert it as userDetailsObj and export it
 */
let userDetails = localStorage.getItem("userDetails");
let userDetailsArray = JSON.parse(userDetails);
let userDeatilObj = new Object();
if (userDetails != null) {
    userDeatilObj = {
        userUid: userDetailsArray[0],
        name: userDetailsArray[1],
        email: userDetailsArray[2],
        phoneNumber: userDetailsArray[3]
    }
}

//setting user-name data on the header section near profile menu "Hi, " in navbar.
document.getElementById("user-name").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
if (document.getElementById("user-name2") != null) {
    document.getElementById("user-name2").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
}
//if user is not logged-in , then logout btn name will be shown as Sign In
if (userDeatilObj.name == undefined) {
    document.getElementById("logoutBtn").innerHTML = "Sign In";
}

//setting user-details in profile.html 
if (document.getElementById("profile-user-name") != null) {
    document.getElementById("profile-user-name").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
    document.getElementById("profile-user-name2").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
    document.getElementById("profile-user-email").innerHTML = userDeatilObj.email == undefined ? "E-Mail Address" : userDeatilObj.email;
    document.getElementById("profile-user-email2").innerHTML = userDeatilObj.email == undefined ? "E-Mail Address" : userDeatilObj.email;
    document.getElementById("profile-user-phone").innerHTML = userDeatilObj.phone == undefined ? "-" : userDeatilObj.phone;
}

//setting user-details in my-oder.html 
if (document.getElementById("order-user-email") != null) {
    document.getElementById("order-user-name").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
    document.getElementById("order-user-email").innerHTML = userDeatilObj.email == undefined ? "E-Mail Address" : userDeatilObj.email;
}

//setting user-details in saved-address.html 
if (document.getElementById("saved-address-user-email") != null) {
    document.getElementById("saved-address-user-name").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
    document.getElementById("saved-address-user-email").innerHTML = userDeatilObj.email == undefined ? "E-Mail Address" : userDeatilObj.email;
}

//setting user-details in saved-card.html 
if (document.getElementById("saved-card-user-email") != null) {
    document.getElementById("saved-card-user-name").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
    document.getElementById("saved-card-user-email").innerHTML = userDeatilObj.email == undefined ? "E-Mail Address" : userDeatilObj.email;
}

//setting user-details in setting.html 
if (document.getElementById("setting-user-email") != null) {
    document.getElementById("setting-user-name").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
    document.getElementById("setting-user-email").innerHTML = userDeatilObj.email == undefined ? "E-Mail Address" : userDeatilObj.email;
}

export { userDeatilObj }