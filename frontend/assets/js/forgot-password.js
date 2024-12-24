import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

forgotPasswordBtn.addEventListener('click', (e) => {
    var email = document.getElementById("useremail").value;

    if (email != '') {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Email Sent, Check mail and reset password");
                window.location.href = "././signin.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                if(errorCode == "auth/invalid-email"){
                    alert("Please enter an Valid Email")
                }
            });
    }
    else {
        alert("Enter Email to send password RESET link")
    }

});
