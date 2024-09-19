/**
 * Dynamic card list generator which creates card 
 * in index.html
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, onValue, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

let hostelist = [];

const loadDataFromDB = () => {
    localStorage.setItem("total_hostel_length", 0);
    localStorage.setItem("total_search_length", 0);
    const dbref = ref(db, 'Hostel details');
    onValue(dbref, (snapshot) => {

        hostelist = [];

        snapshot.forEach(iterator => {
            hostelist.push(iterator.val());
        })
        iterateAllRecords();
    })
}

//Main Head Parent Container
const postContainer = document.getElementById('card-content');
const addSwiperSlideCard = (Hostelname, Hosteltype, Hosteladd1,
    Hosteladd2, Hostelphone, Hostelemail, Hostelcity, Hostelstate,
    Hostelpin, Hostelrent, Hostelfood, Acprice, ImageArray, card_number) => {

    let Imagelink = "assets/images/product/p-18.png";//default image URL , if there is no Image data present in DB
    if ((ImageArray != undefined)) {
        Imagelink = ImageArray[0];//if Image data is pereset [0] is always kept as thumbnail image for hostel
    }
    //Parent Container
    const mainParentElem = document.createElement('div');
    mainParentElem.classList.add('swiper-slide');
    mainParentElem.setAttribute('id', card_number);

    //Sub Parent to be added to Parent
    const parentElem = document.createElement('div');
    parentElem.classList.add('vertical-product-box');
    parentElem.classList.add('product-style-2');

    //Element(Child) to be added to Sub Parent
    const elem = document.createElement('div');
    elem.classList.add('vertical-product-box-img');
    elem.innerHTML = `<a>
                                    <img class="product-img-top w-100 bg-img"
                                        src="${Imagelink}" alt="vp1">
                                </a>`;
    parentElem.appendChild(elem);


    //Element(Child) to be added to Sub Parent
    const elem1 = document.createElement('div');
    elem1.classList.add('vertical-product-body');
    elem1.innerHTML = `<div class="d-flex align-items-center justify-content-between">
                                    <a href="menu-listing.html">
                                        <h4 class="vertical-product-title">
                                            ${Hostelname}
                                        </h4>
                                    </a>
                                    <h6 class="rating-star">
                                        <span class="star"><i class="ri-star-s-fill"></i></span>
                                    </h6>
                                </div>
                                <ul class="details-list">
                                    <li>
                                        <i class="ri-map-pin-line"></i> ${Hosteladd1},${Hostelcity}
                                    </li>
                                    <li><i class="ri-time-line"></i> 20-30 min</li>
                                    <li>
                                        <ul class="marquee-discount">
                                            <li class="discount-info">
                                                <i class="ri-discount-percent-fill"></i> Upto 50%
                                                off | Code Perikities
                                            </li>
                                            <li class="discount-info">
                                                <i class="ri-discount-percent-fill"></i> Upto 50%
                                                off | Code Perikities
                                            </li>
                                            <li class="discount-info">
                                                <i class="ri-discount-percent-fill"></i> Upto 50%
                                                off | Code Perikities
                                            </li>
                                            <li class="discount-info">
                                                <i class="ri-discount-percent-fill"></i> Upto 50%
                                                off | Code Perikities
                                            </li>
                                        </ul>
                                    </li>
                                </ul>`;

    //adding click events to the child and also onclick event , these values will be passed.
    elem1.dataset.hostelName = Hostelname;
    elem1.dataset.hostelAddress = Hosteladd1;
    elem1.addEventListener('click', handleCardClick);


    parentElem.appendChild(elem1);
    mainParentElem.appendChild(parentElem)
    postContainer.appendChild(mainParentElem);
}

function handleCardClick(event) {
    const card = event.currentTarget;
    const cardHostelName = card.dataset.hostelName;
    const cardHostelAddress = card.dataset.hostelAddress;
    console.log(`Clicked Card ID: ${cardHostelName}, Card Name: ${cardHostelAddress}`);
    localStorage.setItem("hostel-name", cardHostelName);
    localStorage.setItem("hostel-address", cardHostelAddress);
    window.location.href = "menu-listing.html";
}

const iterateAllRecords = () => {
    var i = 0;
    //iterating thro the hostle obj fetched from DB
    hostelist.forEach(iterator => {
        i++;
        addSwiperSlideCard(iterator.hostelName, iterator.hostelType, iterator.hostelAddress1,
            iterator.hostelAddress2, iterator.hostelPhone, iterator.hostelEmail, iterator.hostelCity,
            iterator.hostelState, iterator.hostelPin,
            iterator.hostelVegprice, iterator.hostelbothfoods, iterator.hostelNonvegprice, iterator.ImageData, i)
    })
    localStorage.setItem("total_hostel_length", hostelist.length);
}

//Search Box value Changes searchFuntion will be triggered.
document.getElementById("global-search").addEventListener("change", searchFunction);

/**
 * Part A - if an value is searched
 * the existing card record will be removed.
 * searched relevant data cards will be populated
 * 
 * Part B - if the search value is removed
 * the searched relevant data cards will be removed
 * List of All Hostel Record cards will be populated
 */
function searchFunction() {
    console.log("..inside search")
    var searcheValue = document.getElementById("global-search");

    //OLD SEARCH LOGIC, only with exact string match , it'll filter the records.eg: if we give chennai then chennai location will filter(not for che,chen,chenna)
    // var data_filter = hostelist.filter(element =>
    //     element.hostelType.toLowerCase() == searcheValue.toLowerCase() || element.hostelName.toLowerCase() == searcheValue.toLowerCase()
    //     || element.hostelCity.toLowerCase() == searcheValue.toLowerCase()
    // );

    //NEW SEARCH LOGIC implemented as regex search, where substring match is also considered. eg-> if we give(che,chen,chenna) chennai will populate
    searcheValue = searcheValue.value;
    var textSearch = new RegExp(searcheValue, 'gi');//regex pattern for any substring match.
    //need to add more search values based on all columns , now only name , type and city is added.
    var data_filter = hostelist.filter(element => 
        element.hostelType.match(textSearch) != null || element.hostelName.match(textSearch) != null
        || element.hostelCity.match(textSearch) != null
    );
    var total_len = localStorage.getItem("total_hostel_length");

    //Part A - refer function comment
    if (searcheValue != '') {
        //Removing All cards, Populated during page load.
        if (total_len != 0) {
            removeCards(total_len);
            localStorage.setItem("total_hostel_length", 0);
        }

        if (localStorage.getItem("total_search_length") != 0) {
            removeCards(localStorage.getItem("total_search_length"));
            localStorage.setItem("total_search_length", 0);
        }
        //Adding search relevant cards data.
        var i = 0;
        data_filter.forEach(iterator => {
            i++;
            addSwiperSlideCard(iterator.hostelName, iterator.hostelType, iterator.hostelAddress1,
                iterator.hostelAddress2, iterator.hostelPhone, iterator.hostelEmail, iterator.hostelCity,
                iterator.hostelState, iterator.hostelPin,
                iterator.hostelVegprice, iterator.hostelBothfoods, iterator.hostelNonvegprice, iterator.ImageData, i)
        });
        localStorage.setItem("total_search_length", i);
    }

    //Part B - refer function comment
    else {
        //removing search releavant card data
        removeCards(localStorage.getItem("total_search_length"));
        localStorage.setItem("total_search_length", 0);

        //appending full hostel details card
        loadDataFromDB();
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

window.addEventListener('load', loadDataFromDB);

