//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (reqt, resp) {
  const fn = reqt.body.fn;
  const ln = reqt.body.ln;
  const em = reqt.body.em;

  const data = {
    members: [
      {
        email_address: em,
        status: "subscribed",
        merge_fields: {
          FNAME: fn,
          LNAME: ln,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/e9c4999794";
  const options = {
    method: "POST",
    auth: "daminisheth98:cee4849ea6a4b16ad55c3d749c3b7001-us17",
  };

  const reqq = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      resp.sendFile(__dirname + "/success.html");
    } else {
      resp.sendFile(__dirname + "/failure.html");
    }

    response.on(data, function (data) {
      console.log(JSON.parse(data));
    });
  });
  reqq.write(jsonData);
  reqq.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening....");
});
