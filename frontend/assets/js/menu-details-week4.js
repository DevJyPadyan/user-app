import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

// Apply basic card styling directly in JavaScript
const style = document.createElement('style');
style.innerHTML = `
    .week-section-wrapper {
        margin: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .week-list {
        margin-top: 10px;
    }

    .card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #fff;
    }

    .meal-times-container {
        display: flex;
        justify-content: space-between;
        gap: 10px; /* Optional: for spacing between columns */
    }

    .meal-time-column {
        flex: 1; /* Ensures columns take equal space */
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 10px;
        background-color: #f0f0f0;
    }

    .meal-time-header {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .meal-details {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 10px;
        background-color: #fff;
    }

    .meal-details ul {
        list-style-type: none;
        padding: 0;
    }

    .meal-details li {
        margin-bottom: 5px;
    }
`;
document.head.appendChild(style);

// Specify the hostel name
const hostelName = 'Ganesh PG'; // Replace with the actual hostel name

// Function to fetch and display only Week 1 data for a specific hostel
const fetchWeek2Data = () => {
    const weekNumber = 'week4';
    createWeekSection(weekNumber);
    fetchMenuDetails(weekNumber);
};

// Function to create a new section for the week
const createWeekSection = (weekNumber) => {
    const container = document.getElementById('lists-container');

    const sectionWrapper = document.createElement('div');
    sectionWrapper.className = 'week-section-wrapper';

    const title = document.createElement('h3');
    title.innerText = `Week 4 details:`; // Explicitly setting the title
    sectionWrapper.appendChild(title);

    const weekList = document.createElement('div'); // Changed from 'ul' to 'div' for card styling
    weekList.className = 'week-list';
    weekList.id = `week-${weekNumber}`;
    sectionWrapper.appendChild(weekList);

    container.appendChild(sectionWrapper);
};

// Function to fetch and append meal details for Week 1
const fetchMenuDetails = (weekNumber) => {
    const dbRef = ref(db, `Hostel details/${hostelName}/weeks/${weekNumber}`);

    onValue(dbRef, (snapshot) => {
        const weekData = snapshot.val();
        const weekList = document.getElementById(`week-${weekNumber}`);
        
        if (weekData) {
            Object.keys(weekData).forEach(day => {
                const dayData = weekData[day];
                addDayDetails(weekList, day, dayData);
            });
        } else {
            weekList.innerHTML = '<div class="card"><p>No data available</p></div>';
        }
    });
};

// Function to append day and meal details as card containers
const addDayDetails = (weekList, day, dayData) => {
    const dayCard = document.createElement('div');
    dayCard.className = 'card';
    dayCard.innerHTML = `<strong>${day}:</strong>`;
    
    const mealTimesContainer = document.createElement('div');
    mealTimesContainer.className = 'meal-times-container';

    ['Morning', 'Afternoon', 'Night'].forEach(mealTime => {
        const mealData = dayData[mealTime] || {};
        const mealColumn = document.createElement('div');
        mealColumn.className = 'meal-time-column';

        const mealHeader = document.createElement('div');
        mealHeader.className = 'meal-time-header';
        mealHeader.innerText = mealTime;

        const mealDetails = document.createElement('div');
        mealDetails.className = 'meal-details';
        mealDetails.innerHTML = `
            <ul>
                <li>Main Dish: ${mealData.mainDish || 'N/A'}</li>
                <li>Side Dish: ${mealData.sideDish || 'N/A'}</li>
                <li>Timings: ${mealData.timing || 'N/A'}</li>
            </ul>
        `;

        mealColumn.appendChild(mealHeader);
        mealColumn.appendChild(mealDetails);
        mealTimesContainer.appendChild(mealColumn);
    });

    dayCard.appendChild(mealTimesContainer);
    weekList.appendChild(dayCard);
};

// Initialize the data fetch for Week 1 on page load
window.addEventListener('load', fetchWeek2Data);
