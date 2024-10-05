/**
 * Loading All images dynamically from firebase
 * Shown in Photos Section of menu-listing.html 
 * 
 * Adding Room cards in Booking section of menu-listing.html
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
let roomFloorFilterValue = [];
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
    console.log("..inside adding image card")
    const parentContainer = document.getElementById('ul-image');
    const elem = document.createElement('li');
    elem.innerHTML = `<a href="${imageUrl}" data-fancybox="images"data-type="image">
                                    <img class=""img-fluid bg-img""
                                        src="${imageUrl}" alt="room_img">
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
    const dbref = ref(db, 'Hostel details/' + hostelName + "/rooms/");
    onValue(dbref, (snapshot) => {

        hostelist = [];

        const roomsData = snapshot.val();

        if(roomsData != undefined || roomsData != null){
            // Loop through each floor and its rooms
        Object.keys(roomsData).forEach((floorKey) => {
            const floorData = roomsData[floorKey];
            const floorNumber = floorKey.replace('floor', ''); // Extract only the floor number

            Object.keys(floorData).forEach((roomKey) => {
                const roomData = floorData[roomKey];
                const roomNumber = roomKey.replace('room', ''); // Extract only the room number

                hostelist.push(roomData);
            });
        });
        }

        iterateAllRecords();
    })

}

const iterateAllRecords = () => {
    console.log("...inside iterating records")
    let i = 0;
    //iterating thro the hostle obj fetched from DB.
    hostelist.forEach(iterator => {
        let imageArray = [];//initializing images array for every iteration, then only images for that particular rooms will display.
        if (iterator.imagesLink != undefined) {
            iterator.imagesLink.forEach(j => {
                imageArray.push(j);
                addImageCard(j);
            })
        }
        i++;
        addHostelRoomCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor,
            iterator.roomNumber, iterator.price, iterator.roomCount, iterator.roomType, imageArray[0], i)
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
const addHostelRoomCard = (ac, amenities, bathroom, floor, roomNumber, roomprice, roomcount, roomtype, imgURL, card_number) => {

    const elem = document.createElement('div');
    elem.setAttribute('id', card_number);
    elem.classList.add('vertical-product-box-img');
    elem.innerHTML = `<div class="product-details-box">
                                                            <div class="product-img">
                                                                <img class="img-fluid img"
                                                                    src="${imgURL}" alt="no_room_img">
                                                            </div>
                                                            <div class="product-content">
                                                                <div
                                                                    class="description d-flex align-items-center justify-content-between gap-1">
                                                                    <div>
                                                                        <div class="d-flex align-items-center gap-2">
                                                                            <h6 class="product-name">
                                                                                Floor No: ${floor} ,  
                                                                                Room No: ${roomNumber}
                                                                            </h6>
                                                                        </div>
                                                                        <h6 class="customized">${roomcount} rooms available </h6>
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
                                                                            Rs.${roomprice}
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
    elem.dataset.roomPrice = roomprice;
    elem.dataset.ac = ac;
    elem.dataset.roomCount = roomcount;
    elem.dataset.roomFloor = floor;
    elem.dataset.roomNumber = roomNumber;
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
    let roomDetails = card.dataset.roomType + "-" + card.dataset.roomPrice + "-" + card.dataset.roomCount + "-" + card.dataset.roomFloor + "-" + card.dataset.roomNumber + "-" + card.dataset.ac;
    localStorage.setItem("room-details", roomDetails);
    if (card.dataset.roomCount > 0) {
        document.getElementById("no-bed-msg").style.display = 'none';
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
    else {
        document.getElementById("no-bed-msg").style.display = 'block';
        alert("Sorry, No rooms available");
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
    elem.style.cursor="pointer";
    elem.style.backgroundColor = "white";
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
    bedId = bed.dataset.bedId;
    console.log("inside bed click")
    for (i = 1; i <= localStorage.getItem('bedCount'); i++) {
        let bedId2 = 'b' + i;
        console.log("inside for color - " + document.getElementById(bedId2).style.backgroundColor);
        if (bedId != bedId2) {
            if (document.getElementById(bedId2).style.backgroundColor != "red" && document.getElementById(bedId2).style.backgroundColor == "lightgreen") {
                document.getElementById(bedId2).style.backgroundColor = "white";
                // localStorage.setItem("room-details", "");
                document.getElementById("cart-title").innerHTML = "Empty Cart";
                document.getElementById("cart-room-price").innerHTML = '';
                document.getElementById("cart-room-floor").innerHTML = "";
                document.getElementById("cart-bed-number").innerHTML = "";
            }
        }
    }
    if (document.getElementById(bedId).style.backgroundColor != "red") {
        if (document.getElementById(bedId).style.backgroundColor == "white") {
            document.getElementById(bedId).style.backgroundColor = "lightgreen";
            localStorage.setItem("bedId", bedId);
            let text = localStorage.getItem("room-details");
            let roomDetails = text.split("-");
            document.getElementById("cart-title").innerHTML = "Room Rate";
            document.getElementById("cart-room-price").innerHTML = roomDetails[1];
            // document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + " Room - " + roomDetails[2];
            document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3];
            document.getElementById("cart-bed-number").innerHTML = "Selected Bed - " + bedId;
        }
        else {
            console.log("inside elseee " + document.getElementById(bedId).style.backgroundColor)
            document.getElementById(bedId).style.backgroundColor = "white";
            localStorage.setItem("bedId", 0);
            document.getElementById("cart-title").innerHTML = "Empty Cart";
            document.getElementById("cart-room-price").innerHTML = '';
            document.getElementById("cart-room-floor").innerHTML = "";
            document.getElementById("cart-bed-number").innerHTML = "";
        }
    }

}
function clearCartItems() {
    console.log("yess inside close")
    // localStorage.setItem("bedId", 0);
    document.getElementById("cart-title").innerHTML = "Empty Cart";
    document.getElementById("cart-room-price").innerHTML = '';
    document.getElementById("cart-room-floor").innerHTML = "";
    document.getElementById("cart-bed-number").innerHTML = "";
}
bedSelectionCloseModalBtn.addEventListener('click', (e) => {
    clearCartItems();
})
customized.addEventListener('hide.bs.modal', function () {
    clearCartItems();
});

bookNowBtn.addEventListener('click', (e) => {
    console.log(localStorage.getItem("bedId"));
    if (localStorage.getItem("bedId") != 0) {
        window.location.href = "././checkout.html";
    }
    else {
        alert("select an bed to book");
    }
})
proceedPaymentBtn.addEventListener('click', (e) => {
    if (localStorage.getItem("bedId") != 0) {
        window.location.href = "././checkout.html";
    }
    else {
        alert("select an bed to proceed payment");
    }
})

window.addEventListener('load', loadDataFromDB);
/**********Loading Rooms in Book Online Section data end***************/


