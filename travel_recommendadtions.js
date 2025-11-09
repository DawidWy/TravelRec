document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('btnSearch');
    const clearBtn = document.getElementById('btnClear');
    const resultsContainer = document.getElementById('results-container');

    const DATA_URL = 'travel_recommendation_api.json';

    async function fetchTravelData() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data fetched successfully:", data);
            return data;
        } catch (error) {
            console.error("Failed to fetch travel data:", error);
            resultsContainer.innerHTML = '<p>Error loading recommendations. Please try again later.</p>';
            return null;
        }
    }

    function getCurrentTimeForTimeZone(timeZone) {
        const options = {
            timeZone: timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        try {
            return new Date().toLocaleTimeString('en-US', options);
        } catch (error) {
            console.error(`Invalid time zone: ${timeZone}`, error);
            return "Invalid TimeZone";
        }
    }

    function displayResult(item, showTime = false) {
        const card = document.createElement('div');
        card.className = 'result-card';

        let timeString = '';
        if (showTime && item.timeZone) {
            const currentTime = getCurrentTimeForTimeZone(item.timeZone);
            timeString = `<p><strong>Current Time:</strong> ${currentTime}</p>`;
        }

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            ${timeString}
        `;
        resultsContainer.appendChild(card);
    }

    async function performSearch() {
        const data = await fetchTravelData();
        if (!data) return;

        const keyword = searchInput.value.toLowerCase().trim();
        
        clearResults(); 

        let results = [];
        let showTime = false;

        if (keyword === 'beach' || keyword === 'beaches') {
            results = data.beaches;
        } else if (keyword === 'temple' || keyword === 'temples') {
            results = data.temples;
        } else if (keyword === 'country' || keyword === 'countries') {
            results = data.countries;
            showTime = true;
        } else {
            resultsContainer.innerHTML = '<p>No results found. Please try "beach", "temple", or "country".</p>';
            return;
        }

        if (results.length > 0) {
            results.forEach(item => displayResult(item, showTime));
        } else {
            resultsContainer.innerHTML = '<p>No recommendations found for this category.</p>';
        }
    }

    function clearResults() {
        resultsContainer.innerHTML = '';
        searchInput.value = '';
    }

    searchBtn.addEventListener('click', performSearch);
    clearBtn.addEventListener('click', clearResults);

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});