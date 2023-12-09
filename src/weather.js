import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Weather({ location }) { 
    const [currentWeather, setCurrentWeather] = useState({});
    const [forecast, setForecast] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
                };

                // First API call for the first three days of forecast
                const initialForecastResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/forecast.json', {
                    params: { q: location, days: '3' },
                    headers: headers
                });
                
                let combinedForecast = [...initialForecastResponse.data.forecast.forecastday];

                // Subsequent calls for each of the next three days
                for (let i = 1; i <= 3; i++) {
                    const nextDay = new Date(initialForecastResponse.data.forecast.forecastday[2].date);
                    nextDay.setDate(nextDay.getDate() + i);
                    const formattedDate = nextDay.toISOString().split('T')[0];

                    const singleDayForecastResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/forecast.json', {
                        params: { q: location, dt: formattedDate },
                        headers: headers
                    });

                    combinedForecast.push(singleDayForecastResponse.data.forecast.forecastday[0]);
                }

                setForecast(combinedForecast);

                // Get current weather data
                const currentWeatherResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/current.json', {
                    params: { q: location },
                    headers: headers
                });
                setCurrentWeather(currentWeatherResponse.data);

            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchData();
    }, [location]);

    const getWeekday = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
        <div>
            {currentWeather.current && (
                <div className="current-condition">
                    <img src={currentWeather.current.condition.icon} alt="Weather Icon" style={{ width: '90px' }} />
                    <div>
                        <p className="current-temp">{currentWeather.current.temp_f}°F</p>
                        <p className="extraInfo1">Precipitation: {currentWeather.current.precip_mm} mm</p>
                        <p className="extraInfo2">Humidity: {currentWeather.current.humidity}%</p>
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
