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
let availableSharingTypes = [];
let checkinDate = localStorage.getItem("checkIn-date");

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
                                    <img class="img-fluid bg-img"
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
    const slider = document.getElementById('priceSlider');
    const priceDisplay = document.getElementById('price');
    priceDisplay.innerHTML = 15000;

    // Update the displayed price whenever the slider value changes
    slider.addEventListener('input', function () {
        priceDisplay.innerHTML = slider.value;
    });
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

            document.getElementById("transition_loader").style.display = "flex";
            setTimeout(() => {
                document.getElementById("transition_loader").style.display = "none";
                loadRoom(roomsData);
            }, 800);
        }
        //clearing the sharing checkbox, because if we maintain this code, after using navigation back from checkout page, 
        //sharing checkbox is checked , fix for it.
        var checkboxes = document.getElementsByName("sharingCheckBox");
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
            checkboxes[i].disabled = false;
        }


        // iterateAllRecords();
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
        loadRoom(hostelist);
        // addHostelRoomCard(iterator.ac, iterator.amenities, iterator.bathroom, iterator.floor, iterator.price, iterator.roomType, iterator.bedsAvailable, imageArray[0], i, iterator.rooms)
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

document.getElementById('applyFilters').addEventListener('click', applyFilters2);

    function applyFilters2() {
        postContainer.innerHTML='';
        document.getElementById("no_room_msg").style.display = "none";
      /*const filterSelectFloor = document.getElementById('floorFilter');
      const filterSelectSharing = document.getElementById('sharingTypeFilter');
      const filterSelectAC = document.getElementById('acFilter');
      const filterSelectBathroom = document.getElementById('bathroomFilter');
      const filterInputPrice = document.getElementById('priceSlider');*/

      if (filters.floor.value == '' && filters.sharing.value == '' && filters.ac.value == '' && filters.bathroom.value == '' && Number(filters.price.value) == 15000) {
        document.getElementById("clearFiltersBtn").style.display = "none";
      }
      else{
        document.getElementById("clearFiltersBtn").style.display = "inline";
      }
      // } else {
        const dbref = ref(db, 'Hostel details/' + hostelName + "/rooms/");
        onValue(dbref, (snapshot) => {
                let roomsData = snapshot.val();
    
            if (roomsData != undefined || roomsData != null) {
                const filteredData = filterRooms(roomsData);
                console.log('Filtered data ', filteredData);
                document.getElementById("transition_loader").style.display = "flex";
                setTimeout(() => {
                    document.getElementById("transition_loader").style.display = "none";
                    loadRoom(filteredData);
                }, 800);
            }
        })    

      //}

    }

const filters = {
    floor: document.getElementById('floorFilter'),
    sharing: document.getElementById('sharingTypeFilter'),
    ac: document.getElementById('acFilter'),
    bathroom: document.getElementById('bathroomFilter'),
    price: document.getElementById('priceSlider'),
};

