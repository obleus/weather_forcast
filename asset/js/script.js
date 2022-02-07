var apiKey = 'dd101f84962df254024e56edb578d7f0'
var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city');
var btnContainer = document.querySelector('.btn-container');
var dashboardEl = document.querySelector('#dashboard');
var forecastEl = document.querySelector('#forecast');
var cityHistory = [];


var formSubmitHandler = function (event) {
    event.preventDefault();
    dashboardEl.textContent = '';
    dashboardEl.classList = '';
    forecastEl.textContent = '';
    var city = cityInputEl.value.trim();
    if (city) {
      cityInputEl.value = '';
      return getCityLatLng(city);
    } else if (event.target.classList.contains('btn-light')) {
      return getCityLatLng(event.target.textContent);
    } else {
      alert('Please enter the name of a valid city.');
      return false;
    }
  };
  
  var getCityLatLng = function (city) {

    var apiLocUrl =
      'https://api.openweathermap.org/geo/1.0/direct?q=' +
      city +
      '&limit=1&appid=' +
      apiKey;
  
    fetch(apiLocUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getWeatherData(data[0].lat, data[0].lon, data[0].name);
          if (cityHistory.includes(city.toLowerCase()) === false) {
            cityHistory.unshift(city.toLowerCase());
            localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
            createHistoryButton(city);
          }
        });
      } else {
        alert('City not found.');
      }
    });
  };
  
  var getWeatherData = function (lat, lon, city) {
    var apiWeatherUrl =
      'https://api.openweathermap.org/data/2.5/onecall?lat=' +
      lat +
      '&lon=' +
      lon +
      '&units=imperial&exclude=minutely,hourly&appid=' +
      apiKey;
  
    fetch(apiWeatherUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displayWeatherData(data, city);
          });
        } else {
          alert('Something went wrong!');
        }
      })
      .catch(function () {
        alert('Unable to connect to OpenWeather.');
      });
  };
  
  var displayWeatherData = function (data, city) {
    var today = dayjs();
    var curr = data.current;
    var daily = data.daily;
    var iconUrl = 'https://openweathermap.org/img/wn/';
  

    var cityNameEl = document.createElement('h2');
    cityNameEl.textContent = city;
  

    var dateEl = document.createElement('span');
    dateEl.textContent = ` (${today.format('MM/DD/YYYY')})`;
    cityNameEl.appendChild(dateEl);
  

    var iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconUrl + curr.weather[0].icon + '.png');
    cityNameEl.appendChild(iconEl);
    var weatherDiv = document.createElement('div');
  
    weatherDiv.innerHTML = `
    <p>Temp: ${curr.temp}&degF</p>
    <p>Wind: ${curr.wind_speed} MPH</p>
    <p>Humidity: ${curr.humidity} %</p>
    <p>UV Index: <span id="uvi">${curr.uvi}</span></p>
    `;
  
   
    dashboardEl.append(cityNameEl, weatherDiv);
    dashboardEl.classList = 'border border-dark mt-2 p-2';
  
    
    var uvi = document.querySelector('#uvi');
    var index = Math.floor(curr.uvi);
  
    if (index <= 2) {
      uvi.classList = 'badge bg-success';
    } else if (index >= 3 && index <= 7) {
      uvi.classList = 'badge bg-warning';
    } else {
      uvi.classList = 'badge bg-danger';
    }
  
    // Forecast information]
    var forecastHeader = document.createElement('h2');
    forecastHeader.textContent = '5-Day Forecast:';
    forecastEl.classList = 'row justify-content-around mt-2 mb-2';
    forecastEl.append(forecastHeader);
  
    for (var i = 0; i <= 4; i++) {
      var card = document.createElement('div');
      card.classList = 'col-2 border border-dark card p-2';
      card.innerHTML = `
      <h3 class="card-title fw-bold fs-5">${today
        .add(i + 1, 'day')
        .format('MM/DD/YYYY')}</h3>
      <img src="${iconUrl + daily[i].weather[0].icon + '.png'}" />
      <p>Temp: ${daily[i].temp.max}&deg F</p>
      <p>Wind: ${daily[i].wind_speed}</p>
      <p>Humidity: ${daily[i].humidity} %</p>
      `;
      forecastEl.append(card);
    }
  };
  
  var createHistoryButton = function (city) {
    var button = document.createElement('button');
    button.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    button.classList = 'btn btn-light mb-3 w-100';
    btnContainer.append(button);
  };
  
  var loadHistory = function () {
    // Get search history from localStorage
    var searchedCities = localStorage.getItem('cityHistory');
  
    // If localStorage is empty, do nothing
    if (!searchedCities) {
      return false;
    }
  

    searchedCities = JSON.parse(searchedCities);
  

    for (var i = 0; i < searchedCities.length; i++) {
      cityHistory.push(searchedCities[i]);
      createHistoryButton(searchedCities[i]);
    }
  };
  
 

  cityFormEl.addEventListener('submit', formSubmitHandler);
  btnContainer.addEventListener('click', formSubmitHandler);
  loadHistory();
 
  