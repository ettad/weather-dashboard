var apiKey = "ffa287a41d8fa9185d665601ec3150eb" //"353e2aa09f7816521fb39f183aec1ab9";

var todaysDate = moment().format('ddd DD YYYY');
$(".day").html(todaysDate);

 // sets the five days date for the daily forcast
function date (data) {
    console.log(data); 

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
//calls the date function
// date();

let geoCoding = {
    fetchGeoCode: function (cityName) {

        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName +'&appid='+apiKey)
            .then(function (response) {
                return response.json();
            })
        
            // adds content to carousel
            .then(function (data) { 

                console.log(data)
        
                var cityName = data[0].name;
                // console.log("City name: " + cityName);
        
                var lat = data[0].lat;
                // console.log("lat: "+ lat);
        
                var lon = data[0].lon;
                // console.log("lon: " + lon);
        
                var country = data[0].country;
                // console.log("country: " + country);
        
                var state = data[0].state;
                // console.log("State: " + state);
               
                weather.fetchWeather(lon,lat,cityName, state, country);
                // date(data);
            });
    },

    search: function () {
        this.fetchGeoCode(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    geoCoding.search();
  });




let weather = {
    apiKey: "ffa287a41d8fa9185d665601ec3150eb",
    fetchWeather: function (lon,lat, city, state, country) {

        // console.log("L: " + lon + " La: "+ lat + "c: " + city +" "+ state+ " "+country);

        fetch(
            'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&exclude=minutely,hourly,alerts&appid='+apiKey
        )
        .then((response) => {

            return response.json();
        })
        .then((data) => this.displayWeather(data,city, state));
    },
    displayWeather: function (data,city, state) {
        console.log(data);
        var uvIndex = data.current.uvi;
        let temp = data.current.temp;
        let wind = data.current.wind_speed;
        let weatherIcon = data.current.weather[0].icon;
        let description = data.current.weather[0].main;
        let humidity = data.current.humidity;
        // document.querySelector("#uv").innerHTML = "UV " + uvIndex;
        $("#uv").html("UV " + uvIndex);
        document.querySelector(".city").innerHTML =(city +", "+state);
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
    },
    };
    
    document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
    });


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


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
// default city when page loads
geoCoding.fetchGeoCode("dallas");