function filterRooms(data) {
    let filteredData = {};//common filtered object which contains all the relevant values based on the filters.

    //floor and sharing based filters are handled here
    Object.keys(data).forEach(floorKey => {
        const floor = data[floorKey];
        let filteredSharing = {};
        Object.keys(floor).forEach(sharingKey => {
            const sharing = floor[sharingKey];

            let passesFilters = (
                (!filters.floor.value || filters.floor.value === floorKey) &&
                (!filters.sharing.value || filters.sharing.value === sharingKey) 
            );

            // console.log(passesFilters,filters.price.value)

                if(passesFilters){
                    if(sharing.rooms.ac != undefined){
                        Object.keys(sharing.rooms.ac).forEach(roomKey => {
                            let room = sharing.rooms.ac[roomKey];
                            console.log(room.price)
                                if (Number(room.price) <= Number(filters.price.value)) {
                                    passesFilters = true;
                                }
                                else {
                                    passesFilters = false;
                                }
                        })
                    }
                    if(sharing.rooms.non_ac != undefined){
                       Object.keys(sharing.rooms.non_ac).forEach(roomKey => {
                            let room = sharing.rooms.non_ac[roomKey];
                                if (Number(room.price) <= Number(filters.price.value)) {
                                    passesFilters = true;
                                }
                                else {
                                    passesFilters = false;
                                }
                        })
                    }
                }
                
            if (passesFilters) {
                filteredSharing[sharingKey] = sharing;
            }
        });
        if (Object.keys(filteredSharing).length > 0) {
            filteredData[floorKey] = filteredSharing;
        }
    });

    console.log(Object.keys(filteredData).length);
    let emptySet = 0;
    //room based filters are done here, eg:bathroom, ac options filters are handled here.
    Object.keys(filteredData).forEach(floorKey => {
        const floor = data[floorKey];
         emptySet = 0;
        Object.keys(floor).forEach(sharingKey => {  
            const sharing = floor[sharingKey];
            // console.log(sharing.rooms)
            Object.keys(sharing.rooms).forEach(key => {
                const rooms = sharing.rooms[key];
                const roomData = {rooms:{ac:{},non_ac:{}}};
                let bedsAvailableforFilterEachFloor = 0;
                Object.keys(rooms).forEach(roomkey => {
                    console.log(bedsAvailableforFilterEachFloor)
                    const room = sharing.rooms[key][roomkey];
                    let passFilter = (!filters.ac.value || room.ac.toLowerCase() == filters.ac.value.toLowerCase()) &&
                        (!filters.bathroom.value || room.bathroom.toLowerCase() == filters.bathroom.value.toLowerCase());
                    if (passFilter) {
                        roomData.rooms[key][roomkey] = room;
                        // console.log(room.bedsAvailable);

                        //variable used to calculate the beds available value shown in the sharing card level
                        bedsAvailableforFilterEachFloor += Number(room.bedsAvailable);
                        //that value is updated inside the filtered obj, so that dynamically the beds available count wll be mapped.
                        filteredData[floorKey][sharingKey].bedsAvailable = bedsAvailableforFilterEachFloor;
                    }
                });
                filteredData[floorKey][sharingKey].rooms[key] = roomData.rooms[key];
            });

            //condition to calculate the emptyset of the rooms if available inside ac and non_ac parents
            //this emptyset variable will be checked if there is no rooms or rooms present inside the ac & non_ac parents.
            if (Object.keys(filteredData[floorKey][sharingKey].rooms.ac).length == 0
                && Object.keys(filteredData[floorKey][sharingKey].rooms.non_ac).length == 0) {
                emptySet++;
            }
        });
    });

    //if the emptyset variable is exactly same as the length of the floor, it seems to be no rooms 
    //matched the given filter condition, so we will be setting the entire filteredobj to empty.
    if (Object.keys(filteredData).length == emptySet) {
        filteredData = {};
    }
    console.log(filteredData);
    return filteredData;
}
    document.getElementById('clearFiltersBtn').addEventListener('click',()=>{
        clearFilters();
    })
