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
let roomTypeFilterValue = [];
let airConditionFilterValue = [];
let bathroomFilterValue = [];

/**********Loading Image data in - Photos Section - starts***************/
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


/**********Loading Room data in - Book Online - Section starts***************/
const loadDataFromDB = () => {
    console.log("...inside DB ");
    localStorage.setItem("total_filter_length", 0);
    localStorage.setItem("total_rooms_length", 0);
    localStorage.setItem('bedCount', 0);//number of bed in room selected.
    localStorage.setItem("bedId", 0);//selected Bed ID by the user.
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
            iterator.price, iterator.roomCount, iterator.roomType, imageArray[0], i)
    });
    localStorage.setItem("total_rooms_length", hostelist.length);
    if (hostelist.length == 0) {
        document.getElementById("no_room_msg").style.display = "flex";
        document.getElementById("no_room_msg").style.justifyContent = "center";
        document.getElementById("no_room_msg").style.alignItems = "center";
    }
    else {
        document.getElementById("no_room_msg").style.display = "none";
    }

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
                                                                            Air Condition : ${ac}
                                                                        </p>
                                                                        <p>
                                                                            Bathroom : ${bathroom}
                                                                        </p>
                                                                        <p>
                                                                            Sharing : ${roomtype} 
                                                                        </p>
                                                                        <p>
                                                                            Amenities : ${amenities}
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
    elem.dataset.roomType = roomtype;
    elem.addEventListener('click', handleCardClick);

    postContainer.appendChild(elem);
}
/**
 * 
 * @param {*} event - click event on room card
 * function gets triggered when room card is clicked. 
 */
function handleCardClick(event) {
    const card = event.currentTarget;
    const hostelRoomType = card.dataset.roomType;
    // let bedCount = localStorage.getItem('bedCount');
    if (localStorage.getItem('bedCount') != 0) {
        for (i = 1; i <= localStorage.getItem('bedCount'); i++) {
            let cardId = 'b' + i;
            document.getElementById(cardId).remove();
        }
        localStorage.setItem('bedCount', 0);
    }

    // Using match with regEx

    //need for regex since when user clicks on room , 
    //the room type is "2 Sharing","3 Sharing","10 Sharing" to extract the number from the string we use REGEX.
    let matches = hostelRoomType.match(/(\d+)/);
    // Display output if number extracted
    if (matches) {
        let bedCount = parseInt(matches[0]);
        localStorage.setItem("bedCount", bedCount);
        for (i = 1; i <= bedCount; i++) {
            addBed(i);
        }
    }
}

/**
 * 
 * @param {*} i - counter of the bed
 * Bed card is added dynamically based on the Room's bed count clicked by user.
 */
function addBed(i) {
    const parentContainer = document.getElementById('bedParent');
    const elem = document.createElement('div');
    elem.classList.add('card');
    let bedId = 'b' + i;
    elem.setAttribute("id", bedId);
    elem.innerHTML = `<div class="card-body">Bed ${i}</div>`;
    elem.dataset.bedId = bedId;
    elem.addEventListener('click', bedSelection);
    parentContainer.appendChild(elem);

}
/**
 * 
 * @param {*} event
 * WHen user selects a bed , this function is triggered. 
 */
function bedSelection(event) {
    const bed = event.currentTarget;
    let bedId;
    for (i = 1; i <= localStorage.getItem('bedCount'); i++) {
        bedId = 'b' + i;
        if (document.getElementById(bedId).style.backgroundColor != "red") {
            document.getElementById(bedId).style.backgroundColor = "white";
        }
    }
    bedId = bed.dataset.bedId;
    if (document.getElementById(bedId).style.backgroundColor != "red") {
        document.getElementById(bedId).style.backgroundColor = "lightgreen";
        localStorage.setItem("bedId", bedId);
    }
}

