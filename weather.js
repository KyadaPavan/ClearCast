
const searchbox = document.querySelector(".search")
const searchbtn = document.querySelector(".search-button")
const allowbtn = document.querySelector(".access-button");
const searchweatherbtn = document.querySelector(".search-weather-button");


function weatherinfo(data) {

    document.querySelector(".cityname").innerHTML = data.city.name + " ,";
    document.querySelector(".country1").innerHTML = data.city.country;
    document.querySelector(".temperature").innerHTML = parseInt(data.list[0].main.temp - 273);

    let desc = data.list[0].weather[0].description;
    let finaldesc = desc.charAt(0).toUpperCase() + desc.slice(1)
    document.querySelector(".weather-description").innerHTML = finaldesc;

    document.querySelector(".feels-like").innerHTML = parseInt(data.list[0].main.feels_like - 273) + " °C";
    document.querySelector(".min-temp").innerHTML = parseInt(data.list[0].main.temp_min - 273) + " °C";
    document.querySelector(".max-temp").innerHTML = parseInt(data.list[0].main.temp_max - 273) + " °C";

    document.querySelector(".humidity-content").innerHTML = data.list[0].main.humidity + " %";
    document.querySelector(".pressure-content").innerHTML = data.list[0].main.pressure + " hPa";
    document.querySelector(".wind-content").innerHTML = data.list[0].wind.speed + " km/hr";
    document.querySelector(".visiblity-content").innerHTML = (data.list[0].visibility) / 1000 + " km";

    var sr = data.city.sunrise;
    var date = new Date(sr * 1000);
    document.querySelector(".sunrise-time").innerHTML = (date.toLocaleTimeString("en-US")).slice(0, 4) + " AM";

    var ss = data.city.sunset;
    var date = new Date(ss * 1000);
    document.querySelector(".sunset-time").innerHTML = (date.toLocaleTimeString("en-US")).slice(0, 4) + " PM";

    let icon = data.list[0].weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
    document.querySelector(".iconimg").src = iconurl;

}

function todayforcast(data) {

    for (let i = 0; i < 12; i++) {
        let slot = document.querySelector(`.slot${i + 1}-temp`);
        slot.innerHTML = parseInt(data.list[i].main.temp - 273) + " °C";
        let icon = data.list[i].weather[0].icon;
        let slotimg = document.querySelector(`.slot${i + 1}-img`);
        let iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        slotimg.src = iconurl;
    }

    for (j = 0; j < 12; j++) {

        function timeTo12HrFormat(time) {

            var time_part_array = time.split(":");
            var ampm = 'AM';

            if (time_part_array[0] >= 12) {
                ampm = 'PM';
            }

            if (time_part_array[0] > 12) {
                time_part_array[0] = time_part_array[0] - 12;
            }

            formatted_time = time_part_array[0] + ':' + time_part_array[1] + ':' + time_part_array[2] + ' ' + ampm;

            return formatted_time;
        }
            
        var time = timeTo12HrFormat((data.list[j].dt_txt).slice(11, 19));
        let slotdate = document.querySelector(`.slot${j + 1}-time`);
        slotdate.innerHTML = (data.list[j].dt_txt).slice(11, 16) + '&nbsp;' + time.slice(8, 11);

    }

    for(let k=0 ; k<12 ; k++){

        let dates = new Date(data.list[k].dt_txt);
        const month = dates.toLocaleString('default', { month: 'long' });
        let todaydate = document.querySelector(`.slot${k+1}-date`) ;
        todaydate.innerHTML = (data.list[k].dt_txt).slice(8, 10) + " " + (month).slice(0, 3);

    }



}
function fivedays(data) {


    for (let j = 1; j <= 5; j++) {

        for (let i = 0; i <= data.list.length; i++) {

            let dates = new Date(data.list[i].dt_txt);
            const month = dates.toLocaleString('default', { month: 'long' });

            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var dayName = days[dates.getDay()];

            document.querySelector(`.dayname${j}`).innerHTML = dayName;
            document.querySelector(`.date${j}`).innerHTML = (data.list[i].dt_txt).slice(8, 10) + " " + (month).slice(0, 3);
            document.querySelector(`.temp${j}`).innerHTML = parseInt(data.list[i].main.temp - 273) + " °C";
            i += 7;
            j++;

        }

    }

}

async function getweather(city) {

    await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=79f921af4d0827fc9828f0585a641b41`)

        .then(response => {
            return response.json()
        }).then(data => {
            weatherinfo(data);
            todayforcast(data);
            fivedays(data);
        })
        .catch(error => {
            console.log("Error occured");
        });

}


searchbtn.addEventListener("click", () => {
    getweather(searchbox.value);
})

searchbox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getweather(searchbox.value);
    }
});

searchweatherbtn.addEventListener("click", () => {
    document.querySelector(".grant-location-container").style.display = "none";
    document.querySelector(".wearhter-search-page").style.display = "block";
})


function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation not supported by the browser.")
    }
}

async function showPosition(data) {

    document.querySelector(".grant-location-container").style.display = "none";
    document.querySelector(".wearhter-search-page").style.display = "block";

    let lat = data.coords.latitude;
    let lon = data.coords.longitude;

    await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=79f921af4d0827fc9828f0585a641b41
    `)
        .then(response => {
            return response.json()
        }).then(data => {
            weatherinfo(data);
            todayforcast(data);
            fivedays(data);

        })
        .catch(error => {
            console.log("Error occured geo fetching");
        });

}


allowbtn.addEventListener("click", getlocation);

