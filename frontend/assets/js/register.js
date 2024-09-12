import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

register.addEventListener('click', (e) => {
    var user = document.getElementById("username").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("useremail").value;
    var pwd = document.getElementById("password").value;

    set(ref(db, "User details/" + user), {
        userName: user,
        userPhone: phone,
        password1: pwd,
        userEmail: email,
        proofSubmission: "no"
    })
        .then(() => {
            //const userReg = [user,phone,pwd];
            //converting array to string(for setting in localstorage).
            //let signIn = JSON.stringify(userReg);
            //localStorage.setItem("userDetails", signIn);
            window.location.href = "././signin.html";
        })
        .catch((error) => {
            alert(error);
        });

});
