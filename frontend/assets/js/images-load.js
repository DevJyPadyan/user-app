/**
 * Loading All images dynamically from firebase
 * Shown in Photos Section of menu-listing.html 
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, onValue, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

let hostelImages = [];
var loadingPhotosMsgElem = document.getElementById("loading-photos-msg");
let hostelName = localStorage.getItem('hostel-name');
let hostelAddress = localStorage.getItem('hostel-address');
let hostelist = [];
let overviewList = [];

/**********Loading Image data in Photos Section starts***************/ 
const loadImagesDataFromDB = () => {
    console.log("...inside DB Image Load ")
    document.getElementById("hostel-name").innerHTML = hostelName;
    document.getElementById("hostel-address").innerHTML = hostelAddress;
    loadingPhotosMsgElem.style.display = "block";
    const dbref = ref(db, 'Hostel details/' + hostelName + "/ImageData");
    onValue(dbref, (snapshot) => {

        hostelImages = [];
        snapshot.forEach(iterator => {
            hostelImages.push(iterator.val());
        })
        iterateAllImageRecords();
    })
}

const iterateAllImageRecords = () => {
    //iterating thro the hostle images obj fetched from DB.
    if (!(hostelImages.length === 0)) {
        hostelImages.forEach(iterator => {
            addImageCard(iterator);
        })
        loadingPhotosMsgElem.style.display = "none";
    }
    else {
        console.log("No images");
    }
}

function addImageCard(imageUrl) {
    const parentContainer = document.getElementById('ul-image');
    const elem = document.createElement('li');
    elem.innerHTML = `<a href="${imageUrl}" data-fancybox="images"data-type="image">
                                    <img class=""img-fluid bg-img""
                                        src="${imageUrl}" alt="vp1">
                                </a>`;
    parentContainer.appendChild(elem);
}

window.addEventListener('load', loadImagesDataFromDB);
/**********Loading Image data in Photos Section ends***************/ 


/**********Loading Room data in Book Online Section starts***************/ 
const loadDataFromDB = () => {
    console.log("...inside DB ")
    const dbref = ref(db, 'Hostel details/' + hostelName + "/rooms");
    onValue(dbref, (snapshot) => {

        hostelist = [];

        snapshot.forEach(iterator => {
            hostelist.push(iterator.val());
        })
        iterateAllRecords();
    })
}

const iterateAllRecords = () => {
    let imageArray = [];
    //iterating thro the hostle obj fetched from DB.
    hostelist.forEach(iterator => {
        if (!(iterator.images.length === 0)) {
            iterator.images.forEach(i => {
                imageArray.push(i);
                addImageCard(i);
            })
        }
        addHostelCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor,
            iterator.price, iterator.roomcount, iterator.roomtype, imageArray[0])
    })
}

const postContainer = document.getElementById('item-3');
const addHostelCard = (ac, amenities, bathroom, floor, roomprice, roomcount, roomtype, imgURL) => {

    const elem = document.createElement('div');
    elem.classList.add('vertical-product-box-img');
    elem.innerHTML = `<div class="product-details-box">
                                                            <div class="product-img">
                                                                <img class="img-fluid img"
                                                                    src="${imgURL}" alt="rp1">
                                                            </div>
                                                            <div class="product-content">
                                                                <div
                                                                    class="description d-flex align-items-center justify-content-between gap-1">
                                                                    <div>
                                                                        <div class="d-flex align-items-center gap-2">
                                                                            <h6 class="product-name">
                                                                                Room ${roomcount}
                                                                            </h6>
                                                                            <h6 class="customized">Floor No: ${floor} </h6>
                                                                        </div>
                                                                        <p>
                                                                            Amenities : ${ac}, ${bathroom}, ${roomtype} Sharing, ${amenities}
                                                                        </p>
                                                                    </div>
                                                                    <div class="product-box-price">
                                                                        <h2 class="theme-color fw-semibold">
                                                                            ${roomprice}
                                                                        </h2>
                                                                        <a href="#customized"
                                                                            class="btn theme-outline add-btn mt-0"
                                                                            data-bs-toggle="modal">+Add</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>`;

    // To add click event to the card
    // elem.dataset.hostelName = Hostelname;
    // elem.dataset.hostelAddress = Hosteladd1;
    // elem.addEventListener('click', handleCardClick);

    postContainer.appendChild(elem);
}

window.addEventListener('load', loadDataFromDB);
/**********Loading Rooms in Book Online Section data end***************/ 


//Need to re-visit this
/**********Loading Overview Section data starts***************/ 

const loadOverviewDataFromDB = () => {
    console.log("...inside overview load ")
    const dbref = ref(db, 'Hostel details/' + hostelName);
    onValue(dbref, (snapshot) => {
        overviewList = [];
        console.log(snapshot);
        snapshot.forEach(iterator => {
            overviewList.push(iterator.val());
            loadOverviewData();
        })
        // iterateOverviewRecords();
    });
}

// const iterateOverviewRecords = () => {
//     //iterating thro the hostle obj fetched from DB.
//     hostelist.forEach(iterator => {
//         console.log(iterator)
//         loadOverviewData(iterator.Hostelname, iterator.Hosteltype, iterator.Hosteladd1,
//             iterator.Hosteladd2, iterator.Hostelphone, iterator.Hostelemail, iterator.Hostelcity,
//             iterator.Hostelstate, iterator.Hostelpin,
//             iterator.Hostelrent, iterator.Hostelfood, iterator.Acprice, iterator.Nonacprice)
//     })
// }

const loadOverviewData = () => {
    document.getElementById("hostel_phone_number").innerHTML = overviewList[0];
    document.getElementById("hostel_address").innerHTML =overviewList[1]+", "+overviewList[2];
}

window.addEventListener('load', loadOverviewDataFromDB);

/**********Loading Overview Section data ends***************/ 
