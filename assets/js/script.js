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

    

})