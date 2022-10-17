var todaysDate = moment().format('ddd DD YYYY');
$(".day").html(todaysDate);


 // sets the five days date for the daily forcast
function date () {
    $(".days").each(function () {
        for (i=1; i<6; i++) {
            var new_date = moment().add(i,'d').format('ddd DD');
            $("#card-title"+i).html(new_date)
        }

    })
}
//calls the date function
date();


let weather = {
    apiKey: "API KEY GOES HERE",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },

}
