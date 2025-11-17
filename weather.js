// API URLs
const base_URL = "https://api.open-meteo.com";
const live_URL = "https://api.openweathermap.org/data/2.5/weather?";
const GEOCODING_URL = "https://nominatim.openstreetmap.org/search";

// Get DOM elements
const box = document.querySelector(".box");
const container = document.querySelector(".container");
const forecastCards = document.querySelectorAll(".forecast-card");
const nextBtn = document.querySelector(".next-btn");
const btn = document.querySelector(".live-button");
const msg_humid = document.querySelector(".humid");
const msg_wind = document.querySelector(".wind");
const msg_temp = document.querySelector(".weather-update h1");
const btn3 = document.querySelector(".getnewlocation");

// Map Modal elements
const changeLocationBtn = document.querySelector(".change-location-btn");
const mapModal = document.getElementById("mapModal");
const closeModal = document.querySelector(".close-modal");
const getCurrentLocationBtn = document.getElementById("getCurrentLocation");
const searchBox = document.getElementById("searchBox");
const confirmLocationBtn = document.getElementById("confirmLocation");
const displayLat = document.getElementById("displayLat");
const displayLon = document.getElementById("displayLon");
const selectedLocationText = document.getElementById("selectedLocation");

// Home page location display elements
const currentLocationName = document.getElementById("currentLocationName");
const currentLatDisplay = document.getElementById("currentLat");
const currentLonDisplay = document.getElementById("currentLon");

// Date and time elements
const currentDateDisplay = document.getElementById("currentDate");
const currentTimeDisplay = document.getElementById("currentTime");

// Warning modal elements
const warningModal = document.getElementById("warningModal");
const selectLocationBtn = document.getElementById("selectLocationBtn");
const closeWarningBtn = document.getElementById("closeWarningBtn");

// Warning modal functions
function showWarningModal() {
    warningModal.style.display = "block";
}

function hideWarningModal() {
    warningModal.style.display = "none";
}

// Check if location is selected (not default Delhi coordinates)
function checkLocationSelected() {
    // Check if location has been set (not null)
    if (latitude === null || longitude === null) {
        return false;
    }
    // Check if user manually confirmed a location
    return isLocationSelected;
}

// Warning modal event listeners
if (selectLocationBtn) {
    selectLocationBtn.addEventListener("click", () => {
        hideWarningModal();
        mapModal.style.display = "block";
    });
}

if (closeWarningBtn) {
    closeWarningBtn.addEventListener("click", hideWarningModal);
}

// Close warning modal when clicking outside
window.addEventListener("click", (event) => {
    if (event.target === warningModal) {
        hideWarningModal();
    }
});

// Close warning modal with ESC key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && warningModal.style.display === "block") {
        hideWarningModal();
    }
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    if (currentDateDisplay) currentDateDisplay.textContent = dateStr;
    
    // Format time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    if (currentTimeDisplay) currentTimeDisplay.textContent = timeStr;
}

// Update time immediately and then every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Debug: Check if elements exist
console.log('🔍 Search elements check:');
console.log('  - searchBox:', searchBox);
console.log('  - searchResults:', document.getElementById("searchResults"));

// Store selected coordinates
let latitude = null;
let longitude = null;
let map, marker;
let isLocationSelected = false;

// Open map modal
changeLocationBtn.addEventListener("click", () => {
    mapModal.style.display = "block";
    
    // Initialize map if not already done
    if (!map) {
        setTimeout(() => {
            // Use default location if none selected
            const defaultLat = latitude || 28.7041;
            const defaultLon = longitude || 77.1025;
            
            map = L.map('map').setView([defaultLat, defaultLon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            marker = L.marker([defaultLat, defaultLon], {draggable: true}).addTo(map);
            
            // Update on marker drag
            marker.on('dragend', function() {
                const pos = marker.getLatLng();
                updateSelectedLocation(pos.lat, pos.lng);
            });
            
            // Update on map click
            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
                updateSelectedLocation(e.latlng.lat, e.latlng.lng);
            });
        }, 100);
    } else {
        // Refresh map size
        setTimeout(() => map.invalidateSize(), 100);
    }
});

// Close modal
closeModal.addEventListener("click", () => {
    mapModal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === mapModal) {
        mapModal.style.display = "none";
    }
});

