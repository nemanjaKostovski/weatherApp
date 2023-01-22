const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=c48a4c7c8dd9fa496a5ba54257808231&units=metric`;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      let html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="style.css" />
          <title>Quick Weather App</title>
        </head>
        <body>
      <div class='wrapper'>
        <h1>${query} ${temp} °C</h1>
        <div class='description'><i>${weatherDescription}</i></div>
        <img class='icon'src=${imageURL} alt='weather-icon' >
      </div>;
      </body>
      </html>`;
      res.send(html);
    });
  });
});

app.listen(3000, function () {
  console.log("server is running on port 3000.");
});