/**********Loading Food Menu Section data starts***************/
const loadMenuDataFromDB = () => {
    for (i = 1; i <= 5; i++) {
        loadMenuWeekWise("week" + i);
    }
};
const loadMenuWeekWise = (weekNumber) => {
    const dbRef = ref(db, `Hostel details/${hostelName}/weeks/${weekNumber}`);
    onValue(dbRef, (snapshot) => {
        const weekData = snapshot.val();
        if (weekData) {
            document.getElementById(weekNumber + "_no_menu_msg").style.display = "none";
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
                const dayData = weekData[day] || {};
                addFoodMealCard(weekNumber, day, dayData);
            });
        } else {
            document.getElementById(weekNumber + "_no_menu_msg").style.display = "block";
        }
    });
};

function addFoodMealCard(weekNumber, day, dayData) {
    const postContainer = document.getElementById(weekNumber);
    const mainParentElem = document.createElement('div');
    mainParentElem.id = weekNumber + '-' + day;
    mainParentElem.innerHTML = `<div style="padding-top:10px;" class="filter-title">
                                    <h2 class="fw-medium dark-text">${day}</h2>
                                </div>
                                <br>`;

    const mainELem = document.createElement('div');
    mainELem.setAttribute("style", "display: grid;gap: 20px;grid-template-columns:1fr 1fr 1fr;");
    ['morning', 'afternoon', 'night'].forEach(mealTime => {
        const mealData = dayData[mealTime] || {};
        const elem = document.createElement('div');
        elem.classList.add('card');
        elem.style.backgroundColor = "white";
        elem.innerHTML = `  <h6> ${mealTime} </h6>
                            <div class="card-body">
                                <ul>
                                    <li>Main Dish: ${mealData.mainDish || 'N/A'}</li>
                                    <li>Side Dish: ${mealData.sideDish || 'N/A'}</li>
                                    <li>Timings: ${mealData.timing || 'N/A'}</li>
                                </ul>
                            </div>`;
        mainELem.appendChild(elem);
        mainParentElem.appendChild(mainELem);
    });
    postContainer.appendChild(mainParentElem);

}
function showHideFoodWeek(week) {
    document.getElementById("weekNumber").innerHTML = "Menu for Week - " + week;
    for (i = 1; i <= 5; i++) {
        if (i == week) {
            document.getElementById("week" + i).style.display = "block";
            document.getElementById("nav_week" + i).classList.add("active");
        }
        else {
            document.getElementById("week" + i).style.display = "none";
            document.getElementById("nav_week" + i).classList.remove("active");
        }
    }
}
nav_week1.addEventListener('click', (e) => {
    showHideFoodWeek(1);
})
nav_week2.addEventListener('click', (e) => {
    showHideFoodWeek(2);
})
nav_week3.addEventListener('click', (e) => {
    showHideFoodWeek(3);
})
nav_week4.addEventListener('click', (e) => {
    showHideFoodWeek(4);
})
nav_week5.addEventListener('click', (e) => {
    showHideFoodWeek(5);
})
window.addEventListener('load', loadMenuDataFromDB);

