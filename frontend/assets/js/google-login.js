import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
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
            //converting array to string(for setting in localstorage).
            let userDetails = JSON.stringify(userDetailsArray);
            localStorage.setItem("userDetails", userDetails);
            if(localStorage.getItem('purposeToLogin') == "checkout"){
                window.location.href = "././checkout.html";
            }
            else{
                window.location.href = "././index.html";
            }
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});




