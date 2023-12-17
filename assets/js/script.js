$(function() {
    
    
    $('#search-button').on('click', function(event){
        country = $('#search-input').val();
        urlCountry = "http://api.openweathermap.org/geo/1.0/direct?q="+ country +"&appid=59b2f08f8e4313264cf09ebd3d5c3e14"
        event.preventDefault();
        fetch(urlCountry).then(function (response){
            return response.json();
        }).then(function(data){
            if (data.length === 0){
                alert('not a city');
                return
            }
            console.log(data)
            var lat = data[0].lat;
            var lon = data[0].lon;
            var country = data[0].state;

            urlForecast = "http://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lon +"&appid=59b2f08f8e4313264cf09ebd3d5c3e14&units=metric"
            fetch(urlForecast).then(function (weather){
                return weather.json();
            }).then(function(wData){
                console.log(wData)
                for(var i=0; i < wData.list.length; i++){
                    var city = wData.city.name;
                    var date = wData.list[i].dt_txt;
                    var weather = wData.list[i].weather[0].main;
                    var temp = wData.list[i].main.temp + "C";
                    var humidity = wData.list[i].main.humidity;
                    var windSpeed = wData.list[i].wind.speed;
                    if (i == 0){
                        createTables(city, date, weather, temp, humidity, windSpeed);
                    }
                    else{
                        createSTables(date, weather, temp, humidity);
                    }
                    
                }
                
            })
        });

    });
    
});

function createTables(city, date, weather, temp, humidity, windSpeed){
    var div = $('<div>');
    var printTime = dayjs(date).format('DD/MM/YY')
    var createCity = $('<p>').text(city);
    var createDate = $('<p>').text(printTime);
    var createWeather = $('<p>').text(weather);
    var createTemp = $('<p>').text(temp);
    var createHumidity = $('<p>').text(humidity);
    var createSpeed = $('<p>').text(windSpeed);

    div.append(createCity).append(createDate).append(createWeather).append(createTemp).append(createHumidity).append(createSpeed);
    $('#mainWeather').append(div);
}

function createSTables(date, weather, temp, humidity){
    var printTime = dayjs(date).format('DD/MM/YY')
    var div = $('<div>');
    var createDate = $('<p>').text(printTime);
    var createWeather = $('<p>').text(weather);
    var createTemp = $('<p>').text(temp);
    var createHumidity = $('<p>').text(humidity);
    var compareTime = dayjs(date).format('HH:mm:ss');
    if (compareTime == "00:00:00"){
        div.append(createDate).append(createWeather).append(createTemp).append(createHumidity);
        $('#otherWeather').append(div);

    } else{
        return;
    }
    
    
}