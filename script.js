// API key
const apiKey = "6105b6b3c28281b0e5f6d8088b8ce79a";

// API URL
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric`;
// https://api.openweathermap.org/data/2.5/forecast?q=ghaziabad&appid=6105b6b3c28281b0e5f6d8088b8ce79a

// Variables declaration
const cityName = document.querySelector(".input input");

const weatherImage = document.querySelector(".weather-image");

const tempCity = document.querySelector(".temp-city");

const temp1 = document.querySelector(".temp1");

const temp2 = document.querySelector(".temp2");

const temp3 = document.querySelector(".temp3");

const temp4 = document.querySelector(".temp4");

const footer = document.querySelector(".footer");

const error = document.querySelector(".error");



// function to check weather of city (cityName)
async function checkWeather(cityName){

    console.log(cityName);
    const response = await fetch(`${apiUrl}&q=${cityName}&appid=${apiKey}`);

    // unable to fetch api
    if(response.status == 404){

        error.classList.add("visible");
        tempCity.classList.remove("visible");

        weatherImage.classList.remove("visible");
        footer.classList.remove("visible-flex");
    
    }else{
        const data = await response.json();
        console.log(data.list[0].visibility);
        error.classList.remove("visible");

        // changing images of last container according to the weather
        const image = "sky.jpg";

        if(data.list[0].weather[0].main == "rain" || data.list[0].weather[0].main == "drizzle" ){
            image = "rainy.jpg";
        }else if(data.list[0].weather[0].main == "clouds" || data.list[0].weather[0].main == "Haze"  || data.list[0].weather[0].main == "Mist" ){
            image = "cloudy.jpg";
        }else if(data.list[0].weather[0].main == "snow" ){
            image = "snowy.jpg";
        }
        document.getElementById("last-container").style.backgroundImage = `url(images/${image})`;


        // temperature of next four days 
        temp1.innerHTML = data.list[8].main.temp;
        temp2.innerHTML = data.list[16].main.temp;
        temp3.innerHTML = data.list[24].main.temp;
        temp4.innerHTML = data.list[32].main.temp;

        // weather images of next four days 
        document.querySelector(".image1").src = `images/${data.list[8].weather[0].main}.png`;
        document.querySelector(".image2").src = `images/${data.list[16].weather[0].main}.png`;
        document.querySelector(".image3").src = `images/${data.list[24].weather[0].main}.png`;
        document.querySelector(".image4").src = `images/${data.list[32].weather[0].main}.png`;

        // visibility section
        document.querySelector(".vis").innerHTML = (data.list[0].visibility)/1000;

        // weather conditions of present day 
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


// function calling on clicking on search button
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

// search when user press enter button
cityName.addEventListener("keydown",(event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search").click();
      }
} )


// Get user's current location using geolocation and opencage api
async function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude + " " + longitude)

        const apiKey = '790766eb350c445ca6fbab9d6223c634';
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        //  converting latitude and longitude values to city name
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          console.log(data.results[0].components);

          if (data.results && data.results.length > 0) {
            const city = data.results[0].components.city;

            // passing the current city name in checkWeather function
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

// if unable to get current location of user, it will show error
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

  // when window is loaded, webpage will fetch the user's location
  window.onload = getLocation;