function loadRoom(data){
    if(JSON.stringify(data) != '{}'){
        document.getElementById("no_room_msg").style.display = "none";
        postContainer.innerHTML = '';
     Object.keys(data).forEach(floorKey => {
        const floor = data[floorKey];
        Object.keys(floor).forEach(sharingKey => {
          const sharing = floor[sharingKey];
          const listItem = document.createElement('div');
          listItem.className = 'list-item';
          let collapsable_id = 'floor'+sharing.floor+"-"+(sharing.roomType.replace(' ','-'))+"-collapse"
          listItem.innerHTML = `
                                <div class="product-details-box">
                                  <div class="product-img">
                                      <img class="img-fluid img"
                                          src="${sharing.imagesLink ? sharing.imagesLink[0] : ''}" alt="no_room_img">
                                  </div>
                                  <div class="product-content">
                                      <div
                                          class="description d-flex align-items-center justify-content-between gap-1">
                                          <div>
                                              <div class="d-flex align-items-center gap-2">
                                                  <h6 class="product-name">
                                                      Floor No: ${sharing.floor},<br> Room Type : ${sharing.roomType} 
                                                  </h6>
                                              </div>
                                              <h6 class="customized">${sharing.bedsAvailable} beds available </h6>
                                              <!--<p>
                                                  Air Condition : ${sharing.ac}
                                              </p>
                                              <p>
                                                  Bathroom : ${sharing.bathroom}
                                              </p>
                                              <p>
                                                  Amenities : ${sharing.amenities}
                                              </p>-->
                                              <p>
                                                  Room Description : ${sharing.roomType}, with A/C and Non A/C occupation.
                                              </p>
                                          </div>
                                          <div class="product-box-price">
                                          <h6 class="theme-color fw-semibold">
                                                                        ${sharing.nonacPrice=='' || sharing.nonacPrice==undefined ? '':"Rs."+sharing.nonacPrice}${((sharing.acPrice!= '' && sharing.acPrice!=undefined) && (sharing.nonacPrice!='' && sharing.nonacPrice!=undefined)) ? '-':""} ${sharing.acPrice== '' || sharing.acPrice==undefined? '':"Rs."+sharing.acPrice } 
                                                                        </h6>
                                              <button type='button' data-bs-toggle="collapse" data-bs-target="#${collapsable_id}" 
                                                  aria-expanded="false"
                                                  class="btn theme-outline add-btn mt-0"
                                                  >Details</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
            
                        <div class="collapse" id="${collapsable_id}">
                          <div class="rooms">
                            <div class="room-grid">
                                ${Object.keys(sharing.rooms).map(roomKey => {
                                const room = sharing.rooms[roomKey];
                                return Object.keys(room).map(roomNumber => {
                                  const roomDetails = room[roomNumber];
                                  return `
                                            <div class="room">
                                                <h5 style="display: inline-block; padding: 10px 20px; background-color: #fec495; color: black; border-radius: 8px; font-weight: bold; text-align: center;">
                                                  Room ${roomDetails.roomNumber}
                                                </h5>
                                                <img src="${roomDetails.imagesLink ? roomDetails.imagesLink[0] : ''}" alt="Room Image">
                                                <p>
                                                  ${roomDetails.ac === 'ac'
                                                      ? ` <svg width="16px" height="16px" viewBox="0 0 1024 1024" fill="#FC8019" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M383.2 941.6c-4 0-6.4-0.8-9.6-2.4-14.4-9.6-82.4-60-25.6-160 15.2-27.2 19.2-48.8 13.6-66.4-6.4-20-27.2-28-27.2-28-9.6-4-14.4-15.2-10.4-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 3.2 0 36.8 14.4 50.4 50.4 10.4 28.8 4.8 62.4-16.8 100-40 70.4 2.4 101.6 11.2 107.2 8.8 4.8 12 16.8 7.2 26.4-4.8 6.4-12 8.8-17.6 8.8z m129.6-42.4c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16 47.2 48 9.6 27.2 4.8 58.4-15.2 92.8-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4.8 6.4-12 8.8-17.6 8.8z m-265.6 0c-4 0-6.4-0.8-9.6-2.4-28.8-16.8-69.6-68.8-24-150.4 13.6-24.8 17.6-44.8 12-60-5.6-17.6-24-24.8-24-24.8-10.4-4-15.2-14.4-11.2-24.8 3.2-8 9.6-12.8 17.6-12.8 2.4 0 4.8 0.8 7.2 1.6 8 3.2 36 16.8 47.2 48 9.6 27.2 4 58.4-15.2 93.6-38.4 68.8 8 96.8 10.4 97.6 4 2.4 7.2 6.4 8.8 11.2 1.6 4.8 0.8 10.4-1.6 15.2-4 5.6-12 8-17.6 8z m487.2-71.2c-6.4 0-11.2-2.4-15.2-6.4s-6.4-9.6-6.4-15.2c0-8.8 5.6-16.8 13.6-20.8h0.8v-43.2l-40.8 23.2v0.8c0 6.4-2.4 14.4-10.4 18.4-3.2 2.4-7.2 3.2-11.2 3.2-8 0-15.2-4-18.4-10.4-3.2-5.6-4-11.2-2.4-16.8 1.6-5.6 4.8-10.4 10.4-12.8 3.2-2.4 7.2-3.2 10.4-3.2 4 0 8 0.8 11.2 3.2l36.8-20.8-36-20.8c-4.8 1.6-8.8 2.4-12 2.4-4 0-7.2-0.8-10.4-2.4-9.6-6.4-13.6-20-8-29.6 4-6.4 11.2-10.4 19.2-10.4 4 0 8 0.8 11.2 3.2 6.4 4 10.4 10.4 10.4 18.4v0.8L728 712v-43.2h-0.8c-8-4-13.6-12-13.6-20.8 0-12 9.6-21.6 21.6-21.6 6.4 0 12 2.4 16 6.4s6.4 9.6 6.4 15.2c0 7.2-4 14.4-11.2 18.4H744v41.6l35.2-20v-0.8c0-6.4 2.4-14.4 10.4-18.4 3.2-2.4 7.2-3.2 11.2-3.2 8 0 15.2 4 18.4 10.4 3.2 5.6 4 11.2 2.4 16.8-1.6 5.6-4.8 10.4-10.4 12.8-3.2 2.4-7.2 3.2-10.4 3.2-4 0-8-0.8-11.2-3.2l-36.8 20.8 36 20.8c4.8-1.6 8.8-2.4 12-2.4 4 0 7.2 0.8 10.4 2.4 9.6 6.4 13.6 20 8 29.6-4 6.4-11.2 10.4-19.2 10.4-4 0-8-0.8-11.2-3.2-6.4-4-10.4-10.4-10.4-18.4v-0.8L744 745.6v41.6h0.8c7.2 3.2 11.2 10.4 11.2 18.4 0 12.8-9.6 22.4-21.6 22.4zM152 575.2c-60.8 0-109.6-48.8-109.6-109.6V204.8c0-60.8 48.8-109.6 109.6-109.6h721.6c60.8 0 109.6 48.8 109.6 109.6v260.8c0 60.8-48.8 109.6-109.6 109.6H152z m-11.2-432c-28.8 0-52 24-52 54.4v278.4c0 29.6 23.2 54.4 52 54.4h743.2c28.8 0 52-24 52-54.4V197.6c0-29.6-23.2-54.4-52-54.4H140.8z m21.6 312c-10.4 0-19.2-8.8-19.2-19.2 0-10.4 8.8-19.2 19.2-19.2h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z m0-80.8c-10.4 0-19.2-8.8-19.2-19.2S152 336 162.4 336h682.4c10.4 0 19.2 8.8 19.2 19.2 0 10.4-8.8 19.2-19.2 19.2H162.4z" fill=""></path></g></svg>`
                                                      : ` <svg fill="#FC8019" height="16px" width="16px" version="1.1" id="XMLID_108_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="fan"> <g> <path d="M5.4,22.8L5.4,22.8c-0.9,0-1.7-0.4-2.3-1c-0.7-0.7-1.3-1.5-1.8-2.4c-0.4-0.8-0.8-1.6-1-2.4c-0.3-0.9-0.2-1.9,0.3-2.6 C1,13.7,1.7,13.2,2.4,13c1.1-0.3,2.1-0.5,3.1-0.8l1.8-0.5c0.2-0.5,0.5-1,0.9-1.5L6.8,5.3C6.6,4.5,6.7,3.7,7.1,3 c0.4-0.7,1.2-1.3,2-1.5c0.9-0.2,1.9-0.4,3-0.3c0.9,0,1.8,0.1,2.6,0.3c0.9,0.2,1.7,0.8,2.1,1.5c0.4,0.7,0.5,1.5,0.3,2.3l-1.4,4.9 c0.4,0.4,0.7,0.9,0.9,1.5l4.9,1.3c0.8,0.2,1.5,0.7,1.9,1.4c0.4,0.8,0.5,1.6,0.3,2.5c-0.3,1-0.7,1.9-1.2,2.7s-1,1.5-1.6,2.1 c-0.6,0.7-1.5,1.1-2.4,1.1c0,0,0,0-0.1,0c-0.8,0-1.6-0.3-2.1-0.9l-3.6-3.7c-0.5,0.1-1.1,0.1-1.6,0l-3.6,3.7 C7,22.5,6.2,22.8,5.4,22.8z M7,13.7L6,14c-1,0.3-2.1,0.5-3.1,0.8c-0.3,0.1-0.5,0.3-0.6,0.5c-0.2,0.3-0.2,0.7-0.1,1.1 c0.2,0.7,0.5,1.4,0.9,2c0.4,0.7,0.9,1.4,1.5,2c0.3,0.3,0.6,0.4,0.9,0.4c0.2,0,0.5-0.1,0.7-0.3l3.1-3.1C8,16.6,7.2,15.3,7,13.7z M14.8,17.4l3,3.1c0.2,0.2,0.5,0.3,0.7,0.3c0.3,0,0.7-0.2,1-0.5c0.5-0.5,1-1.1,1.3-1.8c0.4-0.7,0.7-1.5,1-2.3 c0.1-0.3,0.1-0.7-0.1-1c-0.1-0.2-0.4-0.4-0.6-0.5l-4.1-1C16.8,15.3,16,16.6,14.8,17.4z M12,10.3c-1.7,0-3,1.3-3,3s1.3,3,3,3 s3-1.3,3-3S13.7,10.3,12,10.3z M12,3c-0.8,0-1.6,0.1-2.4,0.3C9.2,3.4,9,3.6,8.8,3.9C8.7,4.1,8.6,4.4,8.7,4.7l1.1,4.1 c1.3-0.6,3-0.6,4.3,0l1.1-4.1c0.1-0.3,0-0.6-0.1-0.8c-0.1-0.3-0.4-0.5-0.8-0.6C13.6,3.1,12.9,3,12.1,3H12z"></path> </g> </g> </g></svg>`}
                                                    ${roomDetails.ac.replace('non_ac','Non-AC').replace('non-ac', 'Non-AC').replace('ac', 'AC')} <br>    
                                                    ${roomDetails.bathroom === 'attached' ?
                                                    `<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" width="16px" height="16px" fill="#FC8019" stroke="#FC8019"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;stroke:#FC8019;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> <path class="st0" d="M25,18H7c-1.1,0-2-0.9-2-2v0c0-1.1,0.9-2,2-2h18c1.1,0,2,0.9,2,2v0C27,17.1,26.1,18,25,18z"></path> <path class="st0" d="M25,18c0,5-4,9-9,9s-9-4-9-9"></path> <polyline class="st0" points="21.7,25 23,31 9,31 10.3,25 "></polyline> <path class="st0" d="M24,14H8V5c0-2.2,1.8-4,4-4h8c2.2,0,4,1.8,4,4V14z"></path> <line class="st0" x1="12" y1="5" x2="14" y2="5"></line> </g></svg>
                                                    `: `<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" width="16px" height="16px" fill="#FC8019" stroke="#FC8019">
                                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                          <g id="SVGRepo_iconCarrier"> 
                                                            <style type="text/css"> .st0{fill:none;stroke:#FC8019;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} </style> 
                                                            <path class="st0" d="M25,18H7c-1.1,0-2-0.9-2-2v0c0-1.1,0.9-2,2-2h18c1.1,0,2,0.9,2,2v0C27,17.1,26.1,18,25,18z"></path> 
                                                            <path class="st0" d="M25,18c0,5-4,9-9,9s-9-4-9-9"></path> 
                                                            <polyline class="st0" points="21.7,25 23,31 9,31 10.3,25 "></polyline> 
                                                            <path class="st0" d="M24,14H8V5c0-2.2,1.8-4,4-4h8c2.2,0,4,1.8,4,4V14z"></path> 
                                                            <line class="st0" x1="30" y1="10" x2="30" y2="10"></line> 
                                                            <line x1="8" y1="10" x2="30" y2="30" stroke="red" stroke-width="2" stroke-linecap="round"/>
                                                            <line x1="30" y1="10" x2="10" y2="30" stroke="red" stroke-width="2" stroke-linecap="round"/>
                                                          </g>
                                                        </svg>
                                                        `}${roomDetails.bathroom}
                                                        <br>
                                                        <svg fill="#FC8019" height="16px" width="16px" viewBox="-4.5 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m15.307 5.83v1.738.021c0 .29-.235.525-.525.525-.007 0-.015 0-.022 0h.001-2.864c-.23 1.609-1.032 2.998-2.19 3.981l-.009.008c-1.288 1.041-2.904 1.723-4.673 1.873l-.032.002q2.846 3.034 7.824 9.136c.086.085.139.202.139.332 0 .092-.026.177-.072.249l.001-.002c-.076.182-.252.308-.459.308-.013 0-.025 0-.037-.001h.002-3.324c-.006 0-.014 0-.021 0-.166 0-.313-.08-.404-.204l-.001-.001q-5.216-6.256-8.489-9.733c-.095-.093-.154-.222-.154-.365 0-.004 0-.007 0-.011v.001-2.167c.004-.3.246-.542.545-.546h1.909c.099.005.214.007.33.007 1.196 0 2.328-.273 3.338-.76l-.046.02c.855-.428 1.49-1.188 1.742-2.107l.005-.023h-7.28c-.006 0-.014 0-.021 0-.29 0-.525-.235-.525-.525 0-.007 0-.015 0-.022v.001-1.738c0-.006 0-.014 0-.021 0-.29.235-.525.525-.525h.022-.001 7.04q-.971-1.926-4.568-1.926h-2.471c-.3-.004-.542-.246-.546-.545v-2.268c0-.006 0-.014 0-.021 0-.29.235-.525.525-.525h.022-.001 14.182.021c.29 0 .525.235.525.525v.022-.001 1.738.021c0 .29-.235.525-.525.525-.007 0-.015 0-.022 0h.001-3.971c.526.689.908 1.516 1.085 2.417l.006.037h2.914.021c.29 0 .525.235.525.525v.022-.001z"></path></g></svg>
                                                        ${roomDetails.price}
                                                        <br>
                                                         <svg fill="#FC8019" height="16px" width="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M469.333,174.321V64c0-35.355-28.645-64-64-64H106.667c-35.355,0-64,28.645-64,64v110.321 C17.808,183.105,0,206.794,0,234.667V320v149.333C0,492.891,19.109,512,42.667,512h42.667C108.891,512,128,492.891,128,469.333 V448h256v21.333C384,492.891,403.109,512,426.667,512h42.667C492.891,512,512,492.891,512,469.333V320v-85.333 C512,206.794,494.192,183.105,469.333,174.321z M85.333,64c0-11.791,9.542-21.333,21.333-21.333h298.667 c11.791,0,21.333,9.542,21.333,21.333v106.667H382.23C372.071,110.135,319.415,64,256,64s-116.071,46.135-126.23,106.667H85.333 V64z M338.643,170.667H173.357c9.476-36.8,42.89-64,82.643-64S329.168,133.867,338.643,170.667z M42.667,234.667 c0-11.791,9.542-21.333,21.333-21.333h85.333h213.333H448c11.791,0,21.333,9.542,21.333,21.333v64H42.667V234.667z M426.667,469.333v-42.667c0-11.782-9.551-21.333-21.333-21.333H106.667c-11.782,0-21.333,9.551-21.333,21.333v42.667H42.667v-128 h426.667v128H426.667z"></path> </g> </g> </g></svg>
                                                            available: ${roomDetails.bedsAvailable}
                                                         </p>
                                                <div class="beds">
                                                    ${Object.keys(roomDetails.beds).map(bedKey => {
                                                    const bedStatus = roomDetails.beds[bedKey];
                                                    let roomNo = "room"+roomDetails.roomNumber;
                                                    let bedClass = "not-booked";
                                                    let bedCheckOutDate = bedStatus.checkoutDate;
                                                    
                                                    if(bedStatus.status == "booked"){
                                                        bedClass = "booked";
                                                    }
                                                    else if(bedStatus.status == "not booked"){
                                                        bedClass = "not-booked"
                                                    }
                                                    let bedCheckoutMsg = "no msg"
                                                    if(bedCheckOutDate != "" && bedCheckOutDate != undefined){
                                                        let fromDateArray = new Date(bedCheckOutDate);
                                                        let toDateArray = new Date(checkinDate);
                                                        console.log(fromDateArray,toDateArray)
                                                        let Difference_In_Time = fromDateArray.getTime() - toDateArray.getTime();
                                                        let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
                                                        console.log(fromDateArray,toDateArray,Difference_In_Days)
                                                        if(Difference_In_Days > 0){
                                                            bedClass = "checkOut"
                                                            bedCheckoutMsg = "Bed will be Available withtin - "+Difference_In_Days+" days."
                                                        }
                                                    }
                                                    return `<div class="${bedClass}" 
                                                                    data-floor="${floorKey}" 
                                                                    data-sharing="${sharingKey}" 
                                                                    data-ac="${roomDetails.ac}" 
                                                                    data-bathroom="${roomDetails.bathroom}" 
                                                                    data-price="${roomDetails.price}" 
                                                                    data-bed-id="${bedKey}"
                                                                    data-beds-available = "${roomDetails.bedsAvailable}" 
                                                                    data-total-beds-available = "${sharing.bedsAvailable}"
                                                                    data-checkout-msg="${bedCheckoutMsg}"
                                                                    data-room-number="${roomNo}">
                                                                    ${bedKey}
                                                            </div>`;
                                                     }).join('')}
                                                </div>
                                            </div>`;
                                  }).join('');
                                }).join('')}
                            </div>
                        </div>
                      </div>`;

        //   const expandBtn = listItem.querySelector('.expand-btn button');
        //   const roomsDiv = listItem.querySelector('.rooms');

        //   expandBtn.addEventListener('click', () => {
        //     // roomsDiv.style.display = roomsDiv.style.display === 'block' ? 'none' : 'block';
        //     const isExpanded = roomsDiv.style.display === 'block';
        //     roomsDiv.style.display = isExpanded ? 'none' : 'block';
        //     expandBtn.textContent = isExpanded ? 'Select Rooms' : 'Hide Rooms';
        //   });

          const bedDivs = listItem.querySelectorAll('.beds div');
          bedDivs.forEach(bedDiv => {
            if (!bedDiv.classList.contains('booked')) {
              bedDiv.addEventListener('click', () => {
                if(bedDiv.classList.contains('checkOut')){
                    alert(bedDiv.dataset.checkoutMsg)
                }
                else{
                    document.getElementById("cart-title").innerHTML = "Empty Cart";
                document.getElementById("cart-room-price").innerHTML = '';
                document.getElementById("cart-room-floor").innerHTML = "";
                document.getElementById("cart-bed-number").innerHTML = "";
                //removing selected class from all the beds
                bedDivs.forEach(bedDiv=>{
                    bedDiv.classList.remove('selected');
                })

                
                bedDiv.classList.toggle('selected');
                const floor = bedDiv.dataset.floor;
                const sharing = bedDiv.dataset.sharing;
                const ac = bedDiv.dataset.ac;
                const bathroom = bedDiv.dataset.bathroom;
                const price = bedDiv.dataset.price;
                const bedId = bedDiv.dataset.bedId;
                const roomNumber = bedDiv.dataset.roomNumber;

                let roomDetails = sharing + "-" + price + "-" + bedDiv.dataset.bedsAvailable + "-" + floor + "-" + roomNumber + "-" + ac + '-' + bedDiv.dataset.totalBedsAvailable;
                console.log(roomDetails);
                localStorage.setItem("room-details", roomDetails);
                localStorage.setItem("bedId", bedId);

                document.getElementById("cart-title").innerHTML = "Room Rate";
                document.getElementById("cart-room-price").innerHTML = price;
                // document.getElementById("cart-room-floor").innerHTML = "Floor - " + roomDetails[3] + " Room - " + roomDetails[2];
                document.getElementById("cart-room-floor").innerHTML = "Floor - " + floor;
                document.getElementById("cart-bed-number").innerHTML = "Selected Bed - " + bedId;
                document.getElementById("proceedPaymentBtn").style.display = 'block';//proceed to pay btn in web view
                document.getElementById("viewCart").style.display = 'block';//view cart btn in mobile view

                

                // const confirmation = confirm(`Selected Bed Details:
                //                 Floor: ${floor}
                //                 Sharing: ${sharing}
                //                 ${ac.replace('non-ac', 'Non-AC').replace('ac', 'AC')}
                //                 Bathroom: ${bathroom}
                //                 Price: ${price}
                //                 Bed ID: ${bedId}
                //                 Room Number: ${roomNumber}
                                
                //                 Confirm selection?`);

                // if (confirmation) {
                //   clearFilters();
                // }
                }
              });
            }
          });

          postContainer.appendChild(listItem);
        });
      });
    }
    else{
        postContainer.innerHTML = '';
        document.getElementById("no_room_msg").style.display = "flex";
        document.getElementById("no_room_msg").style.justifyContent = "center";
        document.getElementById("no_room_msg").style.alignItems = "center";
    }
}
function clearFilters() {
    filters.floor.value = '';
    filters.sharing.value = '';
    filters.ac.value = '';
    filters.bathroom.value = '';
    filters.price.value = 15000;
    const priceDisplay = document.getElementById('price');
    priceDisplay.innerHTML = 15000;
    if (filters.floor.value == '' && filters.sharing.value == '' && filters.ac.value == '' && filters.bathroom.value == ''&& Number(filters.price.value) == 15000) {
        document.getElementById("clearFiltersBtn").style.display = "none";
      }
      else{
        document.getElementById("clearFiltersBtn").style.display = "inline";
      }
      applyFilters2();
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
        alert("select an bed to book");
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
    mainELem.setAttribute("style", "display: grid;gap: 20px;grid-template-columns:1fr 1fr;");
    ['Breakfast', 'Lunch','Dinner','Snacks'].forEach(mealTime => {
        const mealData = dayData[mealTime] || {};
        let dishdata = {};
        if('{}' != JSON.stringify(mealData)){
             dishdata = mealData.dishes[0] || {};
        }
        // console.log(JSON.stringify(mealData),dishdata)
        const elem = document.createElement('div');
        elem.classList.add('card');
        elem.classList.add('bg-white');
        elem.classList.add('shadow-lg');
        elem.style.backgroundColor = "white";
        elem.innerHTML = `  <h6>
                                ${mealTime}
                                <br>
                                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FC8019"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#FC8019" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 6V12" stroke="#FC8019" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16.24 16.24L12 12" stroke="#FC8019" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                 ${mealData.dishTimings} 
                            </h6>
                            <div class="card-body">
                            <img alt='food_img' src = '${dishdata.image}' width='80px' height='80px'>
                                <ul>
                                    <li>
                                        <svg fill="#FC8019" height="16px" width="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.999 511.999" xml:space="preserve" stroke="#FC8019"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M324.799,68.799c-103.222,0-187.2,83.978-187.2,187.2s83.978,187.2,187.2,187.2s187.2-83.978,187.2-187.2 S428.022,68.799,324.799,68.799z M324.799,407.169c-83.354,0-151.168-67.814-151.168-151.168s67.814-151.17,151.168-151.17 s151.168,67.814,151.168,151.168S408.154,407.169,324.799,407.169z"></path> </g> </g> <g> <g> <path d="M324.799,148.019c-59.541,0-107.981,48.44-107.981,107.981s48.44,107.981,107.981,107.981S432.78,315.54,432.78,255.999 S384.34,148.019,324.799,148.019z M324.799,327.95c-39.673,0-71.949-32.276-71.949-71.949s32.276-71.949,71.949-71.949 c39.673,0,71.949,32.276,71.949,71.949S364.472,327.95,324.799,327.95z"></path> </g> </g> <g> <g> <path d="M110.491,68.799c-9.95,0-18.016,8.066-18.016,18.016v96.161H81.959V86.815c0-9.95-8.066-18.016-18.016-18.016 c-9.95,0-18.016,8.066-18.016,18.016v96.161h-9.896V86.815c0-9.95-8.066-18.016-18.016-18.016S0,76.866,0,86.815v99.764 c0,17.881,14.547,32.428,32.428,32.428h12.298v206.175c0,9.95,8.066,18.016,18.016,18.016s18.016-8.066,18.016-18.016V219.009 h15.321c17.881,0,32.428-14.547,32.428-32.428V86.815C128.507,76.866,120.441,68.799,110.491,68.799z"></path> </g> </g> </g></svg>
                                        ${dishdata.name || 'N/A'}
                                    </li>
                                    <li>and ${dishdata.special_dish || 'N/A'}</li>
                                    <br>
                                    <li> 
                                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.25 10H17.75M9.26556 20H14.7344C15.7431 20 16.5939 19.2489 16.719 18.2481L18.3595 5.12403C18.4341 4.52718 17.9687 4 17.3672 4H6.63278C6.03128 4 5.5659 4.52718 5.6405 5.12403L7.28101 18.2481C7.40612 19.2489 8.25692 20 9.26556 20Z" stroke="#FC8019" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>                              
                                        ${dishdata.beverage || 'N/A'}
                                    </li>
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
            checkbox.value = "floor"+String(i);
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
            // loadCheckboxesForFilter(hosteFloorCount);//function is called to dynamically create the checkbox.
            loadFloorSelect(hosteFloorCount);//function is called to dynamically create the checkbox.
            loadSharingTypeFilter(snapshot.val().rooms);//function is calledto dyncmically load the sharing type options
        } else {
            console.log('No floor count.');
        }
    } catch (error) {
        console.error('Error fetching floor:', error);
    }
}

window.addEventListener('load', loadFloorCountForCheckBoxes);
/** Dynamic Checkboxes are loaded based on the HosteFloor count for paritcular hostel - ends here */

function loadFloorSelect(floorCount) {
    if (floorCount > 0) {
        // let sel = document.createElement("Select");
        // sel.setAttribute("id", "floorFilter");
        // document.body.appendChild(sel);
        for (var i = 1; i <= floorCount; i++) {

            let opt = document.createElement("option");
            opt.setAttribute("value",  "floor" + String(i));
            let nod = document.createTextNode( "Floor " + String(i));
            opt.appendChild(nod);
            document.getElementById("floorFilter").appendChild(opt);
          
            // ulContainer.appendChild(libox);
        }
    }
    else {
        //when there is no floor count, empty message will be displayed.
        // document.getElementById('noFloorFilterMsg').style.display = "block";
    }
}
//Dynamically loading sharing vales in the select box
function loadSharingTypeFilter(data){
    availableSharingTypes = [];
    Object.keys(data).forEach(floorKey => {
        const floor = data[floorKey];
        Object.keys(floor).forEach(sharingKey => {
            availableSharingTypes.push(sharingKey)
        })
    })

    // console.log(availableSharingTypes)//before filter
     availableSharingTypes = availableSharingTypes.filter((val,index)=> availableSharingTypes.indexOf(val) === index)
    // console.log(availableSharingTypes)//after filter

    for (var i = 0; i < availableSharingTypes.length; i++) {

        console.log(availableSharingTypes[i])
        let opt = document.createElement("option");
        opt.setAttribute("value",  availableSharingTypes[i]);
        let nod = document.createTextNode( availableSharingTypes[i]);
        opt.appendChild(nod);
        document.getElementById("sharingTypeFilter").appendChild(opt);

    }

}
