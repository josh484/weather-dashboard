/* create array for countries */
var countryArray = [];
$(function () {

    /* get countries stored in local storage */
    getSearches();
    /* update search history buttons */
    saveCountry();
    /* when clicking search button get the value and use for the functions */
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        country = $('#search-input').val();
        emptyClick();
        getCountry(country);

    });

});


/* Creates todays weather using data from api */
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

/* Creates the next 5 days' weather using data from api */
function createSTables(date, weather, temp, humidity) {
    var printTime = dayjs(date).format('DD/MM/YY')
    var card = $('<div>');
    card.attr('class', 'col-lg card ')
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

/* Prints out buttons for each country in the countryarray up to 5 */
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
            getCountry(country);
        });
    }

}

/* Get from local storage the country and input to the country array */
function getSearches() {
    var getCountry = JSON.parse(localStorage.getItem("searches"));
    if (getCountry !== null) {
        countryArray = getCountry;
    }

}

/* Clear respective divs */
function emptyClick() {
    $('#mainWeather').empty()
    $('#otherWeather').empty()
    $('#history').empty()
}

/* Depending on the weather change the icon */
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

/* Call API using the country value from the search or button pressed */
function getCountry(country) {
    if (country == "") {
        $('#hide').show()
        saveCountry();
        return;
    }
    urlCountry = "https://api.openweathermap.org/geo/1.0/direct?q=" + country + "&appid=59b2f08f8e4313264cf09ebd3d5c3e14"

    fetch(urlCountry).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.length == 0) {
            $('#hide').show();
            saveCountry();
            return
        } else {
            if (countryArray.includes(country) == false) {
                countryArray.push(country);
            }
            /* Save updated country array to local storage */
            localStorage.setItem("searches", JSON.stringify(countryArray));
            $('#hide').hide()
            countryArray = JSON.parse(localStorage.getItem("searches"));
            if (countryArray.length > 5) {
                countryArray.shift();
                
            }
            emptyClick();
            saveCountry();
        }

        var lat = data[0].lat;
        var lon = data[0].lon;

        urlForecast = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=59b2f08f8e4313264cf09ebd3d5c3e14&units=metric"
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

