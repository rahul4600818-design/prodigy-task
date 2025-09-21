const apiKey = "6a3c1f53a5507bbc1be26e65d9945b7b";

document.getElementById("getWeatherBtn").addEventListener("click", getWeather);

async function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    document.getElementById("weather").innerHTML = `
      <p><strong>${data.name}, ${data.sys.country}</strong></p>
      <p>🌡️ ${data.main.temp}°C</p>
      <p>☁️ ${data.weather[0].description}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind: ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    document.getElementById("weather").innerHTML = `<p style='color:red;'>${error.message}</p>`;
  }
}
function createRain() {
  const rainDrop = document.createElement("div");
  rainDrop.classList.add("rain");

  // Random horizontal position
  rainDrop.style.left = Math.random() * window.innerWidth + "px";

  // Random duration for different speeds
  rainDrop.style.animationDuration = (0.5 + Math.random()) + "s";

  document.body.appendChild(rainDrop);

  // Remove drop after falling
  setTimeout(() => {
    rainDrop.remove();
  }, 2000);
}

// Keep generating rain
setInterval(createRain, 100);