// Get current location using browser geolocation
getCurrentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        getCurrentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
        getCurrentLocationBtn.disabled = true;
        
        // Request high accuracy location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                
                console.log(`Location: ${lat}, ${lon}, Accuracy: ${accuracy}m`);
                
                map.setView([lat, lon], 15);
                marker.setLatLng([lat, lon]);
                updateSelectedLocation(lat, lon);
                
                getCurrentLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Current Location';
                getCurrentLocationBtn.disabled = false;
                
                // Show accuracy info
                if (accuracy > 100) {
                    alert(`Location found! (Accuracy: ±${Math.round(accuracy)}m)\n\nNote: For better accuracy, ensure location services are enabled and you're using HTTPS.`);
                }
            },
            (error) => {
                let errorMsg = "Unable to get your location. ";
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg += "Please allow location access in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg += "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMsg += "Location request timed out.";
                        break;
                    default:
                        errorMsg += "An unknown error occurred.";
                }
                
                alert(errorMsg + "\n\nYou can:\n1. Search for your city in the search box\n2. Click on the map to select location\n3. Drag the marker to adjust");
                
                getCurrentLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Current Location';
                getCurrentLocationBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,  // Request GPS if available
                timeout: 10000,             // Wait up to 10 seconds
                maximumAge: 0               // Don't use cached position
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.\n\nPlease search for your location or click on the map.");
    }
});

// Search location
let searchTimeout;
const searchResults = document.getElementById("searchResults");

searchBox.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    console.log('🔍 Search input:', query);
    
    if (query.length > 2) {
        searchResults.style.display = 'block';
        searchResults.innerHTML = '<div class="search-result-item"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
        searchTimeout = setTimeout(() => searchLocation(query), 400);
    } else {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
    }
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchBox.value.trim();
        if (query.length > 2) {
            searchLocation(query);
        }
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

