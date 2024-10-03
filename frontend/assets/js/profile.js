import { userDeatilObj } from "./user-details.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref as ref2, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"


const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage(app);
let userUid = userDeatilObj.userUid;

let proofSubmission = "no";
let guardianDeatils = "no";

var files = [];
let imagelink = [];
document.getElementById("files").addEventListener("change", function (e) {
    files = e.target.files;
    console.log(files)
});

function loadDataFromDB() {
    const dbref = ref(db);
    console.log(userUid);
    if (userUid) {
        get(child(dbref, "User details/" + userUid + '/'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setUserProfileDetails(snapshot)
                }

            })
            .catch((error) => {
                alert("error" + error);
            });
    }
}

async function setUserProfileDetails(snapshot) {
    console.log("inside setting profile details");
    document.getElementById("username").value = snapshot.val().userName;
    document.getElementById("usermail").value = snapshot.val().userEmail;
    document.getElementById("userphone").value = snapshot.val().userPhone;
    document.getElementById("userfullname").value = snapshot.val().userFullName || '';
    document.getElementById("useradd1").value = snapshot.val().userAddress1 || '';
    document.getElementById("useradd2").value = snapshot.val().userAddress2 || '';
    document.getElementById("usercity").value = snapshot.val().userCity || '';
    document.getElementById("userstate").value = snapshot.val().userState || '';
    document.getElementById("userpin").value = snapshot.val().userPin || '';
    proofSubmission = snapshot.val().proofSubmission;

    const imageRef = ref(db, `User details/${userUid}/proofData/`);
    try {
        const snapshot = await get(imageRef);
        if (snapshot.exists()) {
            const imageUrls = snapshot.val();
            const imageContainer = document.getElementById('userImageContainer');
            imageContainer.innerHTML = ''; // Clear existing images

            imageUrls.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.alt = 'Govt Proof Image';
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.margin = '5px';
                imageContainer.appendChild(img);
            });
        } else {
            console.log('No images found for this User.');
            document.getElementById('noproofmsg').style.display = "block";
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }

    guardianDeatils = snapshot.val().guardianDetails;
    document.getElementById("guardname").value = snapshot.val().guardName || '';
    document.getElementById("guardrel").value = snapshot.val().guardRelation || '';
    document.getElementById("guardmail").value = snapshot.val().guardEmail || '';
    document.getElementById("guardphone").value = snapshot.val().guardPhone || '';
    document.getElementById("guardadd1").value = snapshot.val().guardAddress1 || '';
    document.getElementById("guardadd2").value = snapshot.val().guardAddress2 || '';
    document.getElementById("guardstate").value = snapshot.val().guardState || '';
    document.getElementById("guardcity").value = snapshot.val().guardCity || '';
    document.getElementById("guardpin").value = snapshot.val().guardPin || '';
}

