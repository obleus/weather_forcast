//var apiKey = 'dd101f84962df254024e56edb578d7f0'
var weather = {
    apiKey : "dd101f84962df254024e56edb578d7f0",
   fetchWeather: function(city){
       fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey
       ).then((Response) => Response.json())
       .then((data) => this.displayWeather(data));
   },
   displayWeather: function(data) {
       const{name} = data;
       const {icon, description} = data.weather[0];
       const {temp, humidity} = data.main;
       const {speed} = data.wind;
       console.log(name,icon,description,temp,humidity,speed)
   }
}


