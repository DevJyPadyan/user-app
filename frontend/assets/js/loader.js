/*=====================
    loader js
   ==========================*/

import { userDeatilObj } from "./user-details.js";

setTimeout(() => {
  const loader = document.querySelector(".skeleton-loader");
  loader.style.display = "none";
  
  //setting user-name data on the header section near profile menu "Hi, "
  document.getElementById("user-name").innerHTML = userDeatilObj.name;
  document.getElementById("user-name2").innerHTML = userDeatilObj.name;
}, 4000);
