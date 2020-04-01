//import DataBase from './DataBase.js'
var DataBase = require("./DataBase.js");
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var config = require("./config.js");
var bcrypt = require("bcrypt");
var app = express();
var port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", require("./Middlewares/auth.js"));

app.get("/", function(req, res) {
  console.log("Got a GET request for the homepage");
  let results = [];
  let data = req.query.data;
  if (data === "leagueTable") {
    database.getLeagueTable().then(DBResponse => {
      console.log("results:" + DBResponse);
      res.send(JSON.stringify(DBResponse));
    });
  } else if (data.substring(0, 9) === "GamesWeek") {
    database.getGameResults(data).then(DBResponse => {
      res.send(DBResponse);
    });
  } else if (data === "TeamsNames") {
    database.getTeamsNames().then(DBResponse => {
      res.send(DBResponse);
    });
  } else if (data === "NumberOfWeeks") {
    database.getNumberOfWeeks().then(DBResponse => {
      res.send(DBResponse);
    });
  } else if (data.substring(0, 6) === "Result") {
    console.log("indexJS: " + data);
    database.insertResult(data).then(DBResponse => {
      res.send(DBResponse);
    });
  } else {
    console.log("not supposed to be here");
  }
});

var database = new DataBase();

handleLoginRequest = async (user, pass) => {
  let DBresponse = await database.getUser(user);
  if (DBresponse.success) {
    try {
      let passwordAreMatch = await bcrypt.compare(pass, DBresponse.password);
      if (passwordAreMatch) {
        let randNumForSignature = Math.floor(Math.random() * 100);
        let resultsToTheServer = {
          success: true,
          role: DBresponse.role,
          id: randNumForSignature,
          username: user,
          jwt: jwt.sign(
            {
              id: randNumForSignature,
              role: DBresponse.role,
              username: user
            },
            config.JWT_SECRET
          )
        };
        return JSON.stringify(resultsToTheServer);
      } else {
        let resultsToTheServer = {
          success: false,
          error: {
            msg: "username or password are incorrect"
          }
        };
        return JSON.stringify(resultsToTheServer);
      }
    } catch (err) {
      console.error(err);
      let resultsToTheServer = {
        success: false,
        error: {
          msg: "some error occured with the hashing"
        }
      };
      return JSON.stringify(resultsToTheServer);
    }
  } else {
    return JSON.stringify(DBresponse);
  }
};

handleRegisterRequest = async (user, pass, requestedRole, email) => {
  if (
    requestedRole !== "referee" &&
    requestedRole !== "captain" &&
    requestedRole !== "regular"
  ) {
    let registerError = {
      success: false,
      error: {
        msg: "the role you asked does not exists"
      }
    };
    return JSON.stringify(registerError);
  }
  try {
    let hashPassword = await bcrypt.hash(pass, config.BCRYPT_SALT_ROUNDS);
    let DBResponse = await database.registerNewUser(
      user,
      hashPassword,
      email,
      requestedRole
    );
    console.log("DBResponse: " + DBResponse);
    console.log("DBResponse.success: " + DBResponse.success);
    if (DBResponse.success) {
      return JSON.stringify({
        success: true
      });
    } else {
      return JSON.stringify(DBResponse);
    }
  } catch (err) {
    console.error(err);
    return JSON.stringify({
      success: false,
      error: {
        msg: "some error occured while trying to register the user"
      }
    });
  }
};

app.post("/", function(req, res) {
  console.log("Got a Post message");
  console.log("user: " + req.body.user);
  console.log("pass: " + req.body.pass);
  console.log("role: " + req.body.requestedRole);
  console.log("email: " + req.body.email);
  switch (req.get("Football-Request")) {
    case "login":
      handleLoginRequest(req.body.user, req.body.pass).then(ans =>
        res.send(ans)
      );
      break;
    case "register":
      handleRegisterRequest(
        req.body.user,
        req.body.pass,
        req.body.requestedRole,
        req.body.email
      ).then(ans => res.send(ans));
      break;
    case "ScorerTable":
      console.log("scorer Table!!!");
      break;
    default:
      break;
  }
});

var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
