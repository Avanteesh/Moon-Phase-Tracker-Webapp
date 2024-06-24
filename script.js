const coordinatesText = document.querySelector(".location-coordinates");
const moonPhaseImage = document.querySelector(".moon-phase-img");
const moonPhaseNameText = document.querySelector(".Current-Moon-Phase-Text");
const currentDateText = document.querySelector(".current-date-and-time-text");
const distanceText = document.querySelector(".distance-of-moon-text");
const moonPhaseAgeText = document.querySelector(".age-of-moon");
const rightAscensionAndDecText = document.querySelector(".Right-Ascension-And-Dec");


navigator.geolocation.getCurrentPosition(
    function(position)  {
        let lat = position.coords.latitude.toFixed(4);
        let long = position.coords.longitude.toFixed(4);
        // check lat-long position and directions
        if (lat < 0) lat = `-${lat}&deg;S`;
        else lat = `${lat}&deg;N`;
        if (long < 0) long = `-${long}&deg;E`;
        else long = `${long}&deg;W`;
        coordinatesText.innerHTML = `📍 ${lat} / ${long}`;
    }
);

/* returns date and time in UTC format string */
function getDateAndTimeInUTC()  {
    let date = new Date();
    let month = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    let day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
    let hour = (date.getUTCHours() < 10) ? `0${date.getUTCHours()}` : `${date.getUTCHours()}`;
    let minute = (date.getUTCMinutes() < 10) ? `0${date.getUTCMinutes()}` : `${date.getUTCMinutes()}`;
    return `${date.getFullYear()}-${month}-${day}T${hour}:${minute}`
}

function getlocalTime()    {
    let date = new Date();
    let month = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    let day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
    let hour = (date.getHours() < 10) ? `0${date.getHours()}` : `${date.getHours()}`;
    let minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
}

async function getData() {
    const url = `https://svs.gsfc.nasa.gov/api/dialamoon/${getDateAndTimeInUTC()}`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return await JSON.parse(JSON.stringify(jsonResponse));
}

setInterval(async () => {
    const Data = await getData();
    moonPhaseImage.src = Data["image"]["url"];
    currentDateText.textContent = `${getlocalTime()}`;
    distanceText.textContent = `Distance: ${Data["distance"]} km`;
    moonPhaseAgeText.textContent = `Age: ${Data["age"]} Days`;
    rightAscensionAndDecText.innerHTML = `RA-DEC: ${Data["j2000_ra"]} H  ${Data["j2000_dec"]}&deg;`;
    let illumination = Number(Data["phase"]);
    let phaseAge = Number(Data["age"]);

    if (illumination === 0.0) {
        moonPhaseNameText.textContent = `New Moon (${Data["phase"]}%)`;
    }
    if (illumination > 1 && illumination < 48) {
        if (phaseAge < 15) moonPhaseNameText.textContent = `Waxing Crescent (${Data["phase"]}%)`;
        else moonPhaseNameText.textContent = `Wanning Crescent (${Data["phase"]}%)`;
    }
    if (illumination > 48 && illumination < 52) {
        if (phaseAge < 15) moonPhaseNameText.textContent = `First Quarter (${Data["phase"]}%)`;
        else moonPhaseNameText.textContent = `Last Quarter (${Data["phase"]}%)`;
    }
    if (illumination > 52 && illumination < 99.99) {
        if (phaseAge < 15) moonPhaseNameText.textContent = `Waxing Gibbous (${Data["phase"]}%)`;
        else moonPhaseNameText.textContent = `Wanning Gibbous (${Data["phase"]}%)`;
    }
    if (illumination === 100 || illumination === 99.99) {
        moonPhaseNameText.textContent = `Full Moon (${Data["phase"]}%)`;
    }

}, 30000);
