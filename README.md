# Weather App 🌤️

A beautiful weather application with an interactive map to check current weather and upcoming 12-hour forecasts for any location worldwide.

## Features ✨

- **Interactive Map**: Click anywhere on the map or drag the marker to select a location
- **Real-time Weather**: Get current temperature, humidity, and wind speed
- **12-Hour Forecast**: View upcoming weather for the next 12 hours starting from the current time
- **Beautiful UI**: Clean and responsive design with easy-to-read weather cards

## How to Use 🚀

1. **Open the app**: Open `index.html` in your web browser
   - For best results, use a local server (see below)

2. **Select Location**:
   - Click anywhere on the map to set a location
   - Or drag the marker to your desired location
   - Or enter latitude/longitude manually in the input fields

3. **Get Weather**:
   - Click **"Get Today's Live Weather"** to see current conditions
   - Click **"Get Next 12 hrs weather"** to see hourly forecast

## Running Locally 💻

### Option 1: Using Python
```powershell
python -m http.server 5500
```
Then open http://localhost:5500 in your browser

### Option 2: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

## Technologies Used 🛠️

- **Leaflet.js**: Interactive map functionality
- **OpenWeatherMap API**: Current weather data
- **Open-Meteo API**: Hourly forecast data (no API key required)
- **Vanilla JavaScript**: Core functionality
- **HTML5 & CSS3**: Structure and styling

## API Information 📡

- Current weather: OpenWeatherMap API
- Forecast data: Open-Meteo API (free, no registration required)

## Improvements Made 🎯

✅ **Beautiful Modern UI** with gradient backgrounds and smooth animations  
✅ **Interactive Map Modal** - Click "Add Location" to open full-screen map  
✅ **Location Search** with dropdown results - Search any city/place  
✅ **Current Location** with high-accuracy GPS detection  
✅ **Auto Weather Fetch** - Automatically gets weather when you select location  
✅ **Fixed 12-hour timing** to start from current hour (not fixed 18:00-06:00)  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Smooth Animations** - Cards fade in with staggered timing  
✅ **Better Error Handling** - Clear messages when something goes wrong  

## Future Enhancements 🔮

- Add geolocation to auto-detect user's location
- Add weather icons for better visualization
- Add 7-day forecast view
- Add favorite locations feature
- Dark mode toggle

---

Made with ❤️ by Manish Jeena