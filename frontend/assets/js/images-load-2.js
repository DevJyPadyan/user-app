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
let hosteFloorCount = 0;
let hostelRoomCount = 0;

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

        if (roomsData != undefined || roomsData != null) {
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
        var checkboxes = document.getElementsByName("sharingCheckBox");
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
            checkboxes[i].disabled = false;
        }


        iterateAllRecords();
    })

}

const postContainer = document.getElementById('item-1');
const iterateAllRecords = () => {
    console.log("...inside iterating records")
    let i = 0;
    postContainer.innerHTML = '';//erasing the previous loaded cards, so that redudant cards wont be added.
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
        console.log(iterator.rooms)
        addHostelRoomCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor, iterator.price, iterator.roomType, iterator.bedsAvailable, imageArray[0], i, iterator.rooms)
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


const addHostelRoomCard = (ac, amenities, bathroom, floor, roomprice, roomtype, bedsAvailable, imgURL, card_number, roomsArray) => {

    let roomNumber;
    console.log(roomsArray)
    for (let key in roomsArray) {
        let val = roomsArray[key];
        roomNumber = val.roomNumber;

    }
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
                                                                                Floor No: ${floor},<br> Room Type : ${roomtype} 
                                                                            </h6>
                                                                        </div>
                                                                        <h6 class="customized">${bedsAvailable} beds available </h6>
                                                                        <!--<p>
                                                                            Air Condition : ${ac}
                                                                        </p>
                                                                        <p>
                                                                            Bathroom : ${bathroom}
                                                                        </p>
                                                                        <p>
                                                                            Amenities : ${amenities}
                                                                        </p>-->
                                                                        <p>
                                                                            Room Description : ${roomtype}, with A/C and Non A/C occupation.
                                                                        </p>
                                                                    </div>
                                                                    <div class="product-box-price">
                                                                        <!--<h2 class="theme-color fw-semibold">
                                                                            Rs.${roomprice}
                                                                        </h2>-->
                                                                        <a 
                                                                            class="btn theme-outline add-btn mt-0"
                                                                            >Details</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>`;

    // To add click event to the card
    elem.dataset.roomType = roomtype;
    elem.dataset.roomPrice = roomprice;
    elem.dataset.ac = ac;
    elem.dataset.bedsAvailable = bedsAvailable;
    elem.dataset.roomFloor = floor;
    elem.dataset.roomNumber = roomNumber;
    // elem.addEventListener('click', handleCardClick);
    elem.addEventListener('click', showRoomDetails);

    postContainer.appendChild(elem);
}
function showRoomDetails(event) {
    document.getElementById("floorDiv").style.display = "none";
    document.getElementById("transition_loader").style.display = "flex";
    setTimeout(() => {
        document.getElementById("roomDiv").style.display = "block";
        document.getElementById("roomDivFilters").style.display = "block";
        document.getElementById("transition_loader").style.display = "none";
    }, 1000);
    const card = event.currentTarget;
    var checkboxes = document.getElementsByName("floorCheckBox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].disabled = true;
        //without using filter, directly if user selects the room , clicked type n floor numb will get auto-checked n disabled.
        if (checkboxes[i].value == card.dataset.roomFloor) {
            checkboxes[i].checked = true;
        }
    }
    var checkboxes = document.getElementsByName("sharingCheckBox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].disabled = true;
        //without using filter, directly if user selects the room , clicked type n floor numb will get auto-checked n disabled.
        if (checkboxes[i].value == card.dataset.roomType) {
            checkboxes[i].checked = true;
        }
    }
    loadRoomCards(card.dataset.roomFloor, card.dataset.roomType, card.dataset.bedsAvailable);
}

let acRooms;
let nonAcRooms;
let global_floor_number;
let global_room_type;
let global_total_room_bedsAvailable;
const postContainerRoom = document.getElementById('item-5');
function loadRoomCards(floorNumber, roomType, total_room_bedsAvailable) {
    if (document.getElementById("no_bed_msg").style.display == 'flex') {
        document.getElementById("no_bed_msg").style.display = "none";
    }
    global_floor_number = floorNumber;
    global_room_type = roomType;
    global_total_room_bedsAvailable = total_room_bedsAvailable;
    const dbref = ref(db, 'Hostel details/' + hostelName + "/rooms/floor" + floorNumber + '/' + roomType + '/');
    onValue(dbref, (snapshot) => {
        acRooms = snapshot.val().rooms.ac;
        nonAcRooms = snapshot.val().rooms.non_ac;
    })
    console.log(acRooms, nonAcRooms)
    postContainerRoom.innerHTML = '';//erasing the previous cards, and loading all from first.
    for (let key in acRooms) {
        let room = acRooms[key];
        let beds = room.beds;
        let imageArray = [];//initializing images array for every iteration, then only images for that particular rooms will display.
        if (room.imagesLink != undefined) {
            room.imagesLink.forEach(j => {
                imageArray.push(j);
                addImageCard(j);
            })
        }
        loadBedCard(floorNumber, roomType, key, imageArray[0], room.price, room.ac, room.bathroom, room.amenities, room.bedsAvailable, beds);
    }
    for (let key in nonAcRooms) {
        let room = nonAcRooms[key];
        let beds = room.beds;
        if (room.imagesLink != undefined) {
            room.imagesLink.forEach(j => {
                imageArray.push(j);
                addImageCard(j);
            })
        }
        loadBedCard(floorNumber, roomType, key, imageArray[0], room.price, room.ac, room.bathroom, room.amenities, room.bedsAvailable, beds);
    }
    // fetchRoomCards('Hostel details/' + hostelName + "/rooms/floor"+floorNumber+'/'+roomType+'/');
}



function loadBedCard(floorNumber, roomType, key, imgURL, roomprice, ac, bathroom, amenities, bedsAvailable, beds) {
    const elem = document.createElement('div');
    elem.setAttribute('id', key);
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
                                                                             Floor:${floorNumber}, Room No: ${key}
                                                                            </h6>
                                                                        </div>
                                                                        <h6 class="customized">${bedsAvailable} beds available </h6>
                                                                        <p>
                                                                            Room Detail: ${ac}, ${roomType}
                                                                        </p>
                                                                        <p>
                                                                            Bathroom : ${bathroom}
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
    elem.dataset.roomType = roomType;
    elem.dataset.roomPrice = roomprice;
    elem.dataset.ac = ac;
    elem.dataset.bedsAvailable = bedsAvailable;
    elem.dataset.roomFloor = floorNumber;
    elem.dataset.roomNumber = key;
    elem.addEventListener('click', handleCardClick);

    postContainerRoom.appendChild(elem);
}

/**
 * 
 * @param {*} event - click event on room card
 * function gets triggered when room card is clicked. 
 */
async function handleCardClick(event) {
    const card = event.currentTarget;
    const hostelRoomType = card.dataset.roomType;
    let roomDetails = card.dataset.roomType + "-" + card.dataset.roomPrice + "-" + card.dataset.bedsAvailable + "-" + card.dataset.roomFloor + "-" + card.dataset.roomNumber + "-" + card.dataset.ac + '-' + global_total_room_bedsAvailable;
    localStorage.setItem("room-details", roomDetails);
    let ac = card.dataset.ac == 'ac' ? 'ac' : 'non_ac';
    const dbref = ref(db, 'Hostel details/' + hostelName + '/rooms/' + "floor" + card.dataset.roomFloor + '/' + card.dataset.roomType + '/rooms/' + ac + '/' + card.dataset.roomNumber);
    let availableCount = 0;
    let room;
    await onValue(dbref, (snapshot) => {
        console.log(JSON.stringify(snapshot))
        console.log(snapshot.val().bedsAvailable)
        availableCount = snapshot.val().bedsAvailable;
        room = snapshot.val();
    })
    if (availableCount > 0) {
        document.getElementById("no-bed-msg").style.display = 'none';
        if (localStorage.getItem('bedCount') != 0) {
            for (i = 1; i <= localStorage.getItem('bedCount'); i++) {
                let cardId = 'bed ' + i;
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
                addBed(i, roomDetails);
            }
        }
    }
    else {
        document.getElementById("no-bed-msg").style.display = 'block';
        alert("Sorry, No beds available");
    }
}

/**
 * 
 * @param {*} i - counter of the bed
 * Bed card is added dynamically based on the Room's bed count clicked by user.
 */
function addBed(i, roomDetails) {
    roomDetails = roomDetails.split('-')
    const dbref = ref(db, 'Hostel details/' + hostelName + '/rooms/' + "floor" + roomDetails[3] + '/' + roomDetails[0] + '/rooms/' + roomDetails[5] + '/' + roomDetails[4] + '/beds/');
    let hostelBedAvailability = []
    onValue(dbref, (snapshot) => {
        hostelBedAvailability = [];
        snapshot.forEach(iterator => {
            hostelBedAvailability.push(iterator.val());
        })
    })
    const parentContainer = document.getElementById('bedParent');
    const elem = document.createElement('div');
    elem.classList.add('card');
    elem.style.cursor = "pointer";
    elem.style.backgroundColor = "white";

    //if room is already booked, then blocking the user not to select the room.
    if (hostelBedAvailability[i - 1] == 'booked') {
        elem.style.backgroundColor = "#FF7F7F";
        elem.style.pointerEvents = "none";
    }

    let bedId = 'bed ' + i;
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
        let bedId2 = 'bed ' + i;
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
/**
 * 
 * @param {*} event - click event on room card
 * function gets triggered when room card is clicked. 
 */
async function handleCardClick2(event) {
    const card = event.currentTarget;
    const hostelRoomType = card.dataset.roomType;
    let roomDetails = card.dataset.roomType + "-" + card.dataset.roomPrice + "-" + card.dataset.bedsAvailable + "-" + card.dataset.roomFloor + "-" + card.dataset.roomNumber + "-" + card.dataset.ac;
    localStorage.setItem("room-details", roomDetails);
    const dbref = ref(db, 'Hostel details/' + hostelName + '/rooms/' + "floor" + card.dataset.roomFloor + '/' + card.dataset.roomType);
    let clickedCardRoomDetails;
    let availableCount = 0;
    await onValue(dbref, (snapshot) => {
        clickedCardRoomDetails = snapshot.val().rooms;
        availableCount = snapshot.val().bedsAvailable;
    })
    if (availableCount > 0) {
        document.getElementById("no-bed-msg").style.display = 'none';
        const parentContainer = document.getElementById('bedParent');
        parentContainer.innerHTML = '';
        // if (localStorage.getItem('bedCount') != 0) {
        //     for (i = 1; i <= localStorage.getItem('bedCount'); i++) {
        //         let cardId = 'bed ' + i;
        //         document.getElementById(cardId).remove();
        //     }
        //     localStorage.setItem('bedCount', 0);
        // }

        // Using match with regEx

        //need for regex since when user clicks on room , 
        //the room type is "2 Sharing","3 Sharing","10 Sharing" to extract the number from the string we use REGEX.
        let matches = hostelRoomType.match(/(\d+)/);
        // Display output if number extracted
        if (matches) {
            let bedCount = parseInt(matches[0]);
            localStorage.setItem("bedCount", bedCount);
            hostelRoomCount = card.dataset.roomCount
            for (let key in clickedCardRoomDetails) {

                const roomParentDiv = document.createElement("div");
                roomParentDiv.id = "room - " + key[(key.length) - 1];
                const heading = document.createElement("h5");
                heading.innerHTML = "Room - " + key[(key.length) - 1];
                heading.style = "padding-bottom:5px;"
                roomParentDiv.appendChild(heading);

                const roomDiv = document.createElement("div");
                roomDiv.style = "display: grid;gap: 20px;grid-template-columns:1fr 1fr 1fr;"
                for (i = 1; i <= bedCount; i++) {
                    const cardDiv = addBed2(key[(key.length) - 1], i, roomDetails, roomDiv);
                    roomDiv.appendChild(cardDiv);
                }
                roomParentDiv.appendChild(roomDiv);
                parentContainer.appendChild(roomParentDiv);
            }
        }
    }
    else {
        document.getElementById("no-bed-msg").style.display = 'block';
        alert("Sorry, No beds available");
    }
}

/**
 * 
 * @param {*} i - counter of the bed
 * Bed card is added dynamically based on the Room's bed count clicked by user.
 */
function addBed2(roomNumber, i, roomDetails) {
    roomDetails = roomDetails.split('-')
    const dbref = ref(db, 'Hostel details/' + hostelName + '/rooms/' + "floor" + roomDetails[3] + '/' + roomDetails[0] + '/rooms/room' + roomNumber + '/beds/');
    let hostelBedAvailability = []
    onValue(dbref, (snapshot) => {
        hostelBedAvailability = [];
        snapshot.forEach(iterator => {
            hostelBedAvailability.push(iterator.val());
        })
    })
    // const parentContainer = document.getElementById('bedParent');
    const elem = document.createElement('div');
    elem.classList.add('card');
    elem.style.cursor = "pointer";
    elem.style.backgroundColor = "white";

    //if room is already booked, then blocking the user not to select the room.
    if (hostelBedAvailability[i - 1] == 'booked') {
        elem.style.backgroundColor = "#FF7F7F";
        elem.style.pointerEvents = "none";
    }

    let bedId = 'room' + roomNumber + '-bed' + i;
    elem.setAttribute("id", bedId);
    elem.innerHTML = `<div class="card-body">Bed ${i}</div>`;
    elem.dataset.bedId = bedId;
    elem.addEventListener('click', bedSelection2);
    return elem;
    // roomDiv.appendChild(elem);
    // const parentContainer = document.getElementById('room'+roomNumber);
    // parentContainer.appendChild(roomDiv);

}

/**
 * 
 * @param {*} event
 * WHen user selects a bed , this function is triggered. 
 */
function bedSelection2(event) {
    const bed = event.currentTarget;
    let bedId;
    bedId = bed.dataset.bedId;
    console.log("inside bed click")
    for (let ro = 1; ro <= hostelRoomCount; ro++) {
        for (i = 1; i <= localStorage.getItem('bedCount'); i++) {
            let bedId2 = 'room' + ro + 'bed' + i;
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
            bedId = bedId.split('-');
            document.getElementById("cart-bed-number").innerHTML = "Room- " + bedId[0] + "<br> Bed- " + bedId[1];
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
        window.location.href = "././checkout-2.html";
    }
    else {
        alert("select an bed to book");
    }
})
proceedPaymentBtn.addEventListener('click', (e) => {
    if (localStorage.getItem("bedId") != 0) {
        window.location.href = "././checkout-2.html";
    }
    else {
        alert("select an bed to proceed payment");
    }
})

window.addEventListener('load', loadDataFromDB);
window.addEventListener('load', clearCheckboxes);

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
    var checkboxes = document.getElementsByName("sharingCheckBox");
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            roomTypeFilterValue.push(checkboxes[i].value);
        }
    }
    console.log(roomTypeFilterValue)
    if (roomTypeFilterValue.length > 0) {
        applyMainRoomFilters();
    }
    else {
        console.log("No Filter");
        applyMainRoomFilters();
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

    clearCheckboxes();

    document.getElementById("roomDiv").style.display = "none";
    document.getElementById("floorDiv").style.display = "none";
    document.getElementById("transition_loader").style.display = "flex";
    setTimeout(() => {
        document.getElementById("floorDiv").style.display = "block";
        document.getElementById("transition_loader").style.display = "none";
        document.getElementById("roomDivFilters").style.display = "none";

    }, 1000);

    roomFloorFilterValue = [];
    roomTypeFilterValue = [];
    airConditionFilterValue = [];
    bathroomFilterValue = [];

    applyFilters();
});
function clearCheckboxes() {
    console.log('..inside clearing checkbox')
    var checkboxes = document.getElementsByName("floorCheckBox");
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        checkboxes[i].disabled = false;
    }

    var checkboxes = document.getElementsByName("sharingCheckBox");
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        checkboxes[i].disabled = false;
    }

    var checkboxes = document.getElementsByName("acCheckBox");
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }

    var checkboxes = document.getElementsByName("bathroomCheckBox");
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}
function applyFilters() {
    var data_filter = [];
    console.log("Room Floor Filters - " + roomFloorFilterValue.length + " Room Type Filters - " + roomTypeFilterValue.length + " AC filters - " + airConditionFilterValue.length + " Bathroom filter - " + bathroomFilterValue.length);
    if (airConditionFilterValue.length == 0 && bathroomFilterValue.length == 0) {
        loadRoomCards(global_floor_number, global_room_type);
    }
    else {
        data_filter = [];
        //iterating ac rooms and pushing it to data_filter array.
        if (acRooms != null && acRooms != undefined) {
            for (let key in acRooms) {
                console.log(acRooms[key])
                data_filter.push(acRooms[key])
            }
        }
        //iterating ac rooms and pushing it to data_filter array.
        if (nonAcRooms != null && nonAcRooms != undefined) {
            for (let key in nonAcRooms) {
                console.log(nonAcRooms[key])
                data_filter.push(nonAcRooms[key])
            }
        }
        console.log(data_filter);
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
        if (airConditionFilterValue.length != 0 || bathroomFilterValue.length != 0) {
            //Adding fitler relevant room cards data.
            var i = 0;
            postContainerRoom.innerHTML = '';
            data_filter.forEach(iterator => {
                let imageArray = [];//initializing images array for every iteration, then only images for that particular rooms will display.
                i++;
                if (iterator.imagesLink != undefined) {
                    iterator.imagesLink.forEach(j => {
                        imageArray.push(j);
                        // addImageCard(i);
                    })
                }
                loadBedCard(iterator.floor, iterator.roomType, 'room' + iterator.roomNumber, imageArray[0], iterator.price, iterator.ac, iterator.bathroom, iterator.amenities, iterator.bedsAvailable, iterator.beds);

            });
            localStorage.setItem("total_filter_length", i);
            if (data_filter.length == 0) {
                document.getElementById("no_bed_msg").style.display = "flex";
                document.getElementById("no_bed_msg").style.justifyContent = "center";
                document.getElementById("no_bed_msg").style.alignItems = "center";
            }
            else {
                if (document.getElementById("no_bed_msg").style.display == 'flex') {
                    document.getElementById("no_bed_msg").style.display = "none";
                }
            }

        }
        else {
            loadRoomCards(global_floor_number, global_room_type);
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

// /** Dynamic Checkboxes are loaded based on the HosteFloor count for paritcular hostel - starts here */
// function clearFloorFilters() {
//     roomFloorFilterValue = [];
//     var checkboxes = document.getElementsByName("floorCheckBox");
//     // loop over them all
//     for (var i = 0; i < checkboxes.length; i++) {
//         // And stick the checked ones onto an array...
//         if (checkboxes[i].checked) {
//             checkboxes[i].checked = false;
//         }
//         checkboxes[i].disabled = false;
//     }

//     var checkboxes = document.getElementsByName("sharingCheckBox");
//     // loop over them all
//     for (var i = 0; i < checkboxes.length; i++) {
//         // And stick the checked ones onto an array...
//         if (checkboxes[i].checked) {
//             checkboxes[i].checked = false;
//         }
//         checkboxes[i].disabled = false;
//     }

// }

function applyMainRoomFilters() {
    var data_filter = [];
    console.log("Room Floor Filters - " + roomFloorFilterValue.length + " Room Type Filters - " + roomTypeFilterValue.length + " AC filters - " + airConditionFilterValue.length + " Bathroom filter - " + bathroomFilterValue.length);
    if (roomFloorFilterValue.length == 0 && roomTypeFilterValue.length == 0) {
        loadDataFromDB();
    }
    else {
        data_filter = hostelist;
        console.log(data_filter)
        if (roomFloorFilterValue.length != 0) {
            roomFloorFilterValue.forEach(filterValue => {
                data_filter = data_filter.filter(element =>
                    element.floor == filterValue
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
        if (roomFloorFilterValue.length != 0 || roomTypeFilterValue.length != 0) {
            //Adding fitler relevant room cards data.
            var i = 0;
            postContainer.innerHTML = '';
            data_filter.forEach(iterator => {
                let imageArray = [];//initializing images array for every iteration, then only images for that particular rooms will display.
                i++;
                if (iterator.imagesLink != undefined) {
                    iterator.imagesLink.forEach(j => {
                        imageArray.push(j);
                        // addImageCard(i);
                    })
                }
                addHostelRoomCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor, iterator.price, iterator.roomType, iterator.bedsAvailable, imageArray[0], i, iterator.rooms)
            });
            localStorage.setItem("total_filter_length", i);
            console.log('nnnnn')
            if (data_filter.length == 0) {
                console.log("uesssss")
                document.getElementById("no_room_msg").style.display = "flex";
                document.getElementById("no_room_msg").style.justifyContent = "center";
                document.getElementById("no_room_msg").style.alignItems = "center";
            }
            else {
                console.log('nooo')
                document.getElementById("no_room_msg").style.display = "none";
            }

        }
        else {
            loadDataFromDB();
        }
    }
}

/**
 * When floor filter is checked, this function will trigger to check.
 * which checked boxes are checked and will push it to the array.
 * @returns 
 */
function getCheckedBoxes() {
    roomFloorFilterValue = [];
    var checkboxes = document.getElementsByName("floorCheckBox");
    var checkboxesChecked = [];
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i]);
            roomFloorFilterValue.push(checkboxes[i].value);
        }
    }
    applyMainRoomFilters();//calls the filter method , for the selected checkboxes in floor filters.
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

/**
 * Function dynamically create the checkboxes and append it to the filter section.
 * @param {*} floorCount 
 */
function loadCheckboxesForFilter(floorCount) {
    let ulContainer = document.getElementById("floorFilters");
    roomFloorFilterValue = [];
    if (floorCount > 0) {
        document.getElementById('noFloorFilterMsg').style.display = "none";
        for (var i = 1; i <= floorCount; i++) {
            //creating li element
            let libox = document.createElement('li');
            libox.style.display = "flex";
            libox.style.gap = "8px";

            // creating checkbox element
            let checkbox = document.createElement('input');

            // Assigning the attributes and click event for the created checkbox
            checkbox.type = "checkbox";
            checkbox.name = "floorCheckBox";
            checkbox.value = String(i);
            checkbox.id = "item_1_" + String(i) + "_checkbx";
            checkbox.addEventListener('click', getCheckedBoxes);

            // creating label for checkbox
            let label = document.createElement('label');

            // assigning attributes for the created label tag 
            label.htmlFor = checkbox.id;
            label.style.color = "rgba(var(--content-color), 0.9)";

            // appending the created text to 
            // the created label tag 
            label.appendChild(document.createTextNode(String(i)));

            libox.appendChild(checkbox);
            libox.appendChild(label);
            ulContainer.appendChild(libox);
        }
    }
    else {
        //when there is no floor count, empty message will be displayed.
        document.getElementById('noFloorFilterMsg').style.display = "block";
    }
}
/**
 * Function which loads initially to fetch the hostel floor number count.
 */
async function loadFloorCountForCheckBoxes() {
    console.log("..inside load checkboxes")
    const dbref = ref(db, 'Hostel details/' + hostelName);
    try {
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            hosteFloorCount = snapshot.val().hostelFloors;
            loadCheckboxesForFilter(hosteFloorCount);//function is called to dynamically create the checkbox.
        } else {
            console.log('No floor count.');
        }
    } catch (error) {
        console.error('Error fetching floor:', error);
    }
}

window.addEventListener('load', loadFloorCountForCheckBoxes);
/** Dynamic Checkboxes are loaded based on the HosteFloor count for paritcular hostel - ends here */
