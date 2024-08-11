/**
 * Dynamic card list generator which creates card 
 * in restaurant-listing.html
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, onValue, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

let hostelist = [];

const loadDataFromDB = () => {
    const dbref = ref(db, 'Hostel details');
    onValue(dbref, (snapshot) => {

        hostelist = [];

        snapshot.forEach(iterator => {
            hostelist.push(iterator.val());
        })
        iterateAllRecords();
    })
}
const postContainer = document.getElementById('card-content');
const addSwiperSlideCard = (Hostelname, Hosteltype, Hosteladd1,
    Hosteladd2, Hostelphone, Hostelemail, Hostelcity, Hostelstate,
    Hostelpin, Hostelrent, Hostelfood, Acprice, Nonacprice, Imagelink) => {

    const mainParentElem = document.createElement('div');
    mainParentElem.classList.add('col-xl-3');
    mainParentElem.classList.add('col-lg-4');
    mainParentElem.classList.add('col-sm-6');

    const parentElem = document.createElement('div');
    parentElem.classList.add('vertical-product-box');

    const elem = document.createElement('div');
    elem.classList.add('vertical-product-box-img');
    elem.innerHTML = `<a href="menu-listing.html">
                                        <img class="product-img-top w-100 bg-img" src="assets/images/product/vp-1.png"
                                            alt="vp1">
                                    </a>
                                    <div class="offers">
                                        <h6>upto $2</h6>
                                        <div class="d-flex align-items-center justify-content-between">
                                            <h4>50% OFF</h4>
                                        </div>
                                    </div>`;
    parentElem.appendChild(elem);

    const elem1 = document.createElement('div');
    elem1.classList.add('vertical-product-body');
    elem1.innerHTML = `<div class="d-flex align-items-center justify-content-between mt-sm-3 mt-2">
                                        <a>
                                            <h4 class="vertical-product-title">${Hostelname}</h4>
                                        </a>
                                        <h6 class="rating-star">
                                            <span class="star"><i class="ri-star-s-fill"></i></span>3.9
                                        </h6>
                                    </div>
                                    <h5 class="product-items">
                                        ${Hostelemail},${Hostelphone}
                                    </h5>
                                    <div
                                        class="location-distance d-flex align-items-center justify-content-between pt-sm-3 pt-2">
                                        <h5 class="place">${Hosteladd1},${Hostelcity}</h5>
                                        <ul class="distance">
                                            <li><i class="ri-map-pin-fill icon"></i>${Hosteltype}</li>
                                            <li><i class="ri-time-fill icon"></i> 25 min</li>
                                        </ul>
                                    </div>`;
    elem1.dataset.hostelName = Hostelname;
    elem1.dataset.hostelAddress = Hosteladd1;
    elem1.addEventListener('click', handleCardClick);

    parentElem.appendChild(elem1);
    mainParentElem.appendChild(parentElem)
    postContainer.appendChild(mainParentElem);
}

const iterateAllRecords = () => {
    //iterating thro the hostle obj fetched from DB.
    hostelist.forEach(iterator => {
        addSwiperSlideCard(iterator.Hostelname, iterator.Hosteltype, iterator.Hosteladd1,
            iterator.Hosteladd2, iterator.Hostelphone, iterator.Hostelemail, iterator.Hostelcity,
            iterator.Hostelstate, iterator.Hostelpin,
            iterator.Hostelrent, iterator.Hostelfood, iterator.Acprice, iterator.Nonacprice, iterator.Imagelink)
    })
}

function handleCardClick(event) {
    const card = event.currentTarget;
    const cardHostelName = card.dataset.hostelName;
    const cardHostelAddress = card.dataset.hostelAddress;
    console.log(`Card ID: ${cardHostelName}, Card Name: ${cardHostelAddress}`);
    localStorage.setItem("hostel-name",cardHostelName);
    localStorage.setItem("hostel-address",cardHostelAddress);
    window.location.href = "menu-listing.html";
}

window.addEventListener('load', loadDataFromDB);

