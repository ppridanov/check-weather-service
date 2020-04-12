const apiKey = "c33248c94bd9ca0207771bb86a3aebab";
const url = "https://api.openweathermap.org/data/2.5/weather"
const weatherForm = document.forms.weather;
const textError = document.querySelector('.error');
const inputCity = weatherForm.elements.city;
const submitButton = weatherForm.elements.submit;

const resultsContainer = document.querySelector('.results');
const resultsTitle = document.querySelector('.resutls__title');
const resultImage = document.querySelector('.result__image');
const textStatus = document.querySelector('.result__status');
const textTemp = document.querySelector('.result__temp');
const textFeelTemp = document.querySelector('.result__feeltemp');
const textPressure = document.querySelector('.result__pressure');
const textWindSpeed = document.querySelector('.result__speed');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    textError.classList.remove('error_active');
    connectionToApi(inputCity.value);
})

function ucFirst(str) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}

function getImage(status) {
    if (!status) return status;
    if (status == 'Clear') return './images/sun.svg';
    if (status == 'Clouds') return './images/clouds.svg';
    if (status == 'Rain') return './images/rain.svg';
    if (status == 'Snow') return './images/hail.svg';
    if (status == 'Mist') return './images/mist.svg';
    return;
}

function checkError(status) {
    if (status == '404') {
        return 'Не найдено, попробуйте изменить название города';
    }
    if (status == '401') {
        return 'Ошибка авторизации сервиса погоды, обратитесь к администратору сайта';
    }
    if (status == '500') {
        return 'Сервер временно недоступер попробуйте позднее';
    }
}

function connectionToApi(cityName) {
    return fetch(`${url}?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`)
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(res.status);
    })
    .then((data) => {
        resultsContainer.classList.add('results_active');
        resultsTitle.textContent = `По вашему запросу в городе "${cityName}":`
        resultImage.setAttribute('src', './images/clouds.svg');
        textStatus.textContent = `Статус погоды: ${ucFirst(data.weather[0].description)}`;
        textTemp.textContent = `Температура воздуха: ${data.main.temp}°C`;
        textFeelTemp.textContent = `Ощущается как: ${data.main.feels_like}°C`;
        textPressure.textContent = `Атмосферное давление: ${data.main.pressure} мм рт. ст.`;
        textWindSpeed.textContent = `Скорость ветра: ${data.wind.speed} м/сек. `
    })
    .catch((err)=> {
        textError.classList.add('error_active');
        if (err == 'Failed to fetch') {
            textError.textContent = 'Сервер временно недоступер попробуйте позднее';
        } else {
            textError.textContent = checkError(err);
        }
    })
}

