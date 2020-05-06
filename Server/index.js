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

app.get("/", function (req, res) {
  console.log("Got a GET request for the homepage");

  let results = [];
  let data = req.query.data;
  if (data === "leagueTable") {
    database.getLeagueTable().then((DBResponse) => {
      console.log("results:" + DBResponse);
      res.send(JSON.stringify(DBResponse));
    });
  } else if (req.get("Football-Request") === "MonthlyGames") {
    database.getGameResults(data).then((DBResponse) => {
      res.send(DBResponse);
    });
  } else if (data === "scorerTable") {
    database.getScorerTable().then((DBResponse) => {
      res.send(JSON.stringify(DBResponse));
    });
  } else if (data === "TeamsNames") {
    database.getTeamsNames().then((DBResponse) => {
      res.send(DBResponse);
    });
  } else if (data === "NumberOfWeeks") {
    database.getNumberOfWeeks().then((DBResponse) => {
      res.send(DBResponse);
    });
  } else if (data.substring(0, 6) === "Result") {
    database.insertResult(data).then((DBResponse) => {
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
              username: user,
            },
            config.JWT_SECRET
          ),
        };
        return JSON.stringify(resultsToTheServer);
      } else {
        let resultsToTheServer = {
          success: false,
          error: {
            msg: "username or password are incorrect",
          },
        };
        return JSON.stringify(resultsToTheServer);
      }
    } catch (err) {
      console.error(err);
      let resultsToTheServer = {
        success: false,
        error: {
          msg: "some error occured with the hashing",
        },
      };
      return JSON.stringify(resultsToTheServer);
    }
  } else {
    return JSON.stringify(DBresponse);
  }
};

handleChangePasswordRequest = async (username, oldPassword, newPassword) => {
  let DBresponse = await database.changePassword(
    username,
    oldPassword,
    newPassword
  );
  return DBresponse;
  /*
  if (DBresponse.success) {
    try {
      let passwordAreMatch = await bcrypt.compare(
        oldPassword,
        DBresponse.password
      );
      if (passwordAreMatch) {
        let DBResponse = await database.changePassword(username, newPassword);
        let resultsToTheServer = {
          success: true,
        };
        return JSON.stringify(resultsToTheServer);
      } else {
        let resultsToTheServer = {
          success: false,
          error: {
            msg: "username or password are incorrect",
          },
        };
        return JSON.stringify(resultsToTheServer);
      }
    } catch (err) {
      console.error(err);
      let resultsToTheServer = {
        success: false,
        error: {
          msg: "some error occured with the hashing",
        },
      };
      return JSON.stringify(resultsToTheServer);
    }
  } else {
    return JSON.stringify(DBresponse);
  }*/
};

handleRegisterRequest = async (user, pass, requestedRole, email) => {
  if (
    requestedRole !== "referee" &&
    requestedRole !== "captain" &&
    requestedRole !== "manager" &&
    requestedRole !== "regular"
  ) {
    let registerError = {
      success: false,
      error: {
        msg: "the role you asked does not exist",
      },
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
        success: true,
      });
    } else {
      return JSON.stringify(DBResponse);
    }
  } catch (err) {
    console.error(err);
    return JSON.stringify({
      success: false,
      error: {
        msg: "some error occured while trying to register the user",
      },
    });
  }
};

handleScorerTableRequest = async (dicTeam1, dicTeam2) => {
  try {
    let DBResponse = await database.addToScorerTable(dicTeam1, dicTeam2);
    console.log("DBResponse: " + DBResponse);
    console.log("DBResponse.success: " + DBResponse.success);
    if (DBResponse.success) {
      return JSON.stringify({
        success: true,
      });
    } else {
      return JSON.stringify(DBResponse);
    }
  } catch (err) {
    console.error(err);
    return JSON.stringify({
      success: false,
      error: {
        msg: "some error occured while trying to register the user",
      },
    });
  }
};

handleAddNewClubRequest = async (clubName) => {
  try {
    let DBResponse = await database.addNewClub(clubName);
    if (DBResponse.success) {
      return JSON.stringify({
        success: true,
      });
    } else {
      return JSON.stringify(DBResponse);
    }
  } catch (err) {
    console.error(err);
    return JSON.stringify({
      success: false,
      error: {
        msg: "some error occured while trying to register the user",
      },
    });
  }
};

app.post("/", function (req, res) {
  switch (req.get("Football-Request")) {
    case "login":
      handleLoginRequest(req.body.user, req.body.pass).then((ans) =>
        res.send(ans)
      );
      break;
    case "register":
      handleRegisterRequest(
        req.body.user,
        req.body.pass,
        req.body.requestedRole,
        req.body.email
      ).then((ans) => res.send(ans));
      break;
    case "ScorerTable":
      handleScorerTableRequest(
        req.body.dicTeam1,
        req.body.dicTeam2,
        req.body.requestedRole
      ).then((ans) => res.send(ans));
      break;
    case "addNewClub":
      handleAddNewClubRequest(req.body.clubName).then((ans) => res.send(ans));
      break;
    case "Result":
      database
        .insertResult(
          req.body.selectedTeam1,
          req.body.selectedTeam2,
          req.body.scoreTeam1,
          req.body.scoreTeam2,
          req.body.date,
          req.body.team1ScorrersDic,
          req.body.team2ScorrersDic
        )
        .then((DBResponse) => {
          res.send(DBResponse);
        });
      break;

    default:
      break;
  }
});

app.put("/", function (req, res) {
  switch (req.get("Football-Request")) {
    case "changePassword":
      handleChangePasswordRequest(
        req.body.username,
        req.body.oldPassword,
        req.body.newPassword
      ).then((ans) => res.send(ans));
      break;
    default:
      break;
  }
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