updateUser.addEventListener('click', async (e) => {
    e.preventDefault();
    var userFullName = document.getElementById("userfullname").value;
    var userPhone = document.getElementById("userphone").value;
    var userGender = document.getElementById("usergender").value;
    var userAddress1 = document.getElementById("useradd1").value;
    var userAddress2 = document.getElementById("useradd2").value;
    var userCity = document.getElementById("usercity").value;
    var userState = document.getElementById("userstate").value;
    var userPin = document.getElementById("userpin").value;
    var guardName = document.getElementById("guardname").value;
    var guardRelation = document.getElementById("guardrel").value;
    var guardEmail = document.getElementById("guardmail").value;
    var guardPhone = document.getElementById("guardphone").value;
    var guardAddress1 = document.getElementById("guardadd1").value;
    var guardAddress2 = document.getElementById("guardadd2").value;
    var guardState = document.getElementById("guardstate").value;
    var guardCity = document.getElementById("guardcity").value;
    var guardPin = document.getElementById("guardpin").value;

    if (proofSubmission == "no") {
        console.log(1)
        if (files.length != 0) {
            console.log(1.1 + " files - " + files);
            if (guardianDeatils == "no") {
                if (guardName != '' && guardRelation != '' && guardEmail != '' && guardPhone != '' && guardAddress1 != ''
                    && guardAddress2 != '' && guardState != '' && guardCity != '' && guardPin != ''
                ) {
                    //Loops through all the selected files
                    for (let i = 0; i < files.length; i++) {
                        const storageRef = ref2(storage, 'userProof/' + userUid + '/govtProof/' + files[i].name);
                        const upload = await uploadBytes(storageRef, files[i]);
                        const imageUrl = await getDownloadURL(storageRef);
                        imagelink.push(imageUrl);
                    }
                    alert("Uploading Govt ID.., Click Ok");
                    const imageRef = ref(db, 'User details/' + userUid + '/proofData/');
                    set(imageRef, imagelink)
                        .then(() => {
                            alert("Govt Proof Image is uploading..");
                            console.log('Image URLs have been successfully stored!');
                        })
                    update(ref(db, "User details/" + userUid + '/'), {
                        proofSubmission: "yes"
                    })
                        .then(() => {
                            alert("Govt Proof Submitted successfully");
                            updateUserDetails();
                            // window.location.reload();
                        })
                        .catch((error) => {
                            alert(error);
                        });
                }
                else {
                    alert("Please Fill, Guardian Details");
                }
            }
            else {
                //Loops through all the selected files
                for (let i = 0; i < files.length; i++) {
                    const storageRef = ref2(storage, 'userProof/' + userUid + '/govtProof/' + files[i].name);
                    const upload = await uploadBytes(storageRef, files[i]);
                    const imageUrl = await getDownloadURL(storageRef);
                    imagelink.push(imageUrl);
                }
                alert("Uploading Govt ID.., Click Ok");
                const imageRef = ref(db, 'User details/' + userUid + '/proofData/');
                set(imageRef, imagelink)
                    .then(() => {
                        alert("Govt Proof Image is uploading..");
                        console.log('Image URLs have been successfully stored!');
                    })
                update(ref(db, "User details/" + userUid + '/'), {
                    proofSubmission: "yes"
                })
                    .then(() => {
                        alert("Govt Proof Submitted successfully");
                        updateUserDetails();
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        } else {
            alert("No file choosen for govt proof");
        }
    }
    else {
        if (files.length != 0) {
            if (guardianDeatils == "no") {
                if (guardName != '' && guardRelation != '' && guardEmail != '' && guardPhone != '' && guardAddress1 != ''
                    && guardAddress2 != '' && guardState != '' && guardCity != '' && guardPin != ''
                ) {
                    //Loops through all the selected files
                    for (let i = 0; i < files.length; i++) {
                        const storageRef = ref2(storage, 'userProof/' + userUid + '/govtProof/' + files[i].name);
                        const upload = await uploadBytes(storageRef, files[i]);
                        const imageUrl = await getDownloadURL(storageRef);
                        imagelink.push(imageUrl);
                    }
                    alert("Uploading Govt ID.., Click Ok");
                    const imageRef = ref(db, 'User details/' + userUid + '/proofData/');
                    set(imageRef, imagelink)
                        .then(() => {
                            alert("Govt Proof Image is uploading..");
                            console.log('Image URLs have been successfully stored!');
                        })
                    update(ref(db, "User details/" + userUid + '/'), {
                        proofSubmission: "yes"
                    })
                        .then(() => {
                            alert("Govt Proof Submitted successfully");
                            updateUserDetails();
                            // window.location.reload();
                        })
                        .catch((error) => {
                            alert(error);
                        });
                }
                else {
                    alert("Please Fill, Guardian Details");
                }
            }
            else {
                //Loops through all the selected files
                for (let i = 0; i < files.length; i++) {
                    const storageRef = ref2(storage, 'userProof/' + userUid + '/govtProof/' + files[i].name);
                    const upload = await uploadBytes(storageRef, files[i]);
                    const imageUrl = await getDownloadURL(storageRef);
                    imagelink.push(imageUrl);
                }
                alert("Uploading Govt ID.., Click Ok");
                const imageRef = ref(db, 'User details/' + userUid + '/proofData/');
                set(imageRef, imagelink)
                    .then(() => {
                        alert("Govt Proof Image is uploading..");
                        console.log('Image URLs have been successfully stored!');
                    })
                update(ref(db, "User details/" + userUid + '/'), {
                    proofSubmission: "yes"
                })
                    .then(() => {
                        alert("Govt Proof Submitted successfully");
                        updateUserDetails();
                        // window.location.reload();
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        } else {
            updateUserDetails();
        }
    }


});

function updateUserDetails() {
    var userFullName = document.getElementById("userfullname").value;
    var userPhone = document.getElementById("userphone").value;
    var userGender = document.getElementById("usergender").value;
    var userAddress1 = document.getElementById("useradd1").value;
    var userAddress2 = document.getElementById("useradd2").value;
    var userCity = document.getElementById("usercity").value;
    var userState = document.getElementById("userstate").value;
    var userPin = document.getElementById("userpin").value;
    var guardName = document.getElementById("guardname").value;
    var guardRelation = document.getElementById("guardrel").value;
    var guardEmail = document.getElementById("guardmail").value;
    var guardPhone = document.getElementById("guardphone").value;
    var guardAddress1 = document.getElementById("guardadd1").value;
    var guardAddress2 = document.getElementById("guardadd2").value;
    var guardState = document.getElementById("guardstate").value;
    var guardCity = document.getElementById("guardcity").value;
    var guardPin = document.getElementById("guardpin").value;


    guardianDeatils = "yes";

    update(ref(db, "User details/" + userUid), {
        userFullName: userFullName,
        userPhone: userPhone,
        userGender: userGender,
        userAddress1: userAddress1,
        userAddress2: userAddress2,
        userCity: userCity,
        userState: userState,
        userPin: userPin,

        guardianDetails: guardianDeatils,
        guardName: guardName,
        guardRelation: guardRelation,
        guardEmail: guardEmail,
        guardPhone: guardPhone,
        guardAddress1: guardAddress1,
        guardAddress2: guardAddress2,
        guardState: guardState,
        guardCity: guardCity,
        guardPin: guardPin,

    })
        .then(() => {
            alert("Updated successfully.");
            if (localStorage.getItem('userRegistrationStatus') == "checkout") {
                window.location.href = "././checkout.html";
            }
            else {
                window.location.reload();
            }
        })
        .catch((error) => {
            alert(error);
        });
}
window.addEventListener("load", loadDataFromDB);