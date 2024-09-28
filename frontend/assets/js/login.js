import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

const passwordField = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

// Add event listener to the eye icon
togglePassword.addEventListener('click', function () {
    // Toggle the input type between 'password' and 'text'
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Toggle the icon between 'eye' and 'eye-off'
    this.classList.toggle('ri-eye-off-line');
    this.classList.toggle('ri-eye-line');
});

login.addEventListener('click', (e) => {
    const dbref = ref(db);
    var email = document.getElementById('useremail').value;
    var passwd = document.getElementById('password').value;

    if (email != '' && passwd != '') {
        signInWithEmailAndPassword(auth, email, passwd)
            .then((userCredential) => {
                // Signed in 
                get(child(dbref, "User details/" + userCredential.user.uid + '/'))
                    .then((snapshot) => {
                        if (snapshot.exists()) {

                            let usname = snapshot.val().userName;
                            let email = snapshot.val().userEmail;
                            let userUid = userCredential.user.uid;
                            let phone = snapshot.val().userPhone;

                            //storing the user details data in an array list
                            const userdetailList = [userUid,usname,email, phone];
                            //converting array to string(for setting in localstorage).
                            let userdetails = JSON.stringify(userdetailList);

                            localStorage.setItem("userDetails", userdetails);
                            if (localStorage.getItem('purposeToLogin') == 'checkout') {
                                window.location.href = "././checkout.html";
                            }
                            else {
                                window.location.href = "././index.html";
                            }

                        }
                    })
                    .catch((error) => {
                        alert(error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Please check Useremail and Password - "+errorCode);
            });
    }
    else {
        alert("Please check Useremail and Password");
    }

});
