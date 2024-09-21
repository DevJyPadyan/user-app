import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

login.addEventListener('click', (e) => {
    const dbref = ref(db);
    var user = document.getElementById('username').value;
    var passwd = document.getElementById('password').value;

    if(user != '' && passwd != ''){
        get(child(dbref, "User details/" + user + '/'))
        .then((snapshot) => {
            if (snapshot.exists()) {

                let usname = snapshot.val().userName;
                let password = snapshot.val().password1;
                let phone = snapshot.val().userPhone;
                let proofSubmission = snapshot.val().proofSubmission;
                let usercomp = usname.localeCompare(user);
                let passcomp = password.localeCompare(passwd);

                //storing the user details data in an array list
                const userdetailList = [usname, password, phone, proofSubmission];
                //converting array to string(for setting in localstorage).
                let userdetails = JSON.stringify(userdetailList);
                localStorage.setItem("userDetails", userdetails);
                //comparing the firebase data and user input
                if (usercomp == 0 && passcomp == 0) {
                   if(localStorage.getItem('purposeToLogin') == 'checkout'){
                    window.location.href = "././checkout.html";
                   }
                   else{
                    window.location.href = "././index.html";
                   }
                }

            } else {
                alert("Incorrect Username or Password");
            }
        })
        .catch((error) => {
            alert(error)
        });
    }
    else{
        alert("Please check Username and Password")
    }

});
