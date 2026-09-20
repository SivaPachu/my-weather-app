import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');

  const API_KEY = '6d4af92fd0a8418296659812a5fd327a';

  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const formatTime = (timestamp, timezoneOffset) => {
    if (!timestamp) return 'N/A';

    const localDate = new Date((timestamp + timezoneOffset) * 1000);
    return localDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please check the spelling and try again.');
      } else {
        setError('Failed to fetch weather data. Please check your API key.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="weather-container">

      <form onSubmit={fetchWeather} className="search-form">
        <input
          type="text"
          placeholder="Enter city name (e.g. London, Tokyo)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {weatherData && (
        <div className="unit-toggle-container">
          <button
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>
      )}

      {loading && <div className="loading-spinner">Loading weather data...</div>}

      {error && <div className="error-message">{error}</div>}

      {weatherData && (
        <section className="weather-card">
          <div className="weather-header">
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="weather-desc">
              {weatherData.weather[0].description}
            </p>
          </div>

          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
              className="weather-icon"
            />
            <div className="temp-main-display">
              <span className="actual-temp-value">
                {convertTemp(weatherData.main.temp)}°{unit}
              </span>
              <span className="feels-like-desc">
                Feels like {convertTemp(weatherData.main.feels_like)}°{unit}
              </span>
            </div>
          </div>

          <div className="weather-details">

            <div className="detail-item highlight-min">
              <span className="detail-label">
                <span className="card-icon">⬇️</span> Min Temp
              </span>
              <span className="detail-value min-temp-val">
                {convertTemp(weatherData.main.temp_min)}°{unit}
              </span>
            </div>

            <div className="detail-item highlight-max">
              <span className="detail-label">
                <span className="card-icon">⬆️</span> Max Temp
              </span>
              <span className="detail-value max-temp-val">
                {convertTemp(weatherData.main.temp_max)}°{unit}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <span className="card-icon">🌡️</span> Feels Like
              </span>
              <span className="detail-value">
                {convertTemp(weatherData.main.feels_like)}°{unit}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <span className="card-icon">💧</span> Humidity
              </span>
              <span className="detail-value">{weatherData.main.humidity}%</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <span className="card-icon">🌬️</span> Wind Speed
              </span>
              <span className="detail-value">{weatherData.wind.speed} m/s</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <span className="card-icon">⏱️</span> Pressure
              </span>
              <span className="detail-value">{weatherData.main.pressure} hPa</span>
            </div>

            {weatherData.sys.sunrise && (
              <div className="detail-item">
                <span className="detail-label">
                  <span className="card-icon">🌅</span> Sunrise
                </span>
                <span className="detail-value">
                  {formatTime(weatherData.sys.sunrise, weatherData.timezone)}
                </span>
              </div>
            )}

            {weatherData.sys.sunset && (
              <div className="detail-item">
                <span className="detail-label">
                  <span className="card-icon">🌇</span> Sunset
                </span>
                <span className="detail-value">
                  {formatTime(weatherData.sys.sunset, weatherData.timezone)}
                </span>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default Weather;