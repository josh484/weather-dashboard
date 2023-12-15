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

            urlForecast = "http://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lon +"&appid=59b2f08f8e4313264cf09ebd3d5c3e14&cnt=10&units=metric"
            fetch(urlForecast).then(function (weather){
                return weather.json();
            }).then(function(wData){
                console.log(wData)
                for(var i=0; i < wData.list.length; i++){
                    var city = wData.city.name;
                    var date = wData.list[i].dat_txt;
                    var weather = wData.list[i].weather[0].main;
                    var temp = wData.list[i].main.temp + "C";
                    var humidity = wData.list[i].main.humidity;
                    var windSpeed = wData.list[i].wind.speed;
                }
                
            })
        });

    });
    
});