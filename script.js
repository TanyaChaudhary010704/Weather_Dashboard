const apiKey = "6105b6b3c28281b0e5f6d8088b8ce79a";
const cityName = document.querySelector(".input input");
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric`;
// https://api.openweathermap.org/data/2.5/forecast?q=ghaziabad&appid=6105b6b3c28281b0e5f6d8088b8ce79a
const weatherImage = document.querySelector(".weather-image");
const tempCity = document.querySelector(".temp-city");
const footer = document.querySelector(".footer");
const error = document.querySelector(".error");

async function checkWeather(cityName){
    console.log(cityName);
    const response = await fetch(`${apiUrl}&q=${cityName}&appid=${apiKey}`);
    if(response.status == 404){
        error.classList.add("visible");
        tempCity.classList.remove("visible");
        weatherImage.classList.remove("visible");
        footer.classList.remove("visible-flex");
    }else{
        const data = await response.json();
        console.log(data.list[0].weather[0].main);
        error.classList.remove("visible");
        document.getElementById("city-name").innerHTML = data['city'].name;
        document.getElementById("humid").innerHTML = `${data.list[0].main.humidity}%`;
        document.getElementById("speed").innerHTML = `${data.list[0].wind.speed} km/hr`;
        document.getElementById("temp").innerHTML = `${Math.round(data.list[0].main.temp)}&deg;c`;
        if(data.list[0].weather[0].main == "Haze"){
            data.list[0].weather[0].main = "mist";
        }
        document.querySelector(".weather-image img").src = `images/${data.list[0].weather[0].main}.png`;
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



async function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude + " " + longitude)

        const apiKey = '790766eb350c445ca6fbab9d6223c634'; // Replace with your API key
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          console.log(data.results[0].components);

          if (data.results && data.results.length > 0) {
            const city = data.results[0].components.state;

            await checkWeather(city);
            tempCity.classList.add("visible");
            weatherImage.classList.add("visible");
            footer.classList.add("visible-flex");
    
          } else {
            alert("City not found.");
          }
        } catch (error) {
          console.error("Error fetching city:", error);
        }
      }, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }

  window.onload = getLocation;
