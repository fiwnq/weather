// this file has the api calls currently just has current weather data
//i chose to use axios which is now a dependency though we are still early and it theoretically be HTTP

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Weather() {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const options = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: { q: 'Nashville US' },
      headers: {
        'X-RapidAPI-Key': abe3c0b973msh83343a6b8389ddap1f8c7bjsn589789365ccd, // removed env for simplicity
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };
    axios.request(options)
      .then(response => {
        console.log("Weather data:", response.data);
        setWeather(response.data); // stores what we got from the api call
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });

  }, []);

  
};

export default Weather;
