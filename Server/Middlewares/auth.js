var jwt = require("jsonwebtoken");
var config = require("../config.js");

var possibleRequests = [
  "register",
  "login",
  "leagueTable",
  "gameResults",
  "scorerTable",
  "insertGameResult",
  "TeamsNames",
  "NumberOfWeeks",
  "Result",
  "GamesWeek",
  "ScorerTable"
];
module.exports = function(req, res, next) {
  //let data = req.query.data;
  let footballRequest = req.get("Football-Request");
  // check if there is such request
  if (
    footballRequest === undefined ||
    !possibleRequests.includes(footballRequest)
  ) {
    res.send(
      JSON.stringify({
        success: false,
        error: {
          msg: "there is no such request"
        }
      })
    );
    return;
  }

  console.log("footballRequest: " + footballRequest);
  // handle POST registeration
  if (req.method === "POST") {
    return next();
  }

  // handle GET requests
  if (req.method === "GET" && footballRequest !== "insertGameResult") {
    return next();
  }

  // insertGameResult request
  console.log(JSON.stringify(req.headers));
  console.log("req.headers.Authorization: " + req.get("authorization"));
  console.log("req.headers.Football-Request: " + req.get("Football-Request"));
  if (req.headers && req.get("authorization")) {
    try {
      console.log("in try");
      req.user = jwt.verify(req.get("authorization"), config.JWT_SECRET);
      let role = req.user.role;
      console.log("id: " + req.user.id);
      console.log("role: " + role);
      if (role === "referee" || role === "manager") {
        res.send(
          JSON.stringify({
            success: true
          })
        );
      } else {
        res.send(
          JSON.stringify({
            success: false,
            error: {
              msg: "you are not autorized to insert game results"
            }
          })
        );
      }
      console.log("successss");
      return;
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          msg: "Failed to authenticate token!"
        }
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: {
        msg: "No token!"
      }
    });
  }
  return next();
};
