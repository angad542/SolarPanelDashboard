let weatherData = {
    location: "West",
    currentTemp: 40,
    weatherCondition: "Sunny",
    tempRange: "46/30°C",
    sunrise: "05:23",
    sunset: "19:19",
    forecast: [
        { day: "Thursday", date: "06/12", condition: "Sunny", temp: "47/38°C" },
        { day: "Friday", date: "06/13", condition: "Sunny", temp: "48/38°C" },
        { day: "Saturday", date: "06/14", condition: "Cloudy", temp: "47/37°C" }
    ]
};

function updateTime() {
    const now = new Date();
    const updateElement = document.getElementById('update-time');
    
    const minutesAgo = Math.floor(Math.random() * 10) + 1;
    updateElement.textContent = `Updated ${minutesAgo} minutes ago`;
}
function getWeatherIcon(condition) {
    const icons = {
        'sunny': '☀️',
        'cloudy': '☁️',
        'rainy': '🌧️',
        'snowy': '❄️',
        'partly cloudy': '⛅',
        'thunderstorm': '⛈️'
    };
    return icons[condition.toLowerCase()] || '☀️';
}
function formatForecastDates() {
    const today = new Date();
    const forecast = [];
    for (let i = 1; i <= 3; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        const dayName = futureDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = futureDate.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit' 
        });
        
        forecast.push({
            day: dayName,
            date: dateStr,
            condition: weatherData.forecast[i-1].condition,
            temp: weatherData.forecast[i-1].temp
        });
    }
    
    return forecast;
}

function updateWeatherDisplay() {
    document.getElementById('location').textContent = weatherData.location;
    document.getElementById('current-temp').textContent = weatherData.currentTemp;
    document.getElementById('weather-condition').textContent = weatherData.weatherCondition;
    document.getElementById('temp-range').textContent = weatherData.tempRange;
    document.getElementById('weather-icon').textContent = getWeatherIcon(weatherData.weatherCondition);
    
    document.getElementById('sunrise').textContent = weatherData.sunrise;
    document.getElementById('sunset').textContent = weatherData.sunset;
    
    const forecastData = formatForecastDates();
    forecastData.forEach((day, index) => {
        const dayNum = index + 1;
        document.getElementById(`day${dayNum}`).textContent = `${day.day} ${day.date}`;
        document.getElementById(`condition${dayNum}`).textContent = day.condition;
        document.getElementById(`temp${dayNum}`).textContent = day.temp;
    });
}

async function fetchWeatherData() {
    try {
        weatherData.currentTemp = Math.floor(Math.random() * 10) + 35;
        
        updateWeatherDisplay();
        updateTime();
        
        console.log('Weather data updated:', weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}
function handleRefresh() {
    const refreshBtn = document.getElementById('refresh');
    refreshBtn.style.transform = 'rotate(360deg)';
    refreshBtn.style.transition = 'transform 0.5s ease';
    
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 500);
    
    fetchWeatherData();
}
function initWeatherWidget() {
    updateWeatherDisplay();
    updateTime();
    document.getElementById('refresh').addEventListener('click', handleRefresh);
    setInterval(updateTime, 60000);
    setInterval(fetchWeatherData, 300000);
}
function processApiData(apiData) {
    return {
        location: apiData.location?.name || "Unknown",
        currentTemp: Math.round(apiData.current?.temp_c) || 0,
        weatherCondition: apiData.current?.condition?.text || "Unknown",
        tempRange: `${Math.round(apiData.forecast?.forecastday[0]?.day?.maxtemp_c)}/${Math.round(apiData.forecast?.forecastday[0]?.day?.mintemp_c)}°C`,
        sunrise: apiData.forecast?.forecastday[0]?.astro?.sunrise || "06:00",
        sunset: apiData.forecast?.forecastday[0]?.astro?.sunset || "18:00",
        forecast: apiData.forecast?.forecastday?.slice(1, 4).map(day => ({
            condition: day.day.condition.text,
            temp: `${Math.round(day.day.maxtemp_c)}/${Math.round(day.day.mintemp_c)}°C`
        })) || []
    };
}
document.addEventListener('DOMContentLoaded', initWeatherWidget);