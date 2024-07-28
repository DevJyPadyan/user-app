/**
 * User-details.js
 * Script file used to fetch the user details from localstorage
 * convert it as userDetailsObj and export it
 */
let userDetails = localStorage.getItem("userDetails");
let userDetailsArray = JSON.parse(userDetails);
let userDeatilObj = new Object();
if(userDetails != null){
    userDeatilObj = {
        name: userDetailsArray[0],
        email: userDetailsArray[1],
        phoneNumber: userDetailsArray[2],
        photoURL: userDetailsArray[3],
        accessToken: userDetailsArray[4]
    }
}

//setting user-name data on the header section near profile menu "Hi, "
document.getElementById("user-name").innerHTML = userDeatilObj.name;
document.getElementById("user-name2").innerHTML = userDeatilObj.name;

export { userDeatilObj }