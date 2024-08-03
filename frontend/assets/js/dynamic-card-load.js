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

    const imgSrc = "assets/images/product/vp-11.png";
    const mainParentElem = document.createElement('div');
    mainParentElem.classList.add('swiper-slide');

    const parentElem = document.createElement('div');
    parentElem.classList.add('vertical-product-box');
    parentElem.classList.add('product-style-2');

    const elem = document.createElement('div');
    elem.classList.add('vertical-product-box-img');
    elem.innerHTML = `<a href="menu-listing.html">
                                    <img class="product-img-top w-100 bg-img"
                                        src="${Imagelink}" alt="vp1">
                                </a>`;
    parentElem.appendChild(elem);

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
                                                off | Code ZOMO50
                                            </li>
                                            <li class="discount-info">
                                                <i class="ri-discount-percent-fill"></i> Upto 50%
                                                off | Code ZOMO50
                                            </li>
                                            <li class="discount-info">
                                                <i class="ri-discount-percent-fill"></i> Upto 50%
                                                off | Code ZOMO50
                                            </li>
                                            <li class="discount-info">
                                                <i class="ri-discount-percent-fill"></i> Upto 50%
                                                off | Code ZOMO50
                                            </li>
                                        </ul>
                                    </li>
                                </ul>`;
    parentElem.appendChild(elem1);
    mainParentElem.appendChild(parentElem)
    postContainer.appendChild(mainParentElem);
}

const iterateAllRecords = () => {
    //iterating thro the hostle obj fetched from DB
    hostelist.forEach(iterator => {
        addSwiperSlideCard(iterator.Hostelname, iterator.Hosteltype, iterator.Hosteladd1,
            iterator.Hosteladd2, iterator.Hostelphone, iterator.Hostelemail, iterator.Hostelcity,
            iterator.Hostelstate, iterator.Hostelpin,
            iterator.Hostelrent, iterator.Hostelfood, iterator.Acprice, iterator.Nonacprice, iterator.Imagelink)
    })
}
window.addEventListener('load', loadDataFromDB);

