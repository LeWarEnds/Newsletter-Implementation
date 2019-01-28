//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        "FNAME": firstName,
        "LNAME": lastName
      },
    }
  ]
  };
  var jsonData = JSON.stringify(data);

  //API Key
  var apiKey = "35d7522d2699d2410d4db426732e2633-us20";

  //List ID
  var listID = "458f8e91e5";

  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/" + process.env.listID,
    method: "POST",
    headers: {
      "Authorization": "LeWarEnds " + process.env.apiKey
    },
    body: jsonData
  };
  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html", function(req, res) {
        console.log("Request denied with status code " + response.statusCode);
      });
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server running at Port: 3000");
});

// Add Procfile in order for Heroku to remeber
