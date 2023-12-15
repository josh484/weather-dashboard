$(function() {
    
    
    $('#search-button').on('click', function(event){
        country = $('#search-input').val();
        urlCountry = "http://api.openweathermap.org/geo/1.0/direct?q="+ country +"&appid=59b2f08f8e4313264cf09ebd3d5c3e14"
        event.preventDefault();
        fetch(urlCountry).then(function (response){
            return response.json();
        }).then(function(data){
            console.log(data)
            var lat = data[0].lat;
            var lon = data[0].lon;
            var country = data[0].state;

            urlForecast = "http://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lon +"&appid=59b2f08f8e4313264cf09ebd3d5c3e14&cnt=3&units=metric"
            fetch(urlForecast).then(function (weather){
                return weather.json();
            }).then(function(wData){
                for(var i=0; i < wData.list.length; i++){
                    
                }
                
            })
        });

    });
    
});