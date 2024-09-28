import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

const passwordInput = document.getElementById('password');
const togglePasswordIcon = document.getElementById('togglePassword');

togglePasswordIcon.addEventListener('click', function () {
    // Toggle between password and text input types
    const currentType = passwordInput.getAttribute('type');
    passwordInput.setAttribute('type', currentType === 'password' ? 'text' : 'password');

    // Toggle between the eye and eye-off icons
    this.classList.toggle('ri-eye-off-line');
    this.classList.toggle('ri-eye-line');
});

register.addEventListener('click', (e) => {
    var user = document.getElementById("username").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("useremail").value;
    var pwd = document.getElementById("password").value;
    console.log("phone" + phone.length)
    // var gaurdianName  = document.getElementById("gaurdianName").value;
    // var gaurdianPhone = document.getElementById("gaurdianPhone").value;

    if (user != '' && pwd != '' && email != '' && (phone != '' && phone.length === 10)) {
        document.getElementById("mandatory-user").style.visibility = "hidden";
        document.getElementById("mandatory-pwd").style.visibility = "hidden";
        document.getElementById("mandatory-email").style.visibility = "hidden";
        document.getElementById("mandatory-phone").style.visibility = "hidden";
        createUserWithEmailAndPassword(auth, email, pwd)
            .then((userCredential) => {
                // Signed up
                let url = userCredential.user.uid;
                set(ref(db, "User details/" + url), {
                    userName: user,
                    userPhone: phone,
                    password1: pwd,
                    userEmail: email,
                    proofSubmission: "no",
                    guardianDetails: "no",
                    userUid: userCredential.user.uid
                    // gaurdianName: gaurdianName,
                    // gaurdianPhone: gaurdianPhone
                })
                    .then(() => {
                        //const userReg = [user,phone,pwd];
                        //converting array to string(for setting in localstorage).
                        //let signIn = JSON.stringify(userReg);
                        //localStorage.setItem("userDetails", signIn);
                        alert("User Registered.");
                        window.location.href = "././signin.html";
                    })
                    .catch((error) => {
                        alert(error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                if (errorCode == "auth/email-already-in-use") {
                    alert("Email - Already exists, try with another email")
                }
                if (errorCode == "auth/invalid-email") {
                    alert("Please enter an Valid Email")
                }
                if (errorCode == "auth/weak-password") {
                    alert("Password should be at least 6 characters");
                }
                // alert("Please Enter Valid Email");
            });
    }
    else {
        if (user != '') {
            document.getElementById("mandatory-user").style.visibility = "hidden";
        }
        if (pwd != '') {
            document.getElementById("mandatory-pwd").style.visibility = "hidden";
        }
        if (email != '') {
            document.getElementById("mandatory-email").style.visibility = "hidden";
        }
        if (phone != '' && phone.length == 10) {
            document.getElementById("mandatory-phone").style.visibility = "hidden";
        }
        if (phone.length < 10 || phone.length > 10) {
            alert("Please check Phone number");
        }
        alert("Please, Enter All Mandatory Details with *");
    }

});
