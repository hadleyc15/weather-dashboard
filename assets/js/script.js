//var elements created for the script
var city = $(".city");
var wind = $(".wind");
var humidity = $(".humidity");
var temp = $(".temp");
var searchArr = [];
//api key recieved from open weathermap.org
var APIKey = "&appid=e8797fa70655bf6d685414b1ebccf5e5";

$(document).ready(function () {
    renderSearchList();
    //makes the search button work
    $("#searchBtn").click(function (event) {
        event.preventDefault();
        var searchTerm = $("#search").val().trim();
        findCity(searchTerm);
    })
    //finds the weather based off of the input city
    function findCity(cityName) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + APIKey;
        //pushes searched city to a list on the left hand side of the page
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
            //transfers recieved content to HTML
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

            //this is what gets the uv index
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
            $.ajax({
                type: "GET",
                url: uvIndexURL,
            }).then(function (responseUV) {
                var currentUV = $("<div>").addClass('lead uv-index').text("UV Index: ");
                var uvValue = $("<span class='badge id='current-uv-level'>").text(responseUV.value);
                currentUV.append(uvValue);
                //color codes uv index number based off of uf index rating scale
                if (responseUV.value >= 0 && responseUV.value < 3) {
                    $(uvValue).addClass("uv-low");
                } else if (responseUV.value >= 3 && responseUV.value < 6) {
                    $(uvValue).addClass("uv-moderate");
                } else if (responseUV.value >= 6 && responseUV.value < 8) {
                    $(uvValue).addClass("uv-high");
                } else if (responseUV.value >= 8 && responseUV.value < 11) {
                    $(uvValue).addClass("uv-veryhigh");
                } else if (responseUV.value >= 11) {
                    $(uvValue).addClass("uv-extreme");
                }
                currentCity.append(currentUV);
                renderSearchList();
            })

           

    }

})