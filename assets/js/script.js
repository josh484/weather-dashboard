var countryArray = [];
$(function () {

    getSearches();
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        country = $('#search-input').val();
        emptyClick();
        countryArray.push(country);
        saveCountry();
        getCountry(country);


    });



});



function createTables(city, date, weather, temp, humidity, windSpeed) {
    var weatherImg = $('<img>');
    var printTime = dayjs(date).format('DD/MM/YY')
    var createCity = $('<p>').text(city + " " + printTime);
    createCity.append(weatherImg);
    console.log(weather);
    if (weather == "Clouds") {
        weatherImg.attr('src', './assets/icons/cloudy-50.png');
    }
    var div = $('<div>');
    

    var createTemp = $('<p>').text(temp);
    var createHumidity = $('<p>').text(humidity);
    var createSpeed = $('<p>').text(windSpeed);


    div.append(createCity).append(createTemp).append(createHumidity).append(createSpeed);
    $('#mainWeather').append(div);
}

function createSTables(date, weather, temp, humidity) {
    var printTime = dayjs(date).format('DD/MM/YY')
    var card = $('<div>');
    card.attr('class', 'col card')
    var cardBody = $('<div class=future card-body>');
    var createDate = $('<p>').text(printTime + " " + weather);
    var createTemp = $('<p>').text(temp);
    var createHumidity = $('<p>').text(humidity);

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
        var button = $('<button class=btn type=submit id=historyClick>');
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

    localStorage.setItem("searches", JSON.stringify(countryArray));

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

function getCountry(country) {
    urlCountry = "http://api.openweathermap.org/geo/1.0/direct?q=" + country + "&appid=59b2f08f8e4313264cf09ebd3d5c3e14"

    fetch(urlCountry).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.length === 0) {
            alert('not a city');
            return
        }
        console.log(data)
        var lat = data[0].lat;
        var lon = data[0].lon;

        urlForecast = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=59b2f08f8e4313264cf09ebd3d5c3e14&units=metric"
        fetch(urlForecast).then(function (weather) {
            return weather.json();
        }).then(function (wData) {
            var pastTime = 0;
            console.log(wData)
            for (var i = 0; i < wData.list.length; i++) {
                var city = wData.city.name;
                var date = wData.list[i].dt_txt;
                var weather = wData.list[i].weather[0].main;
                var temp = wData.list[i].main.temp + "C";
                var humidity = wData.list[i].main.humidity;
                var windSpeed = wData.list[i].wind.speed;
                console.log(date);
                if (i == 0) {
                    createTables(city, date, weather, temp, humidity, windSpeed);
                }
                else {
                    var compareTime = dayjs(date).format('DD');
                    if(dayjs(wData.list[0].dt_txt).format('DD') != compareTime){
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