bookNowBtn.addEventListener('click', (e) => {
    if (localStorage.getItem("bedId") != 0) {
        window.location.href = "././checkout.html"
    }
    else {
        alert("select an bed to book")
    }
})

window.addEventListener('load', loadDataFromDB);
/**********Loading Rooms in Book Online Section data end***************/


//Need to re-visit this
/**********Loading Overview Section data starts***************/

const loadMenuDataFromDB = () => {
    console.log("...inside menu load ")
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

const loadOverviewData = () => {
    document.getElementById("hostel_phone_number").innerHTML = overviewList[0];
    document.getElementById("hostel_address").innerHTML = overviewList[1] + ", " + overviewList[2];
}

window.addEventListener('load', loadMenuDataFromDB);

/**********Loading Overview Section data ends***************/

/**Applying Filters Section Starts here for - Book Online Section */
var twoSharingBx = document.getElementById("item_2_1_checkbx");
var threeSharingBx = document.getElementById("item_2_2_checkbx");
var fourSharingBx = document.getElementById("item_2_3_checkbx");

var acBx = document.getElementById("item_3_1_checkbx");
var nonacBx = document.getElementById("item_3_2_checkbx");

var attachedBx = document.getElementById("item_4_1_checkbx");
var commonBx = document.getElementById("item_4_2_checkbx");

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

attachedBx.addEventListener('click', (e) => {
    bathroomFilters();
});

commonBx.addEventListener('click', (e) => {
    bathroomFilters();
});

function roomTypeFilters() {
    roomTypeFilterValue = [];
    var twoSharingFlag = twoSharingBx.checked;
    var threeSharingFlag = threeSharingBx.checked;
    var fourSharingFlag = fourSharingBx.checked;
    if (twoSharingFlag == true && threeSharingFlag == false && fourSharingFlag == false) {
        roomTypeFilterValue.push(twoSharingBx.value);
        applyFilters();
    }
    else if (twoSharingFlag == false && threeSharingFlag == true && fourSharingFlag == false) {
        roomTypeFilterValue.push(threeSharingBx.value);
        applyFilters();
    }
    else if (twoSharingFlag == false && threeSharingFlag == false && fourSharingFlag == true) {
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters();
    }
    else if (twoSharingFlag == true && threeSharingFlag == false && fourSharingFlag == true) {
        roomTypeFilterValue.push(twoSharingBx.value);
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters();
    }
    else if (twoSharingFlag == true && threeSharingFlag == true && fourSharingFlag == false) {
        roomTypeFilterValue.push(twoSharingBx.value);
        roomTypeFilterValue.push(threeSharingBx.value);
        applyFilters();
    }
    else if (twoSharingFlag == false && threeSharingFlag == true && fourSharingFlag == true) {
        roomTypeFilterValue.push(threeSharingBx.value);
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters();
    }
    else if (twoSharingFlag == true && threeSharingFlag == true && fourSharingFlag == true) {
        roomTypeFilterValue.push(twoSharingBx.value);
        roomTypeFilterValue.push(threeSharingBx.value);
        roomTypeFilterValue.push(fourSharingBx.value);
        applyFilters();
    }
    else {
        console.log("No Filter");
        applyFilters();
    }
}

function airConditionFilters() {
    airConditionFilterValue = [];
    var acFlag = acBx.checked;
    var nonacFlag = nonacBx.checked;
    if (acFlag == true && nonacFlag == false) {
        airConditionFilterValue.push(acBx.value);
        applyFilters();
    }
    else if (acFlag == false && nonacFlag == true) {
        airConditionFilterValue.push(nonacBx.value);
        applyFilters();
    }
    else if (acFlag == true && nonacFlag == true) {
        airConditionFilterValue.push(acBx.value);
        airConditionFilterValue.push(nonacBx.value);
        applyFilters();
    }
    else {
        console.log("No Filter");
        applyFilters();
    }
}

function bathroomFilters() {
    bathroomFilterValue = [];
    var attachedFlag = attachedBx.checked;
    var commonFlag = commonBx.checked;
    if (attachedFlag == true && commonFlag == false) {
        bathroomFilterValue.push(attachedBx.value);
        applyFilters();
    }
    else if (attachedFlag == false && commonFlag == true) {
        bathroomFilterValue.push(commonBx.value);
        applyFilters();
    }
    else if (attachedFlag == true && commonFlag == true) {
        bathroomFilterValue.push(attachedBx.value);
        bathroomFilterValue.push(commonBx.value);
        applyFilters();
    }
    else {
        console.log("No Filter");
        applyFilters();
    }
}

filtersClrBtn.addEventListener('click', (e) => {
    twoSharingBx.checked = false;
    threeSharingBx.checked = false;
    fourSharingBx.checked = false;

    acBx.checked = false;
    nonacBx.checked = false;

    attachedBx.checked = false;
    commonBx.checked = false;

    roomTypeFilterValue = [];
    airConditionFilterValue = [];
    bathroomFilterValue = [];

    applyFilters();
});

function applyFilters() {
    var data_filter = [];
    console.log("Room Type Filters - " + roomTypeFilterValue.length + " AC filters - " + airConditionFilterValue.length + " Bathroom filter - " + bathroomFilterValue.length);
    if (roomTypeFilterValue.length == 0 && airConditionFilterValue.length == 0 && bathroomFilterValue.length == 0) {
        if (localStorage.getItem("total_filter_length") != 0) {
            removeCards(localStorage.getItem("total_filter_length"));
            localStorage.setItem("total_filter_length", 0);
        }
        if (localStorage.getItem("total_rooms_length") == 0) {
            loadDataFromDB();
        }
    }
    else {
        data_filter = hostelist;
        if (roomTypeFilterValue.length != 0) {
            roomTypeFilterValue.forEach(filterValue => {
                data_filter = data_filter.filter(element =>
                    element.roomType.toLowerCase() == filterValue.toLowerCase()
                );
            });
        }
        if (airConditionFilterValue.length != 0) {
            airConditionFilterValue.forEach(filterValue => {
                data_filter = data_filter.filter(element =>
                    element.ac.toLowerCase() == filterValue.toLowerCase()
                );
            });
        }
        if (bathroomFilterValue.length != 0) {
            bathroomFilterValue.forEach(filterValue => {
                data_filter = data_filter.filter(element =>
                    element.bathroom.toLowerCase() == filterValue.toLowerCase()
                );
            });
        }
        if (roomTypeFilterValue.length != 0 || airConditionFilterValue.length != 0 || bathroomFilterValue.length != 0) {
            if (localStorage.getItem("total_rooms_length") != 0) {
                removeCards(localStorage.getItem("total_rooms_length"));
                localStorage.setItem("total_rooms_length", 0);
            }
            if (localStorage.getItem("total_filter_length") != 0) {
                removeCards(localStorage.getItem("total_filter_length"));
                localStorage.setItem("total_filter_length", 0);
            }
            //Adding fitler relevant room cards data.
            var i = 0;
            let imageArray = [];
            data_filter.forEach(iterator => {
                i++;
                if (iterator.images != undefined) {
                    iterator.images.forEach(j => {
                        imageArray.push(j);
                        // addImageCard(i);
                    })
                }
                addHostelRoomCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor,
                    iterator.price, iterator.roomCount, iterator.roomType, imageArray[0], i)
            });
            localStorage.setItem("total_filter_length", i);
            if (data_filter.length == 0) {
                document.getElementById("no_room_msg").style.display = "flex";
                document.getElementById("no_room_msg").style.justifyContent = "center";
                document.getElementById("no_room_msg").style.alignItems = "center";
            }
            else {
                document.getElementById("no_room_msg").style.display = "none";
            }

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
/**Applying Filters Section ends here for - Book Online Section */