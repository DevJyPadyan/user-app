/*=====================
    loader js
   ==========================*/

import { userDeatilObj } from "./user-details.js";

setTimeout(() => {
  const loader = document.querySelector(".skeleton-loader");
  loader.style.display = "none";

  //setting user-name data on the header section near profile menu "Hi, "
  document.getElementById("user-name").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
  if (document.getElementById("user-name2") != null) {
    document.getElementById("user-name2").innerHTML = userDeatilObj.name == undefined ? "User" : userDeatilObj.name;
  }
  //if user is not logged-in , then logout btn name will be shown as Sign In
  if (userDeatilObj.name == undefined) {
    document.getElementById("logoutBtn").innerHTML = "Sign In";
  }
}, 2500);
