const path = require("path");
const https = require("https");
const express = require("express");
const request = require("request");
const { response } = require("express");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res, next) => {
  const { fname, lname, email } = req.body;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://usX.api.mailchimp.com/3.0/lists/<list-id>";
  const options = {
    method: "POST",
    auth: "<any username>:<your api key>",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res, next) => {
  res.redirect("/");
});

app.post("/success", (req, res, next) => {
  res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