async function searchLocation(query) {
    console.log('📡 Searching for:', query);
    
    try {
        // Using Nominatim with proper headers
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`, {
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        const data = await response.json();
        console.log('✅ Search results:', data.length);
        
        searchResults.innerHTML = '';
        searchResults.style.display = 'block';
        
        if (data && data.length > 0) {
            data.forEach(result => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                
                // Create a better display with icon
                item.innerHTML = `
                    <i class="fas fa-map-marker-alt" style="color: #667eea; margin-right: 8px;"></i>
                    <span>${result.display_name}</span>
                `;
                
                item.addEventListener('click', () => {
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);
                    
                    console.log(`✅ Selected location: ${lat}, ${lon}`);
                    
                    // Ensure map is initialized
                    if (map) {
                        map.flyTo([lat, lon], 15, {
                            duration: 1.5
                        });
                        marker.setLatLng([lat, lon]);
                        updateSelectedLocation(lat, lon, result.display_name);
                        
                        searchBox.value = '';
                        searchResults.innerHTML = '';
                        searchResults.style.display = 'none';
                    }
                });
                
                searchResults.appendChild(item);
            });
        } else {
            searchResults.innerHTML = '<div class="search-result-item" style="color: #9ca3af;">No results found. Try: "Delhi", "Mumbai", "Bangalore"</div>';
            searchResults.style.display = 'block';
        }
    } catch (error) {
        console.error("❌ Search error:", error);
        searchResults.innerHTML = '<div class="search-result-item" style="color: #ef4444;">Search error. Please try again or click on map.</div>';
        searchResults.style.display = 'block';
    }
}

// Update selected location display
async function updateSelectedLocation(lat, lon, placeName = null) {
    latitude = lat;
    longitude = lon;
    isLocationSelected = true;
    
    displayLat.textContent = lat.toFixed(5);
    displayLon.textContent = lon.toFixed(5);
    
    // If place name not provided, do reverse geocoding
    if (!placeName) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await response.json();
            placeName = data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        } catch (error) {
            placeName = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        }
    }
    
    selectedLocationText.textContent = placeName;
    
    // Update home page location display
    if (currentLocationName) {
        // Extract city/area name from full address
        const parts = placeName.split(',');
        const cityName = parts.length > 2 ? parts.slice(0, 2).join(',') : parts[0];
        currentLocationName.textContent = cityName.trim();
    }
    
    if (currentLatDisplay) {
        currentLatDisplay.textContent = lat.toFixed(4);
    }
    
    if (currentLonDisplay) {
        currentLonDisplay.textContent = lon.toFixed(4);
    }
}

// Confirm location and fetch weather automatically
confirmLocationBtn.addEventListener("click", async () => {
    // Mark location as selected
    isLocationSelected = true;
    
    // Show loading state
    confirmLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching weather...';
    confirmLocationBtn.disabled = true;
    
    try {
        // Fetch current weather
        const currentWeatherURL = `${live_URL}lat=${latitude}&lon=${longitude}&appid=507380f421eff9044c3f63658e1f4fab`;
        let response = await fetch(currentWeatherURL);
        let data = await response.json();
        console.log("Current weather:", data);
        
        // Update weather display with new function
        updateWeatherDisplay(data);
        
        // Fetch 12-hour forecast
        const forecastURL = `${base_URL}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m&timezone=auto`;
        let forecastResponse = await fetch(forecastURL);
        let forecastData = await forecastResponse.json();
        console.log("Forecast data:", forecastData);
        
        // Get current hour in local time
        const now = new Date();
        const currentHour = now.toISOString().slice(0, 13) + ":00";
        let index = forecastData.hourly.time.indexOf(currentHour);
        
        // If exact match not found, find closest future time
        if (index === -1) {
            const currentTime = new Date();
            for (let i = 0; i < forecastData.hourly.time.length; i++) {
                const forecastTime = new Date(forecastData.hourly.time[i]);
                if (forecastTime >= currentTime) {
                    index = i;
                    break;
                }
            }
            if (index === -1) index = 0; // fallback to start
        }
        
        // Populate forecast cards
        for (let i = 0; i < 12 && i < forecastCards.length; i++) {
            const cardIndex = index + i;
            
            if (cardIndex < forecastData.hourly.time.length) {
                const card = forecastCards[i];
                const timeStr = forecastData.hourly.time[cardIndex];
                const date = new Date(timeStr);
                const hours = date.getHours();
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHour = hours % 12 || 12;
                
                // Update time
                const timeElement = card.querySelector('.forecast-time');
                timeElement.textContent = `${displayHour}:00 ${period}`;
                
                // Update icon based on time of day
                const iconElement = card.querySelector('.forecast-icon i');
                if (hours >= 6 && hours < 12) {
                    iconElement.className = 'fas fa-sun';
                    iconElement.style.color = '#fbbf24';
                } else if (hours >= 12 && hours < 18) {
                    iconElement.className = 'fas fa-cloud-sun';
                    iconElement.style.color = '#f59e0b';
                } else if (hours >= 18 && hours < 20) {
                    iconElement.className = 'fas fa-cloud-moon';
                    iconElement.style.color = '#f97316';
                } else {
                    iconElement.className = 'fas fa-moon';
                    iconElement.style.color = '#e0e7ff';
                }
                
                // Update temperature
                const tempElement = card.querySelector('.forecast-temp');
                const temperature = forecastData.hourly.temperature_2m[cardIndex];
                tempElement.textContent = `${Math.round(temperature)}°C`;
                
                // Update humidity
                const humidElement = card.querySelector('.forecast-humid');
                const humidity = forecastData.hourly.relative_humidity_2m[cardIndex];
                humidElement.textContent = `${humidity}%`;
                
                // Update wind speed
                const windElement = card.querySelector('.forecast-wind');
                const windSpeed = forecastData.hourly.wind_speed_10m[cardIndex];
                windElement.textContent = `${windSpeed} m/s`;
            }
        }
        
        console.log("✅ Weather and forecast updated successfully!");
        
        // Close modal
        mapModal.style.display = "none";
        
        // Reset button
        confirmLocationBtn.innerHTML = 'Confirm Location & Get Weather';
        confirmLocationBtn.disabled = false;
        
    } catch(error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data. Please try again.");
        confirmLocationBtn.innerHTML = 'Confirm Location & Get Weather';
        confirmLocationBtn.disabled = false;
    }
});

// Enter new location button
btn3.addEventListener("click", (evt) => {
    evt.preventDefault();
    container.classList.remove("hide");
    container.classList.add("container");
    box.classList.add("hide");
    box.classList.remove("box");
});

// Get Today's Live Weather button
btn.addEventListener("click", async (event) => {
    event.preventDefault();

    // Check if location is selected
    if (!checkLocationSelected()) {
        showWarningModal();
        return;
    }

    const URL = `${live_URL}lat=${latitude}&lon=${longitude}&appid=507380f421eff9044c3f63658e1f4fab`;
    
    try {
        let response = await fetch(URL);
        let data = await response.json();
        console.log(data);
        
        updateWeatherDisplay(data);
    } catch(error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data. Please try again.");
    }
});

// Function to update weather display with modern cards
function updateWeatherDisplay(data) {
    // Temperature
    let temp = data.main.temp - 273.15;
    let t1 = parseFloat(temp.toFixed(1));
    msg_temp.innerHTML = `${t1}<sup>°C</sup>`;
    
    // Weather description
    const description = data.weather && data.weather[0] ? data.weather[0].description : 'Clear Sky';
    const descElement = document.querySelector('.weather-description');
    if (descElement) descElement.textContent = description;
    
    // Update large weather icon based on weather condition
    const weatherIconLarge = document.querySelector('.weather-icon-large i');
    if (weatherIconLarge && data.weather && data.weather[0]) {
        const weatherMain = data.weather[0].main.toLowerCase();
        const weatherId = data.weather[0].id;
        
        if (weatherMain.includes('clear')) {
            weatherIconLarge.className = 'fas fa-sun';
            weatherIconLarge.style.color = '#fbbf24';
        } else if (weatherMain.includes('cloud')) {
            weatherIconLarge.className = 'fas fa-cloud';
            weatherIconLarge.style.color = '#e5e7eb';
        } else if (weatherMain.includes('rain')) {
            weatherIconLarge.className = 'fas fa-cloud-rain';
            weatherIconLarge.style.color = '#60a5fa';
        } else if (weatherMain.includes('snow')) {
            weatherIconLarge.className = 'fas fa-snowflake';
            weatherIconLarge.style.color = '#e0f2fe';
        } else if (weatherMain.includes('thunder')) {
            weatherIconLarge.className = 'fas fa-cloud-bolt';
            weatherIconLarge.style.color = '#fbbf24';
        } else {
            weatherIconLarge.className = 'fas fa-cloud-sun';
            weatherIconLarge.style.color = '#f59e0b';
        }
    }
    
    // Humidity
    let humid = data.main.humidity;
    msg_humid.innerText = `${humid}%`;
    
    // Wind speed
    let wind_speed = data.wind.speed;
    msg_wind.innerText = `${wind_speed} km/h`;
    
    // Feels like temperature
    const feelsLike = document.querySelector('.feels-like');
    if (feelsLike && data.main.feels_like) {
        let feels = data.main.feels_like - 273.15;
        feelsLike.textContent = `${feels.toFixed(1)}°C`;
    }
    
    // Visibility
    const visibility = document.querySelector('.visibility');
    if (visibility && data.visibility) {
        let visKm = (data.visibility / 1000).toFixed(1);
        visibility.textContent = `${visKm} km`;
    }
}

// Get Next 12 hrs weather button
nextBtn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    
    // Check if location is selected
    if (!checkLocationSelected()) {
        showWarningModal();
        return;
    }
    
    container.classList.add("hide");
    box.classList.add("box");
    box.classList.remove("hideMore");

    const URL = `${base_URL}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m&timezone=auto`;
    
    try {
        let response = await fetch(URL);
        let data = await response.json();
        console.log(data);
        
        // Get current hour in local time
        const now = new Date();
        const currentHour = now.toISOString().slice(0, 13) + ":00";
        let index = data.hourly.time.indexOf(currentHour);
        
        // If exact match not found, find closest future time
        if (index === -1) {
            const currentTime = new Date();
            for (let i = 0; i < data.hourly.time.length; i++) {
                const forecastTime = new Date(data.hourly.time[i]);
                if (forecastTime >= currentTime) {
                    index = i;
                    break;
                }
            }
            if (index === -1) index = 0; // fallback to start
        }
        
        // Populate forecast cards
        for (let i = 0; i < 12 && i < forecastCards.length; i++) {
            const cardIndex = index + i;
            
            if (cardIndex < data.hourly.time.length) {
                const card = forecastCards[i];
                const timeStr = data.hourly.time[cardIndex];
                const date = new Date(timeStr);
                const hours = date.getHours();
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHour = hours % 12 || 12;
                
                // Update time
                const timeElement = card.querySelector('.forecast-time');
                timeElement.textContent = `${displayHour}:00 ${period}`;
                
                // Update icon based on time of day
                const iconElement = card.querySelector('.forecast-icon i');
                if (hours >= 6 && hours < 12) {
                    iconElement.className = 'fas fa-sun';
                    iconElement.style.color = '#fbbf24';
                } else if (hours >= 12 && hours < 18) {
                    iconElement.className = 'fas fa-cloud-sun';
                    iconElement.style.color = '#f59e0b';
                } else if (hours >= 18 && hours < 20) {
                    iconElement.className = 'fas fa-cloud-moon';
                    iconElement.style.color = '#f97316';
                } else {
                    iconElement.className = 'fas fa-moon';
                    iconElement.style.color = '#e0e7ff';
                }
                
                // Update temperature
                const tempElement = card.querySelector('.forecast-temp');
                const temperature = data.hourly.temperature_2m[cardIndex];
                tempElement.textContent = `${Math.round(temperature)}°C`;
                
                // Update humidity
                const humidElement = card.querySelector('.forecast-humid');
                const humidity = data.hourly.relative_humidity_2m[cardIndex];
                humidElement.textContent = `${humidity}%`;
                
                // Update wind speed
                const windElement = card.querySelector('.forecast-wind');
                const windSpeed = data.hourly.wind_speed_10m[cardIndex];
                windElement.textContent = `${windSpeed} m/s`;
            }
        }
    } catch(error) {
        console.error("Error fetching forecast data:", error);
        alert("Error fetching forecast data. Please try again.");
    }
});
