import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Weather({ location }) {
    const [currentWeather, setCurrentWeather] = useState({});
    const [forecast, setForecast] = useState([]);
    const [textStyle, setTextStyle] = useState({ color: 'black' }); // Default text style

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
                };

                // Fetch forecast data for the first three days
                const firstForecastResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/forecast.json', {
                    params: { q: location, days: '3' },
                    headers: headers
                });

                let combinedForecast = [...firstForecastResponse.data.forecast.forecastday];

                // Fetch forecast data for the next three days
                for (let i = 1; i <= 3; i++) {
                    const nextDay = new Date(firstForecastResponse.data.forecast.forecastday[2].date);
                    nextDay.setDate(nextDay.getDate() + i);
                    const formattedDate = nextDay.toISOString().split('T')[0];

                    const singleDayForecastResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/forecast.json', {
                        params: { q: location, dt: formattedDate },
                        headers: headers
                    });

                    combinedForecast.push(singleDayForecastResponse.data.forecast.forecastday[0]);
                }

                setForecast(combinedForecast);

                // Fetch current weather data
                const currentWeatherResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/current.json', {
                    params: { q: location },
                    headers: headers
                });

                setCurrentWeather(currentWeatherResponse.data);

                // Update the background image and text color
                if (currentWeatherResponse.data.current) {
                    const conditionCode = currentWeatherResponse.data.current.condition.code;
                    const isDay = currentWeatherResponse.data.current.is_day;
                    updateBackgroundAndTextStyle(conditionCode, isDay);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchData();
    }, [location]);

    const updateBackgroundAndTextStyle = (conditionCode, isDay) => {
        const imageUrl = getBackgroundImage(conditionCode, isDay);
        document.body.style.backgroundImage = imageUrl;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';

        // Change text color for night and keep black for snow
        if (conditionCode === 1066 || conditionCode === 1210 || conditionCode === 1213) { // Snow conditions
            setTextStyle({ color: 'black' });
        } else {
            setTextStyle({ color: isDay ? 'black' : 'white' });
        }
    };

    const getBackgroundImage = (conditionCode, isDay) => {
        switch (conditionCode) {
            case 1066: // Snow
            case 1210: // Light snow
            case 1213: // Moderate snow
                return 'url(https://wallpapers.com/images/hd/snowing-background-9niw1aqyiqkifd8u.jpg)';
            case 1183: // Light rain
            case 1186: // Moderate rain
            case 1189: // Heavy rain
                return 'url(https://dynamicpowerpoint.com/wp-content/uploads/2022/02/rain-and-clouds-full-hd-weather-icon-sample.gif)';
            default:
                return isDay 
                    ? 'url(https://pics.freeartbackgrounds.com/midle/Sky_with_Sun_Background-1481.jpg)' 
                    : 'url(https://t4.ftcdn.net/jpg/00/46/46/59/360_F_46465951_HUU3s1EmZU9j7GOM5P9q8hqkO4r13aUA.jpg)';
        }
    };

    const getWeekday = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
        <div style={textStyle}>
            {currentWeather.current && (
                <div className="current-condition">
                    <img src={currentWeather.current.condition.icon} alt="Weather Icon" style={{ width: '90px' }} />
                    <div>
                        <p className="current-temp">{currentWeather.current.temp_f}°F</p>
                        <p>Precipitation: {currentWeather.current.precip_mm} mm</p>
                        <p>Humidity: {currentWeather.current.humidity}%</p>
                    </div>
                </div>
            )}

            <div className="forecast-container">
                {forecast.length > 0 ? (
                    forecast.map((day, index) => (
                        <div className="forecast-day" key={index}>
                            <p>{getWeekday(day.date)}</p>
                            <img src={day.day.condition.icon} alt="Weather Icon" style={{ width: '50px' }} />
                            <p>High: {day.day.maxtemp_f}°F</p>
                            <p>Low: {day.day.mintemp_f}°F</p>
                        </div>
                    ))
                ) : (
                    <p>Loading forecast data...</p>
                )}
            </div>
        </div>
    );
}

export default Weather;
