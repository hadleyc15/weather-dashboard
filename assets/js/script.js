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
        var searchTermCapitalized = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
        findCity(searchTermCapitalized);
    })
    //finds the weather based off of the input city
    function findCity(cityName) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + APIKey;
        $.ajax({
            type: "GET",
            url: queryURL
            //pushes searched city to a list on the left hand side of the page
        }).then(function (response) {
            var previousCity = JSON.parse(localStorage.getItem("cities"));
            console.log(previousCity)
            //check if city in search is in list
            if (previousCity) {
                //then if yes dont add to list
                if ($.inArray(cityName, previousCity) === -1) {
                    console.log("Not found in array")
                    previousCity.push(response.name)
                    localStorage.setItem("cities", JSON.stringify(previousCity));
                }

            }
            //else add to list
            else {
                searchArr.push(response.name)
                localStorage.setItem("cities", JSON.stringify(searchArr));
            }
            //transfers recieved content to HTML
            var currentCity = $(".jumbotron").addClass("city-weather").text(cityName + " Weather Details  ");
            var currentDate = moment().format("  MM-DD-YYYY");
            var windData = $("<p>").text("Wind Speed: " + response.wind.speed).addClass("lead");
            var humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("lead");
            //adds weather icon recieved from api based off of weather conditions for the given day
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

            //beggining of five day forcast portion
            var fiveDayForcast = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + APIKey;

            $.ajax({
                url: fiveDayForcast,
                type: "GET"
            }).then(function (responseFiveDayForcast) {
                console.log(responseFiveDayForcast);
                for (var i = 1; i < 6; i++) {
                    var cardbodyElem = $("<div>").addClass("card-body");

                    var fiveDayCard = $("<div>").addClass(".cardbody");
                    var fiveDate = $("<h5>").text(moment.unix(responseFiveDayForcast.daily[i].dt).format("MM/DD/YYYY"));
                    fiveDayCard.addClass("headline");
                    //coding for the daily temp for five days
                    var fiveDayTemp = $("<p>").text("Temp: " + responseFiveDayForcast.daily[i].temp.max + "°");
                    fiveDayTemp.attr("id", "#fiveDayTemp[i]");
                    //coding for the daily humidity for five days
                    var fiveHumidity = $("<p>").attr("id", "humDay").text("Humidity: " + JSON.stringify(responseFiveDayForcast.daily[i].humidity) + "%");
                    fiveHumidity.attr("id", "#fiveHumidity[i]");
                    //adds weather icons from the api
                    var iconCode = responseFiveDayForcast.daily[i].weather[0].icon;
                    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    var weatherImgDay = $("<img>").attr("src", iconURL);
                    $("#testImage").attr("src", iconURL);
                    //appends elements to the page
                    cardbodyElem.append(fiveDate);
                    cardbodyElem.append(weatherImgDay);
                    cardbodyElem.append(fiveDayTemp);
                    cardbodyElem.append(fiveHumidity);
                    fiveDayCard.append(cardbodyElem);
                    $("#five-day").append(fiveDayCard);
                    $("#fiveDayTemp[i]").empty();
                    $(".jumbotron").append(cardbodyElem);
                }
            })

            $("#search").val("");

        })

    }
    //turns previously searched cities in list in to buttons for easy searching
    $(document).on("click", ".city-btn", function () {
        JSON.parse(localStorage.getItem("cities"));
        var cityName = $(this).text();
        findCity(cityName);
    });

    function renderSearchList() {
        var searchList = JSON.parse(localStorage.getItem("cities"));
        $("#search-list").empty();
        if (searchList) {
            for (i = 0; i < searchList.length; i++) {
                var listBtn = $("<button>").addClass("btn btn-secondary city-btn").attr('id', 'cityname_' + (i + 1)).text(searchList[i]);
                var listElem = $("<li>").attr('class', 'list-group-item');
                listElem.append(listBtn);
                $("#search-list").append(listElem);
            }

        }

    }

})