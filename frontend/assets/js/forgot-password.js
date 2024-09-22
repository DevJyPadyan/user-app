import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

forgotPasswordBtn.addEventListener('click', (e) => {
    const dbref = ref(db);
    var user = document.getElementById("username").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("useremail").value;

    if (user != '' && phone != '' && email != '') {
        get(child(dbref, "User details/" + user + '/'))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    let usname = snapshot.val().userName;
                    let usemail = snapshot.val().userEmail;
                    let usphone = snapshot.val().userPhone;
                    let usercomp = usname.localeCompare(user);
                    let emailcomp = usemail.localeCompare(email);
                    let phonecomp = usphone.localeCompare(phone);

                    //comparing the firebase data and user input
                    if (usercomp == 0 && phonecomp == 0 && emailcomp == 0) {
                        alert("Password - " + snapshot.val().password1);
                    }
                    else{
                        alert("Incorrect User Details, Please Check");
                    }

                } else {
                    alert("Incorrect User Details, Please Check");
                }
            })
            .catch((error) => {
                alert(error);
            });
    }
    else {
        alert("Enter required details to get Password")
    }

});