/**********Loading Food Menu Section data ends***************/

/**Applying Filters Section Starts here for - Book Online Section */
var oneFloorBx = document.getElementById("item_1_1_checkbx");
var twoFloorBx = document.getElementById("item_1_2_checkbx");
var threeFloorBx = document.getElementById("item_1_3_checkbx");

var twoSharingBx = document.getElementById("item_2_1_checkbx");
var threeSharingBx = document.getElementById("item_2_2_checkbx");
var fourSharingBx = document.getElementById("item_2_3_checkbx");

var acBx = document.getElementById("item_3_1_checkbx");
var nonacBx = document.getElementById("item_3_2_checkbx");

var attachedBx = document.getElementById("item_4_1_checkbx");
var commonBx = document.getElementById("item_4_2_checkbx");

oneFloorBx.addEventListener('click', (e) => {
    roomFloorFilters();
});

twoFloorBx.addEventListener('click', (e) => {
    roomFloorFilters();
});

threeFloorBx.addEventListener('click', (e) => {
    roomFloorFilters();
});

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

function roomFloorFilters() {
    roomFloorFilterValue = [];
    console.log(roomFloorFilterValue);
    var oneFloorFlag = oneFloorBx.checked;
    var twoFloorFlag = twoFloorBx.checked;
    var threeFloorFlag = threeFloorBx.checked;
    if (oneFloorFlag == false && twoFloorFlag == true && threeFloorFlag == false) {
        roomFloorFilterValue.push(twoFloorBx.value);
        applyFilters();
    }
    else if (twoFloorFlag == false && threeFloorFlag == true && oneFloorFlag == false) {
        roomFloorFilterValue.push(threeFloorBx.value);
        applyFilters();
    }
    else if (twoFloorFlag == false && threeFloorFlag == false && oneFloorFlag == true) {
        roomFloorFilterValue.push(oneFloorBx.value);
        applyFilters();
    }
    else if (twoFloorFlag == true && threeFloorFlag == false && oneFloorFlag == true) {
        roomFloorFilterValue.push(twoFloorBx.value);
        roomFloorFilterValue.push(oneFloorBx.value);
        applyFilters();
    }
    else if (twoFloorFlag == true && threeFloorFlag == true && oneFloorFlag == false) {
        roomFloorFilterValue.push(twoFloorBx.value);
        roomFloorFilterValue.push(threeFloorBx.value);
        applyFilters();
    }
    else if (twoFloorFlag == false && threeFloorFlag == true && oneFloorFlag == true) {
        roomFloorFilterValue.push(threeFloorBx.value);
        roomFloorFilterValue.push(oneFloorBx.value);
        applyFilters();
    }
    else if (twoFloorFlag == true && threeFloorFlag == true && oneFloorFlag == true) {
        roomFloorFilterValue.push(oneFloorBx.value);
        roomFloorFilterValue.push(twoFloorBx.value);
        roomFloorFilterValue.push(threeFloorBx.value);
        roomFloorFilterValue.push(oneFloorBx.value);
        applyFilters();
    }
    else {
        console.log("No Filter");
        applyFilters();
    }
}

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
    twoFloorBx.checked = false;
    threeFloorBx.checked = false;
    oneFloorBx.checked = false;

    twoSharingBx.checked = false;
    threeSharingBx.checked = false;
    fourSharingBx.checked = false;

    acBx.checked = false;
    nonacBx.checked = false;

    attachedBx.checked = false;
    commonBx.checked = false;

    roomFloorFilterValue = [];
    roomTypeFilterValue = [];
    airConditionFilterValue = [];
    bathroomFilterValue = [];

    applyFilters();
});

function applyFilters() {
    var data_filter = [];
    console.log("Room Floor Filters - " + roomFloorFilterValue + "Room Type Filters - " + roomTypeFilterValue.length + " AC filters - " + airConditionFilterValue.length + " Bathroom filter - " + bathroomFilterValue.length);
    if (roomFloorFilterValue.length == 0 && roomTypeFilterValue.length == 0 && airConditionFilterValue.length == 0 && bathroomFilterValue.length == 0) {
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
        if (roomFloorFilterValue.length != 0) {
            roomFloorFilterValue.forEach(filterValue => {
                data_filter = data_filter.filter(element =>
                    element.floor.toLowerCase() == filterValue.toLowerCase()
                );
            });
        }
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
        if (roomFloorFilterValue.length != 0 || roomTypeFilterValue.length != 0 || airConditionFilterValue.length != 0 || bathroomFilterValue.length != 0) {
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
            data_filter.forEach(iterator => {
                let imageArray = [];//initializing images array for every iteration, then only images for that particular rooms will display.
                i++;
                if (iterator.imagesLink != undefined) {
                    iterator.imagesLink.forEach(j => {
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