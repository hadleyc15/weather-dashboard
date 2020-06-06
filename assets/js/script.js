var city = $(".city");
var wind = $(".wind");
var humidity = $(".humidity");
var temp = $(".temp");
var searchArr = [];
var APIKey = "&appid=e8797fa70655bf6d685414b1ebccf5e5";

$(document).ready(function () {
    renderSearchList();

    $("#searchBtn").click(function (event) {
        event.preventDefault();
        var searchTerm = $("#search").val().trim();
        findCity(searchTerm);
    })

    function findCity(cityName) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + APIKey;

        $("<button>").text(cityName).prepend(".list-group-item")
        $.ajax({
            type: "GET",
            url: queryURL
        }).then(function (response) {
            var previousCity = JSON.parse(localStorage.getItem("cities"));
            if (previousCity) {
                previousCity.push(response.name);
                localStorage.setItem("cities", JSON.stringify(previousCity));
            } else {
                searchArr.push(response.name)
                localStorage.setItem("cities", JSON.stringify(searchArr));
            }
            //transfer content to HTML
            var currentCity = $(".jumbotron").addClass("city-weather").text(cityName + " Weather Details  ");
            var currentDate = moment().format("  MM-DD-YYYY");
            var windData = $("<p>").text("Wind Speed: " + response.wind.speed).addClass("lead");
            var humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("lead");
            var iconcode = response.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            var weatherImg = $("<img>").attr("src", iconurl);
            var date = $("<p>").text(moment.unix().format("MMM Do YY")).addClass("lead");
            $("#five-day").empty();
            // Convert the temp from kelvin to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            var roundedTemp = Math.floor(tempF);

            //temp elements added to html
            var tempDataF = $("<p>").text("Temp (F): " + roundedTemp + "°").addClass("lead");

            //append the elements together
            currentCity.append(weatherImg, currentDate, windData, humidityData, tempDataF);
            $("container").append(currentCity);

        

})