import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
googleLogin.addEventListener('click', (e) => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const user = result.user;
            // const userDetails = user.displayName+"/"+user.email+"/"+user.phoneNumber+"/"+user.photoURL+"/"+user.acessToken;

            //Storing the user details into an array.
            const user = result.user;
            const userDetailsArray = [user.displayName, user.email, user.phoneNumber, user.photoURL, user.acessToken];
            const dbref = ref(db);
            get(child(dbref, "User details/" + userDetailsArray[0] + '/'))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        //if already exits, we wont insert it to the DB.
                        //jus set proofSubmission tag.
                        userDetailsArray.push(snapshot.val().proofSubmission);
                    } else {
                        set(ref(db, "User details/" + userDetailsArray[0]), {
                            userName: userDetailsArray[0],
                            userPhone: userDetailsArray[2],
                            password1: "used by google login",
                            userEmail: userDetailsArray[1],
                            proofSubmission: "no"
                        })
                            .catch((error) => {
                                alert(error);
                            });
                    }
                    //converting array to string(for setting in localstorage).
                    let userDetails = JSON.stringify(userDetailsArray);
                    localStorage.setItem("userDetails", userDetails);
                    if (localStorage.getItem('purposeToLogin') == "checkout") {
                        window.location.href = "././checkout.html";
                    }
                    else {
                        window.location.href = "././index.html";
                    }
                })
                .catch((error) => {
                    alert(error)
                });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});




