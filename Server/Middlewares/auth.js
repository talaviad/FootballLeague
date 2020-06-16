var jwt = require("jsonwebtoken");
var config = require("../config.js");
var permission = {
  CAPTAIN: "captain",
  REFEREE: "referee",
  MANAGER: "manager",
};
var possibleRequests = [
  // "register",
  "login",
  "leagueTable",
  "gameResults",
  "scorerTable",
  "clubs",
  "setLiveResult",
  "removeLiveResult",
  "removePlayer",
  "addPlayer",
  "addFreePlayer",

  "getLiveResult",
  "insertGameResult",
  "TeamsNames",
  "FreePlayers",

  "NumberOfWeeks",
  "Result",
  "MonthlyGames",
  "ScorerTable",
  "changePassword",
  "AddNewClub",
  "PlayersList",
  "AddReferee",
  "SubmitConstraints",
  "GetConstraints",
  "GetTeamsConstraints",
  "GetPitchConstraints",
  "PitchConstraints",
  "StartScheduling",
  "AddGame",
  "DeleteGame",
  "ChangeGame",
  "SetWeekDate",

  "GetManagerSchedule",
  "GetInbox",
  "UpdateInbox",
  "RefereesSchedule",
  "GetLeagueSchedule",
];
var needAuthorization = {
  // 'register': { 'permissions': [permission.REFEREE, permission.MANAGER] },
  insertGameResult: { permissions: [permission.REFEREE, permission.MANAGER] },
  SubmitConstraints: { permissions: [permission.REFEREE, permission.CAPTAIN] },
  GetConstraints: { permissions: [permission.REFEREE, permission.CAPTAIN] },
  GetTeamsConstraints: { permissions: [permission.MANAGER] },
  GetPitchConstraints: { permissions: [permission.MANAGER] },
  PitchConstraints: { permissions: [permission.MANAGER] },
  StartScheduling: { permissions: [permission.MANAGER] },
  AddGame: { permissions: [permission.MANAGER] },
  DeleteGame: { permissions: [permission.MANAGER] },
  ChangeGame: { permissions: [permission.MANAGER] },
  SetWeekDate: { permissions: [permission.MANAGER] },

  GetManagerSchedule: { permissions: [permission.MANAGER] },
  GetInbox: {
    permissions: [permission.MANAGER, permission.REFEREE, permission.CAPTAIN],
  },
  UpdateInbox: {
    permissions: [permission.MANAGER, permission.REFEREE, permission.CAPTAIN],
  },
  AddNewClub: { permissions: [permission.MANAGER] },
  AddReferee: { permissions: [permission.MANAGER] },
  RefereesSchedule: { permissions: [permission.MANAGER] },
};

module.exports = function (req, res, next) {
  //let data = req.query.data;
  let footballRequest = req.get("Football-Request");
  console.log("Football-Requesttttt: " + req.get("Football-Request"));

  // check if there is such request
  if (
    footballRequest === undefined ||
    !possibleRequests.includes(footballRequest)
  ) {
    res.send(
      JSON.stringify({
        success: false,
        error: {
          msg: "there is no such request",
        },
      })
    );
    return;
  }

  // check if there is a need for authorization
  if (needAuthorization[footballRequest])
    return isAuthorized(footballRequest, req, res, next);

  console.log("footballRequest: " + footballRequest);
  // handle POST registeration
  if (req.method === "POST") return next();

  // handle GET requests
  if (req.method === "GET") return next();

  // handle PUT requests
  if (req.method === "PUT") return next();

  return;
};

isAuthorized = (footballRequest, req, res, next) => {
  // checking authorization
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

      if (needAuthorization[footballRequest].permissions.includes(role)) {
        console.log("There is permission... next middleware..");
        return next();
      } else {
        res.send(
          JSON.stringify({
            success: false,
            error: {
              msg: "you are not autorized to that action",
            },
          })
        );
      }
      console.log("successss");
      return;
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          msg: "Failed to authenticate token!",
        },
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: {
        msg: "No token!",
      },
    });
  }
  //return next();
};
