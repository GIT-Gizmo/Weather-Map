require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server started");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const key = process.env.API_KEY;
  const city = req.body.q;
  const unit = req.body.unit;

  let unitSymbol;
  switch (unit) {
    case "metric":
      unitSymbol = "Celsius";
      break;
    case "imperial":
      unitSymbol = "Fahrenheit";
      break;
    default:
      unitSymbol = "Kelvin"; // Default to Kelvin
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${key}`;

  https.get(url, (response) => {
    try {
      response.on("data", (data) => {
        const weatherData = JSON.parse(data);
        const temperature = weatherData.main.temp;
        const weatherDesc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        res.write(
          `<h1>The temperature in ${city} is ${temperature} degree ${unitSymbol}</h1>`
        );
        res.write(`<p>The weather is currently ${weatherDesc}</p>.`);
        res.write(`<img src="${iconUrl}">`);

        res.send();
      });
    } catch (error) {
      request.on("error", (error) => {
        console.error(error, response.statusCode);
      });
    }
  });
});
