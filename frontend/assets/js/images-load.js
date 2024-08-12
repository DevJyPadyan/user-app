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
    let i = 0;
    //iterating thro the hostle obj fetched from DB.
    hostelist.forEach(iterator => {
        if (iterator.images != undefined) {
            iterator.images.forEach(i => {
                imageArray.push(i);
                addImageCard(i);
            })
        }
        i++;
        addHostelRoomCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor,
            iterator.price, iterator.roomcount, iterator.roomtype, imageArray[0], i)
    });
    localStorage.setItem("total_rooms_length", hostelist.length);

}

const postContainer = document.getElementById('item-3');
const addHostelRoomCard = (ac, amenities, bathroom, floor, roomprice, roomcount, roomtype, imgURL, card_number) => {

    const elem = document.createElement('div');
    elem.setAttribute('id', card_number);
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
    document.getElementById("hostel_address").innerHTML = overviewList[1] + ", " + overviewList[2];
}

window.addEventListener('load', loadOverviewDataFromDB);

/**********Loading Overview Section data ends***************/

/**Applying Filters Section Starts here */
var twoSharingBx = document.getElementById("item_2_1_checkbx");
var threeSharingBx = document.getElementById("item_2_2_checkbx");
var fourSharingBx = document.getElementById("item_2_3_checkbx");

var acBx = document.getElementById("item_3_1_checkbx");
var nonacBx = document.getElementById("item_3_2_checkbx");

twoSharingBx.addEventListener('click', (e) => {
    roomTypeFilters();
});

threeSharingBx.addEventListener('click', (e) => {
    roomTypeFilters();
});

fourSharingBx.addEventListener('click', (e) => {
    roomTypeFilters();
});

acBx.addEventListener('click', (e) => {
    airConditionFilters();
});

nonacBx.addEventListener('click', (e) => {
    airConditionFilters();
});

function roomTypeFilters() {
    var twoSharingFlag = twoSharingBx.checked;
    var threeSharingFlag = threeSharingBx.checked;
    var fourSharingFlag = fourSharingBx.checked;
    var roomTypeFilterValue = [];
    if (twoSharingFlag == true && threeSharingFlag == false && fourSharingFlag == false) {
        roomTypeFilterValue.push(twoSharingBx.value);
        applyFilters(roomTypeFilterValue);
    }
    else if (twoSharingFlag == false && threeSharingFlag == true && fourSharingFlag == false) {
        roomTypeFilterValue.push(threeSharingBx.value);
        applyFilters(roomTypeFilterValue);
    }
    else if (twoSharingFlag == false && threeSharingFlag == false && fourSharingFlag == true) {
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters(roomTypeFilterValue);
    }
    else if (twoSharingFlag == true && threeSharingFlag == false && fourSharingFlag == true) {
        roomTypeFilterValue.push(twoSharingBx.value);
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters(roomTypeFilterValue);
    }
    else if (twoSharingFlag == true && threeSharingFlag == true && fourSharingFlag == false) {
        roomTypeFilterValue.push(twoSharingBx.value);
        roomTypeFilterValue.push(threeSharingBx.value);
        applyFilters(roomTypeFilterValue);
    }
    else if (twoSharingFlag == false && threeSharingFlag == true && fourSharingFlag == true) {
        roomTypeFilterValue.push(threeSharingBx.value);
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters(roomTypeFilterValue);
    }
    else if (twoSharingFlag == true && threeSharingFlag == true && fourSharingFlag == true) {
        roomTypeFilterValue.push(twoSharingBx.value);
        roomTypeFilterValue.push(threeSharingBx.value);
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters(roomTypeFilterValue);
    }
    else {
        console.log("No Filter");
        applyFilters(roomTypeFilterValue);
    }
    console.log("Room Type filter value -" + roomTypeFilterValue);
}

function airConditionFilters() {
    var acFlag = acBx.checked;
    var nonacFlag = nonacBx.checked;
    var airConditionFilterValue = [];
    if (acFlag == true && nonacFlag == false) {
        airConditionFilterValue.push(acBx.value);
    }
    else if (acFlag == false && nonacFlag == true) {
        airConditionFilterValue.push(nonacBx.value);
    }
    else if (acFlag == true && nonacFlag == true) {
        airConditionFilterValue.push(acBx.value);
        airConditionFilterValue.push(nonacBx.value);
    }
    else {
        console("No Filter");
    }
    console.log("Air Contion filter value - " + airConditionFilterValue);
}

filtersClrBtn.addEventListener('click', (e) => {
    twoSharingBx.checked = false;
    threeSharingBx.checked = false;
    fourSharingBx.checked = false;

    acBx.checked = false;
    nonacBx.checked = false;
});

function applyFilters(roomTypeFilters) {
    var data_filter_value = [];
    var data_filter = [];
    console.log(roomTypeFilters.length);
    if (roomTypeFilters.length == 0) {
        if (localStorage.getItem("total_filter_length") != 0) {
            removeCards(localStorage.getItem("total_filter_length"));
            localStorage.setItem("total_filter_length", 0);
        }
        loadDataFromDB();
    }
    else {
        roomTypeFilters.forEach(filterValue => {
            data_filter = hostelist.filter(element =>
                element.roomtype.toLowerCase() == filterValue.toLowerCase()
            );
            data_filter_value.push(data_filter);
        });

        if (localStorage.getItem("total_rooms_length") != 0) {
            removeCards(localStorage.getItem("total_rooms_length"));
            localStorage.setItem("total_rooms_length", 0)
            //Adding fitler relevant room cards data.
            var i = 0;
            let imageArray = [];
            data_filter.forEach(iterator => {
                i++;
                if (iterator.images != undefined) {
                    iterator.images.forEach(i => {
                        imageArray.push(i);
                        addImageCard(i);
                    })
                }
                addHostelRoomCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor,
                    iterator.price, iterator.roomcount, iterator.roomtype, imageArray[0], i)
            });
            localStorage.setItem("total_filter_length", i);
        }
        else {
            loadDataFromDB();
        }
    }
}

/**
 * 
 * @param {length of the cards needs to removed from the UI} length 
 * Removes the cards present in UI either the cards populated from search result or entire list of hostel cards
 */
function removeCards(length) {
    // console.log("length to remove cards - " + length)
    for (var i = 1; i <= length; i++) {
        // console.log("card - " + i);
        document.getElementById(i).remove();
    }
}

