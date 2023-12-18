var countryArray = [];
$(function () {

    getSearches();
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        country = $('#search-input').val();
        emptyClick();
        getCountry(country);
        if (countryArray.includes(country) == false) {
            countryArray.push(country);
        }

        saveCountry();
        localStorage.setItem("searches", JSON.stringify(countryArray));
    });



});



function createTables(city, date, weather, temp, humidity, windSpeed) {
    var weatherImg = $('<img>');
    var printTime = dayjs(date).format('DD/MM/YY')
    var createCity = $('<p>').text(city + " " + printTime);
    createCity.append(weatherImg);

    icons(weather, weatherImg);
    var div = $('<div>');


    var createTemp = $('<p>').text("Temperature: " + temp + "°C");
    var createHumidity = $('<p>').text("Humidity: " + humidity + "%");
    var createSpeed = $('<p>').text("Windspeed: " + windSpeed + "km");


    div.append(createCity).append(createTemp).append(createHumidity).append(createSpeed);
    $('#mainWeather').append(div);
}

function createSTables(date, weather, temp, humidity) {
    var printTime = dayjs(date).format('DD/MM/YY')
    var card = $('<div>');
    card.attr('class', 'col-lg card col-sm-12')
    card.attr('id', 'future')
    var cardBody = $('<div class=card-body>');
    var weatherImg = $('<img>');
    icons(weather, weatherImg);
    var createDate = $('<p>').text(printTime + " ");
    createDate.append(weatherImg)
    var createTemp = $('<p>').text("Temperature: " + temp + "°C");
    var createHumidity = $('<p>').text("Humidity: " + humidity + "%");

    cardBody.append(createDate).append(createTemp).append(createHumidity);
    card.append(cardBody);
    $('#otherWeather').append(card);

}

function saveCountry() {
    var getDiv = $('#history');
    if (countryArray.length > 5) {
        countryArray.shift();
    }
    for (var i = 0; i < countryArray.length; i++) {
        var button = $('<button  type=submit id=historyClick>');
        button.attr('class', 'btn btn-primary');
        button.text(countryArray[i]);
        getDiv.append(button);

        button.on('click', function (event) {
            event.preventDefault();
            var country = $(event.target).text();
            $('#mainWeather').empty()
            $('#otherWeather').empty()
            getCountry(country);
        });
    }
        
}

function getSearches() {
    var getCountry = JSON.parse(localStorage.getItem("searches"));
    if (getCountry !== null) {
        countryArray = getCountry;
    }
    saveCountry(countryArray);
}

function emptyClick() {
    $('#mainWeather').empty()
    $('#otherWeather').empty()
    $('#history').empty()
}

function icons(weather, weatherImg) {
    switch (weather) {
        case 'Clouds':
            weatherImg.attr('src', './assets/icons/cloudy-50.png');
            weatherImg.attr('alt', 'cloudy-50 by Icons8');
            break;

        case 'Thunderstorm':
            weatherImg.attr('src', './assets/icons/icons8-thunder-30.png');
            weatherImg.attr('alt', 'thunder-30 by Icons8');
            break;

        case 'Drizzle':
            weatherImg.attr('src', './assets/icons/icons8-thunder-30.png');
            weatherImg.attr('alt', 'Drizzle icon by Icons8');
            break;

        case 'Rain':
            weatherImg.attr('src', './assets/icons/icons8-rain-50.png');
            weatherImg.attr('alt', 'Rain icon by Icons8');
            break;

        case 'Snow':
            weatherImg.attr('src', './assets/icons/icons8-snow-50.png');
            weatherImg.attr('alt', 'Snow icon by Icons8');
            break;

        case 'Clear':
            weatherImg.attr('src', './assets/icons/icons8-snow-50.png');
            weatherImg.attr('alt', 'Sun icon by Icons8');
            break;
    }
}

function getCountry(country) {
    if ( country == ""){
        $('#hide').show()
        return;
    }
    urlCountry = "http://api.openweathermap.org/geo/1.0/direct?q=" + country + "&appid=59b2f08f8e4313264cf09ebd3d5c3e14"

    fetch(urlCountry).then(function (response) {
        return response.json();
    }).then(function (data) {
        
        if (data.length == 0) {
            $('#hide').show()
            return 
        } else {
            $('#hide').hide()
        }

        var lat = data[0].lat;
        var lon = data[0].lon;

        urlForecast = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=59b2f08f8e4313264cf09ebd3d5c3e14&units=metric"
        fetch(urlForecast).then(function (weather) {
            return weather.json();
        }).then(function (wData) {
            var pastTime = 0;
            for (var i = 0; i < wData.list.length; i++) {
                var city = wData.city.name;
                var date = wData.list[i].dt_txt;
                var weather = wData.list[i].weather[0].main;
                var temp = wData.list[i].main.temp;
                var humidity = wData.list[i].main.humidity;
                var windSpeed = wData.list[i].wind.speed;
                if (i == 0) {
                    createTables(city, date, weather, temp, humidity, windSpeed);
                }
                else {
                    var compareTime = dayjs(date).format('DD');
                    if (dayjs(wData.list[0].dt_txt).format('DD') != compareTime) {
                        if (pastTime != compareTime) {
                            pastTime = compareTime;
                            createSTables(date, weather, temp, humidity);
                        }
                    }


                }

            }

        })
    });
}

