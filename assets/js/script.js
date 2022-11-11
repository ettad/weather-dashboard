var apiKey = "ffa287a41d8fa9185d665601ec3150eb"
const historyEl = document.getElementById("history");
const clearEl = document.getElementById("clear");
let locationHistory = JSON.parse(localStorage.getItem("locations")) || [];

var todaysDate = moment().format('ddd DD YYYY');
$(".day").html(todaysDate);

 // sets the five days date for the daily forecast
function date (data) {


    $(".days").each(function () {
        // console.log(data);
        for (i=1; i<6; i++) {
            let new_date = moment().add(i,'d').format('ddd DD');
            $("#card-title"+i).html(new_date)

            let temp = data.daily[i].temp.day;
            $(".temp" + i).html(Math.round(temp) + "°");
        
            let wind = data.daily[i].wind_speed;
            $(".wind" +i).html("Wind " + Math.round(wind) + " mph")

            let weatherIcon = data.daily[i].weather[0].icon;
            document.querySelector(".icon" + i).src =
            "https://openweathermap.org/img/wn/" + weatherIcon + ".png";

            let description = data.daily[i].weather[0].main;
            $(".condition" + i).html(description);

            let humidity = data.daily[i].humidity;
            $(".humidity" + i).html("Humidity " + humidity + "%");

            
        }

    })
}

//create geoCoding object and passes data to other functions
let geoCoding = {
    fetchGeoCode: function (cityName) {

        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName +'&appid='+apiKey)
            .then(function (response) {
                return response.json();
            })
        
            // adds content to carousel
            .then(function (data) { 
        
                var cityName = data[0].name;
                var lat = data[0].lat;
                var lon = data[0].lon;
                var country = data[0].country;
                var state = data[0].state;
               
                weather.fetchWeather(lon,lat,cityName, state, country);
            });
    },
    // get value from search
    search: function () {
        this.fetchGeoCode(document.querySelector(".search-bar").value);
    },
};

// call search to run the funciton
document.querySelector(".search button").addEventListener("click", function () {
    geoCoding.search();
  });




let weather = {

    fetchWeather: function (lon,lat, city, state, country) {


        fetch(
            'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&exclude=minutely,hourly,alerts&appid='+apiKey
        )
        .then((response) => {

            return response.json();
        })
        .then((data) => this.displayWeather(data,city, state,country));
    },
    displayWeather: function (data,city, state, country) {
        var uvIndex = data.current.uvi;
        let temp = data.current.temp;
        let wind = data.current.wind_speed;
        let weatherIcon = data.current.weather[0].icon;
        let description = data.current.weather[0].main;
        let humidity = data.current.humidity;
        document.querySelector("#uv").innerHTML = "UV " + uvIndex;
        $("#uv").html("UV " + uvIndex);
        document.querySelector(".city").innerHTML =(city +", "+state + ", " + country);
        document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
        document.querySelector(".condition").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°";
        document.querySelector(".humidity").innerText =
        "Humidity " + humidity + "%";
        document.querySelector(".wind").innerHTML =
        "Wind " + wind + " mph";
        uvi(uvIndex);
        date(data);
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);

        let locationSearch = document.querySelector(".search-bar").value
        locationHistory.push(locationSearch.toUpperCase());
        localStorage.setItem("locations", JSON.stringify(locationHistory));
        
        renderSearchHistory();
    },

};
    
document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

// for uv index color coding --------------------------
  var uvi = function (uvI){
    if(uvI <= 2) {
        document.querySelector("#uv").className = "low";
    }else if (uvI > 2 && uvI < 5) {
        // moderate - yellow
        document.querySelector("#uv").className = "moderate";
    }else if (uvI >= 5 && uvI <= 7) {
        // high - orange
        document.querySelector("#uv").className = "high";

    }else
        //very high - red
        document.querySelector("#uv").className = "veryHigh";
  }


//create history on page load
function renderSearchHistory() {

    historyEl.innerHTML = "";

    for (let i = 0; i < locationHistory.length; i++) {

        const historyItem = document.createElement("input");

        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control");
        historyItem.setAttribute("value", locationHistory[i]);

        historyItem.addEventListener("click", function () {
            geoCoding.fetchGeoCode(historyItem.value)
        })

        historyEl.append(historyItem);

    }

}

 //clear location history
 clearEl.addEventListener("click", function () {

    localStorage.clear();
    locationHistory = [];

    renderSearchHistory();
})

renderSearchHistory();




// default city when page loads
geoCoding.fetchGeoCode("lonetree");


