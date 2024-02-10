const apiKey = "6105b6b3c28281b0e5f6d8088b8ce79a";
const cityName = document.querySelector(".input input");
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric`;
const weatherImage = document.querySelector(".weather-image");
const tempCity = document.querySelector(".temp-city");
const footer = document.querySelector(".footer");
const error = document.querySelector(".error");

async function checkWeather(cityName){
    const response = await fetch(`${apiUrl}&q=${cityName}&appid=${apiKey}`);
    if(response.status == 404){
        error.classList.add("visible");
        tempCity.classList.remove("visible");
        weatherImage.classList.remove("visible");
        footer.classList.remove("visible-flex");

    }else{
        const data = await response.json();
        error.classList.remove("visible");
        document.getElementById("city-name").innerHTML = data.name;
        document.getElementById("humid").innerHTML = `${data.main.humidity}%`;
        document.getElementById("speed").innerHTML = `${data.wind.speed} km/hr`;
        document.getElementById("temp").innerHTML = `${Math.round(data.main.temp)}&deg;c`;
        if(data.weather[0].main == "Haze"){
            data.weather[0].main = "mist";
        }
        document.querySelector(".weather-image img").src = `images/${data.  weather[0].main}.png`;
    }
}

document.getElementById("search").addEventListener("click",()=>{
    if(cityName.value.trim()){
        checkWeather(cityName.value.trim());
        tempCity.classList.add("visible");
        weatherImage.classList.add("visible");
        footer.classList.add("visible-flex");
    }else{
        tempCity.classList.remove("visible");
        weatherImage.classList.remove("visible");
        footer.classList.remove("visible-flex");
        error.classList.add("visible");
    }
    cityName.value = "";
});


cityName.addEventListener("keydown",(event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search").click();
      }
} )