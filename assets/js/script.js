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
        

})