import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

login.addEventListener('click', (e) => {
    const dbref = ref(db);
    var user = document.getElementById('username').value;
    var passwd = document.getElementById('password').value;

    get(child(dbref, "User details/" + user + '/'))
        .then((snapshot) => {
            if (snapshot.exists()) {

                let usname = snapshot.val().Username;
                let password = snapshot.val().Password;
                let phone = snapshot.val().Phone;
                let usercomp = usname.localeCompare(user);
                let passcomp = password.localeCompare(passwd);
                
                //storing the user details data in an array list
                const userdetailList = [usname, password, phone];
                 //converting array to string(for setting in localstorage).
                let userdetails = JSON.stringify(userdetailList);
                localStorage.setItem("userDetails", userdetails);
                //comparing the firebase data and user input
                if (usercomp == 0 && passcomp == 0) {
                    window.location.href = "././index.html";
                }

            } else {
                alert("Incorrect username and password");
            }
        })
        .catch((error) => {
            alert(error)
        });

});

