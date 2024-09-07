/**
 * logout.js will be executed, when user clicks on logout
 */

logoutBtn.addEventListener('click',(e)=>{
    //removing user-details from the localstorage, once logout is clicked.
    localStorage.removeItem("userDetails");
    localStorage.clear();
    window.location.href='././signin.html';
});

//logout button inside Logout Modal.
if(document.getElementById("modalLogoutBtn") != null ){
    modalLogoutBtn.addEventListener('click',(e)=>{
        //removing user-details from the localstorage, once logout inside Modal Logout is clicked.
        localStorage.removeItem("userDetails");
        localStorage.clear();
        window.location.href='././signin.html';
    });
}