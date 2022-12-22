function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours() % 12 || 12;
  if (hours < 10) {
    hours = `${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `     <div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
                <div class="col-2">
                  <div class="weather-forecast-date">${formatDay(
                    forecastDay.time
                  )}</div>
                  <img
                    src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                      forecastDay.condition.icon
                    }.png"
                    al=""
                    width="42"
                  />
                  <div class="weather-forecast-temperatures">
                    <span class="weather-forecast-temp-max"> ${Math.round(
                      forecastDay.temperature.maximum
                    )}°</span
                    ><span class="weather-forecast-temp-min"> ${Math.round(
                      forecastDay.temperature.minimum
                    )}°</span>
                  </div>
                </div>
                `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "17bea467ff3t4a53074dbc5a4o607dac";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial
`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  temperature = response.data.temperature.current;
  document.querySelector("#temperature").innerHTML = Math.round(temperature);
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = response.data.wind.speed;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.time * 1000
  );
  let iconElement = document.querySelector("#icon");

  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "17bea467ff3t4a53074dbc5a4o607dac";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function gpsTemperature(position) {
  console.log(position);
  let apiKey = "17bea467ff3t4a53074dbc5a4o607dac";
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
  console.log(apiUrl);
}

function handlePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(gpsTemperature);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", handlePosition);

let temperature = null;

search("Seattle");
displayTemperature();
