import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Weather({ location }) { 
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState({});

  useEffect(() => {
    const currentOptions = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: { q: location },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };

    const forecastOptions = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
      params: { q: location, days: '3' },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };

    // Make the API call for current weather
    axios.request(currentOptions)
      .then(response => {
        console.log("Weather data:", response.data);
        setCurrentWeather(response.data);
      })
      .catch(error => {
        console.error('Error fetching current weather data:', error);
      });

    // Make the API call for the forecast
    axios.request(forecastOptions)
      .then(response => {
        console.log("Future data:", response.data);
        setForecast(response.data);
      })
      .catch(error => {
        console.error('Error fetching forecast data:', error);
      });

  }, [location]); 

  return (
    <div>
      <h2>Weather Data</h2>
      <p>
        {currentWeather.current ? `Current Temperature: ${currentWeather.current.temp_f}°F` : 'Loading current weather data...'}
      </p>
      <h2>Forecast</h2>
      {forecast.forecast && forecast.forecast.forecastday ? (
        forecast.forecast.forecastday.map((day, index) => (
          <div key={index}>
            <p>Date: {day.date}</p>
            <p>Max Temperature: {day.day.maxtemp_f}°F</p>
            <p>Min Temperature: {day.day.mintemp_f}°F</p>
          </div>
        ))
      ) : (
        <p>Loading forecast data...</p>
      )}
    </div>
  );
}

export default Weather;
