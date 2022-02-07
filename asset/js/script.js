var apiKey = 'dd101f84962df254024e56edb578d7f0'
var cityFormEl = document.querySelector("#city-form")
var cityInputEl = document.querySelector("#city")
var weather = ("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey
)



var weather = function(city){
       fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey
       ).then((Response) => Response.json())
       .then((data) => console.log(data));
   };


var formSubmitHandler = function(event) {
    event.preventDefault();
    var citysearch = cityInputEl.value.trim();
    if (citysearch) {
        weather(citysearch);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city")
    }
    
    console.log(event)
};

// EVENT LISTENERS //
cityFormEl.addEventListener("submit", formSubmitHandler);


