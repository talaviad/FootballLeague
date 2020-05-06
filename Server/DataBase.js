var MongoClient = require("mongodb").MongoClient;

module.exports = class DataBase {
  constructor() {
    console.log("connecting to database...");
    this.connect();
  }

  async connect() {
    const DATABASE_ADDRESS =
      "mongodb+srv://alonlaza:1234@cluster0-5uxtz.mongodb.net/test?retryWrites=true&w=majority";
    const DATABASE_NAME = "FootballLeague";
    this.client = new MongoClient(DATABASE_ADDRESS);
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      console.log("connected to database.");
      // Make the appropriate DB calls
      //await findOneListingByName(this.client, 'teamA');
    } catch (e) {
      console.log("An error occured while was trying to connect to database..");
      console.error(e);
    } /*finally {
            await client.close();
        }*/
  }

  async disconnect() {
    await this.client.close();
  }

  async registerNewUser(user, pass, email, requestedRole) {
    let result = await this.client
      .db("FootballLeague")
      .collection("Users")
      .find({
        $or: [{ username: user }, { email: email }],
      });
    console.log("res: " + result);
    result = await result.toArray();
    if (result.length !== 0) {
      let registerError = {
        success: false,
        error: {
          msg: "username or email is already in used",
        },
      };
      return registerError;
    }

    try {
      result = await this.client
        .db("FootballLeague")
        .collection("Users")
        .insertOne({
          username: user,
          password: pass,
          email: email,
          role: requestedRole,
          inbox: {
            messages: [ 
              { msg: 'Hello ' + user + ', we hope you will enjoy our app', read: false, },
            ]
          },
        });
    } catch (err) {
      console.error(err);
      let registerError = {
        success: false,
        error: {
          msg: err,
        },
      };
      return registerError;
    }

    // let results = result.map(doc => {
    //     console.log(doc.username.toString());
    //     console.log(doc.email.toString());
    // })
    return { success: true };
  }

  async addToScorerTable(dicTeam1, dicTeam2) {
    var combine_dict = [];
    for (var i = 0; i < dicTeam1.length; i++) {
      combine_dict.push(dicTeam1[i]);
    }
    for (var i = 0; i < dicTeam2.length; i++) {
      combine_dict.push(dicTeam2[i]);
    }
    for (var i = 0; i < combine_dict.length; i++) {
      console.log("hey you111: " + combine_dict[i]);
      console.log("hey you222: " + JSON.stringify(combine_dict[i]));

      console.log("hey you333: " + combine_dict[i].Name.length);
      let result = await this.client
        .db("FootballLeague")
        .collection("ScorerTable")
        .find({
          $and: [
            { Team: combine_dict[i].Team },
            { Number: combine_dict[i].Number },
          ],
        });

      result = await result.toArray();

      if (result.length === 0) {
        try {
          let ans = await this.client
            .db("FootballLeague")
            .collection("ScorerTable")
            .insertOne({
              Name: combine_dict[i].Name,
              Team: combine_dict[i].Team,
              Number: combine_dict[i].Number,
              Goals: combine_dict[i].Goals,
            });
        } catch (err) {
          console.error(err);
          let registerError = {
            success: false,
            error: {
              msg: err,
            },
          };
          return registerError;
        }
      } else {
        console.log("hey you444: " + combine_dict[i].Name.length);

        result[0].Goals =
          parseInt(result[0].Goals) + parseInt(combine_dict[i].Goals);
        for (var j = 0; j < combine_dict[i].Name.length; j++) {
          if (!result[0].Name.includes(combine_dict[i].Name[j])) {
            result[0].Name.push(combine_dict[i].Name[j]);
          }
        }
        let ans = this.client
          .db("FootballLeague")
          .collection("ScorerTable")
          .replaceOne(
            {
              $and: [
                { Team: combine_dict[i].Team },
                { Number: combine_dict[i].Number },
              ],
            },
            result[0]
          );
      }
    }
    return { success: true };
  }
  async getUser(user) {
    console.log('Trying to find user: ' + user)
    let result = await this.client
      .db("FootballLeague")
      .collection("Users")
      .find({ username: user });
    console.log("res: " + result);
    result = await result.toArray();
    if (result.length === 0) {
      let registerError = {
        success: false,
        error: {
          msg: "username or password are incorrect",
        },
      };
      return registerError;
    } else {
      let resultToServer = {
        success: true,
        password: result[0].password,
        role: result[0].role,
        inbox: result[0].inbox,
      };
      return resultToServer;
    }
  }

  async getLeagueTable() {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("LeagueTable")
        .find();
      result = await result.toArray();
      let results = result.map((team) => {
        return [
          team.Club.toString(),
          team.MP.toString(),
          team.W.toString(),
          team.D.toString(),
          team.L.toString(),
          team.GF.toString(),
          team.GA.toString(),
          team.GD.toString(),
          team.Pts.toString(),
        ];
      });
      let resultsToTheServer = {
        success: true,
        tableData: results,
      };
      return resultsToTheServer;
    } catch {
      console.log("in catch");
      return {
        success: false,
        error: {
          msg: 'Coudln"t find collection "FootballLeague"',
        },
      };
    }
  }

  async getScorerTable() {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("ScorerTable")
        .find();
      result = await result.toArray();
      console.log("for alon: " + result[0].Name);
      let results = result.map((scorer) => {
        return [
          scorer.Name,
          scorer.Team.toString(),
          scorer.Number.toString(),
          scorer.Goals.toString(),
        ];
      });
      let resultsToTheServer = {
        success: true,
        tableData: results,
      };
      return resultsToTheServer;
    } catch {
      console.log("in catch");
      return {
        success: false,
        error: {
          msg: 'Coudln"t find collection "ScorerTable"',
        },
      };
    }
  }

  async getGameResults(monthName) {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection(monthName)
        .find();
      result = await result.toArray();
      let results = result.map((game) => {
        return [
          game.team1.toString(),
          game.result.toString(),
          game.team2.toString(),
          game.date.toString(),
        ];
      });
      let resultsToTheServer = {
        success: true,
        tableData: results,
      };
      return JSON.stringify(resultsToTheServer);
    } catch {
      console.log("in catch");
      return JSON.stringify({ success: false });
    }
  }

  async getTeamsNames() {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("LeagueTable")
        .find();
      result = await result.toArray();
      let results = result.map((team) => {
        return team.Club.toString();
      });
      let resultsToTheServer = {
        success: true,
        teamsNames: results,
      };
      return JSON.stringify(resultsToTheServer);
    } catch {
      console.log("in catch");
      return JSON.stringify({ success: false });
    }
  }
  async getNumberOfWeeks() {
    try {
      let allCollections = [];
      let result = await this.client.db("FootballLeague").listCollections();
      result = await result.toArray();
      result.forEach((eachCollectionDetails) => {
        if (eachCollectionDetails.name.substring(0, 9) === "GamesWeek") {
          allCollections.push(
            parseInt(eachCollectionDetails.name.substring(9))
          );
        }
      });
      allCollections.sort(this.sortNumber);

      let resultsToTheServer = {
        success: true,
        numberOfWeeks: allCollections,
      };
      return JSON.stringify(resultsToTheServer);
    } catch {
      console.log("in catch");
      return JSON.stringify({ success: false });
    }
  }

  async insertResult(
    selectedTeam1,
    selectedTeam2,
    scoreTeam1,
    scoreTeam2,
    date
  ) {
    let winner = 0;
    try {
      //let arr_data = data.split(",");
      //console.log(arr_data);
      if (parseInt(scoreTeam1) > parseInt(scoreTeam2)) {
        winner = 1;
      } else if (parseInt(scoreTeam2) > parseInt(scoreTeam1)) {
        winner = 2;
      }

      let result = await this.client
        .db("FootballLeague")
        .collection("LeagueTable")
        .find({ $or: [{ Club: selectedTeam1 }, { Club: selectedTeam2 }] });
      result = await result.toArray();
      //We dont know the order the db return the 2 rows so we need this condition
      if (result[0].Club === selectedTeam1) {
        this.updateTeamInTable(
          result[0],
          1,
          winner,
          parseInt(scoreTeam1),
          parseInt(scoreTeam2)
        );
        this.updateTeamInTable(
          result[1],
          2,
          winner,
          parseInt(scoreTeam1),
          parseInt(scoreTeam2)
        );
      } else {
        this.updateTeamInTable(
          result[1],
          1,
          winner,
          parseInt(scoreTeam1),
          parseInt(scoreTeam2)
        );
        this.updateTeamInTable(
          result[0],
          2,
          winner,
          parseInt(scoreTeam1),
          parseInt(scoreTeam2)
        );
      }

      var monthName = this.getMonthNameFromDate(date);
      await this.client
        .db("FootballLeague")
        .collection(monthName)
        .insert({
          team1: selectedTeam1,
          result: scoreTeam1 + " - " + scoreTeam2,
          team2: selectedTeam2,
          date: date,
        });

      let resultsToTheServer = {
        success: true,
      };

      return JSON.stringify(resultsToTheServer);
    } catch {
      console.log("in catch");
      return JSON.stringify({ success: false });
    }
  }
  updateTeamInTable(teamJson, teamIndex, winner, scoreTeam1, scoreTeam2) {
    if (teamIndex == 1) {
      teamJson.MP = parseInt(teamJson.MP) + 1;
      if (winner == 1) {
        teamJson.W = parseInt(teamJson.W) + 1;
        teamJson.Pts = parseInt(teamJson.Pts) + 3;
      } else if (winner == 0) {
        teamJson.D = parseInt(teamJson.D) + 1;
        teamJson.Pts = parseInt(teamJson.Pts) + 1;
      } else {
        teamJson.L = parseInt(teamJson.L) + 1;
      }
      teamJson.GF = parseInt(teamJson.GF) + scoreTeam1;
      teamJson.GA = parseInt(teamJson.GA) + scoreTeam2;
      teamJson.GD = parseInt(teamJson.GD) + (scoreTeam1 - scoreTeam2);

      let result = this.client
        .db("FootballLeague")
        .collection("LeagueTable")
        .replaceOne({ Club: teamJson.Club }, teamJson);
    } else {
      teamJson.MP = parseInt(teamJson.MP) + 1;
      if (winner == 2) {
        teamJson.W = parseInt(teamJson.W) + 1;
        teamJson.Pts = parseInt(teamJson.Pts) + 3;
      } else if (winner == 0) {
        teamJson.D = parseInt(teamJson.D) + 1;
        teamJson.Pts = parseInt(teamJson.Pts) + 1;
      } else {
        teamJson.L = parseInt(teamJson.L) + 1;
      }
      teamJson.GF = parseInt(teamJson.GF) + scoreTeam2;
      teamJson.GA = parseInt(teamJson.GA) + scoreTeam1;
      teamJson.GD = parseInt(teamJson.GD) + (scoreTeam2 - scoreTeam1);

      let result = this.client
        .db("FootballLeague")
        .collection("LeagueTable")
        .replaceOne({ Club: teamJson.Club }, teamJson);
    }
  }

  sortNumber(a, b) {
    return a - b;
  }

  getMonthNameFromDate(date) {
    var dateString = date.substring(3, 5);
    console.log(dateString);
    if (dateString === "01") {
      return "January";
    } else if (dateString === "02") {
      return "February";
    } else if (dateString === "03") {
      return "March";
    } else if (dateString === "04") {
      return "April";
    } else if (dateString === "05") {
      return "May";
    } else if (dateString === "06") {
      return "June";
    } else if (dateString === "07") {
      return "July";
    } else if (dateString === "08") {
      return "August";
    } else if (dateString === "09") {
      return "September";
    } else if (dateString === "10") {
      return "October";
    } else if (dateString === "11") {
      return "November";
    } else if (dateString === "12") {
      return "December";
    }
  }

  async insertOrUpdatePitchConstraints(pitchConstraints) {
    let result = await this.client
    .db("FootballLeague")
    .collection("PitchConstraints")
    .find({});
    console.log('result: ' + result);
    result = await result.toArray();

    if (result.length !== 0) {
      console.log('pitchConstraints: ' + pitchConstraints);
      console.log('result: ' + result[0]);
      console.log('there are already pitch constraints, now we will update them')
      result = this.client
      .db("FootballLeague")
      .collection("PitchConstraints")
      .replaceOne({}, { pitchConstraints: pitchConstraints });
      return { 
        success: true,
      }
    } else {
      console.log('there are no pitch constraints yet, now we will insert thyem')
      result = await this.client
      .db("FootballLeague")
      .collection("PitchConstraints")
      .insertOne({
        pitchConstraints: pitchConstraints,
      });
      return { 
        success: true
      }
    }
  }

  async insertOrUpdateConstraints(user, weeklyConstraints, specificConstraints) {
    let result = await this.getUser(user);
    if (result.success) {
      result = await this.client
        .db("FootballLeague")
        .collection("CaptainConstraints")
        .find({ user: user });
      result = await result.toArray();
      console.log('result: ' + result);
      if (result.length !== 0) {
          console.log('specificConstraints: ' + specificConstraints);
          console.log('there is already user, now we will update')
          let teamName = result[0].teamName;
          result = this.client
          .db("FootballLeague")
          .collection("CaptainConstraints")
          .replaceOne({ user: user }, { teamName: teamName, user: user, weeklyConstraints: weeklyConstraints, specificConstraints: specificConstraints });
          return { 
            success: true,
          }
      } else {
        console.log('there is no user, now we will insert')
        result = await this.client
          .db("FootballLeague")
          .collection("Users")
          .find({ username: user });
        result = await result.toArray();
        console.log('result: ' + result[0]);
        let team = result[0].team;
        console.log('The team is: ' + team);
        result = await this.client
        .db("FootballLeague")
        .collection("CaptainConstraints")
        .insertOne({
          user: user,
          team: team,
          weeklyConstraints: weeklyConstraints,
          specificConstraints: specificConstraints,
        });
        return { 
          success: true
        }
      }
    } 
    else {
      console.log('failed to get user')
      return result;
    }
  }

  async getTeamsConstraints() {
      let result = await this.client
        .db("FootballLeague")
        .collection("CaptainConstraints")
        .find({});
      result = await result.toArray();
      let teamsConstraints = {};
      if (result.length !== 0) {
        for (let i=0; i<result.length; i++) {
          let teamId = i+1;
          let teamName = result[i].teamName;
          let constraints = result[i].weeklyConstraints;
          let user = result[i].user;
          teamsConstraints[teamId] = { teamName: teamName, constraints: constraints, teamCaptainUser: user };
        }
        return {
          success: true,
          teamsConstraints: teamsConstraints,
        }     
      } else {
        console.log('there are captain constraints set yet')
        return { 
          success: false,
          error: {
            msg: 'there are captain constraints set yet'
          }
        }
      }

    // let result = await this.client
    //   .db("FootballLeague")
    //   .collection("LeagueTable")
    //   .find({});
    // result = await result.toArray();
    // let teamsConstraints = {};
    // for (let i=0; i<result.length; i++) {
    //   let teamId = result[i].teamNum;
    //   let teamName = result[i].Club;
    //   let teamCanPlayAgainst = [];

    //   for (let otherTeamNum in teamsConstraints) {
    //     teamsConstraints[otherTeamNum].teamCanPlayAgainst.push(teamId);
    //     teamCanPlayAgainst.push(otherTeamNum);
    //   }
      
    //   teamsConstraints[teamId] = { teamId: teamId, teamName: teamName, teamCanPlayAgainst: teamCanPlayAgainst };
    //   // teamsIds.push(result[i].teamNum);
    //   // teamsConstraints.push({
    //   //   teamId: result[i].teamNum, teamName: result[i].Club, teamCanPlayAgainst: []
    //   // })
    //   console.log('getTeamsConstraints(): result[' + i + '] - ' + result[i] + ', teamId: ' + result[i].teamNum + ', teamName: ' + result[i]);
    // }
    // console.log('getTeamsConstraints(): teamsConstraints - ' + teamsConstraints);
    // // for (let i=0; i<result.length; i++) {
    // //   teamsConstraints[]
    // // }

    // return {
    //   success: true,
    //   teamsConstraints: teamsConstraints,
    // }
  }

  async getPitchConstraints() {
    let result = await this.client
    .db("FootballLeague")
    .collection("PitchConstraints")
    .find({});
    console.log('before toArray()');
    result = await result.toArray();
    // We assume there are already constraints on database..
    if (result.length !== 0) {
      return { 
        success: true,
        pitchConstraints: result[0].pitchConstraints,
      }
    } else {
      console.log('there are no pitch constraints on database yet')
      return { 
        success: false,
        error: {
          msg: 'there are no pitch constraints set yet'
        }
      }
    }
  }

  async getConstraints(user) {
    let result = await this.getUser(user);
    if (result.success) { 
      result = await this.client
        .db("FootballLeague")
        .collection("CaptainConstraints")
        .find({ user: user });
      result = await result.toArray();
      console.log('result: ' + result);
      if (result.length !== 0) {
          console.log('there is a user, now we will send the constraints to the client');
          console.log('constraints: ' + result[0].weeklyConstraints);
          return { 
            success: true,
            weeklyConstraints: result[0].weeklyConstraints,
            specificConstraints: result[0].specificConstraints,
          }
      } else {
        console.log('that user('+user+') is not set with constraints')
        return { 
          success: false,
          error: {
            msg: 'there are no constraints set yet'
          }
        }
      } 
    }
    else {
      console.log('failed to get user')
      return result;
    }
  }

  async getManagerSchedule() {
    let result = await this.client
    .db("FootballLeague")
    .collection("Schedule")
    .find({});
    console.log('result: ' + result);
    result = await result.toArray();
    if (result.length !== 0) {
      return {
        success: true,
        schedule: result[0].schedule,
        gamesToBeCompleted: result[0].gamesToBeCompleted,
        teamsNumbers: result[0].teamsNumbers,
        teamsConstraints: result[0].teamsConstraints,
      }
    }
    else {
      return {
        success: false,
        error: {
          msg: 'there is no schedule set'
        }
      }
    }
  }

  async updateSchedule(schedule, gamesToBeCompleted, teamsNumbers, teamsConstraints, gamesIdsToUsers, changeDetails) {
    let result = await this.client
    .db("FootballLeague")
    .collection("Schedule")
    .find({});
    console.log('result: ' + result);
    result = await result.toArray();

    if (result.length !== 0) {
      console.log('Updating an existung schedule');
      console.log('result: ' + result[0]);
      let gamesIdsToUsers = result[0].gamesIdsToUsers;
      result = this.client
      .db("FootballLeague")
      .collection("Schedule")
      .replaceOne({}, { schedule: schedule, gamesToBeCompleted: gamesToBeCompleted, teamsNumbers: teamsNumbers, teamsConstraints: teamsConstraints, gamesIdsToUsers: result[0].gamesIdsToUsers });

      let userA = gamesIdsToUsers[changeDetails.matchId][0].user;
      let teamA = gamesIdsToUsers[changeDetails.matchId][0].teamName;
      let userB = gamesIdsToUsers[changeDetails.matchId][1].user;
      let teamB = gamesIdsToUsers[changeDetails.matchId][1].teamName;

      // Send messages to the users
      result = this.client
        .db("FootballLeague")
        .collection("Users")
        .find({$or: [{ username: userA }, { username: userB }]});
      if (result.length === 0)
        return {
          success: false,
          error: {
            msg: 'change has set but the users didnt get the message'
          }
        }
        result = await result.toArray();
        console.log('before updating the messages of the users...');
        console.log('changeDetails.change: ' + changeDetails.change + ', changeDetails.matchId: ' + changeDetails.matchId);
        console.log('userA: ' + userA + ', userB: ' + userB);
        let userAInbox = (result[0].username === userA)? result[0].inbox : result[1].inbox;
        let userBInbox = (result[0].username === userB)? result[0].inbox : result[1].inbox;
        if (changeDetails.change === "AddGame") {
          userAInbox.messages.push({msg: 'The league manager added a game of your team.\nThe game is against '+ teamB +', in day: ' + changeDetails.day + ', in hour: ' + changeDetails.hour, read: false});
          userBInbox.messages.push({msg: 'The league manager added a game of your team.\nThe game is against ' + teamA + ', in day: ' + changeDetails.day + ', in hour: ' + changeDetails.hour, read: false});
        }
        else if (changeDetails.change === "DeleteGame") {
          userAInbox.messages.push({msg: 'The league manager deleted a game of your team against ' + teamB + '.\nThe game supposed to be in day: ' + changeDetails.day + ', in hour: ' + changeDetails.hour, read: false});
          userBInbox.messages.push({msg: 'The league manager deleted a game of your team against ' + teamA + '.\nThe game supposed to be in day: ' + changeDetails.day + ', in hour: ' + changeDetails.hour, read: false});
        }
        else if (changeDetails.change === "ChangeGame") {
          userAInbox.messages.push({msg: 'The league manager changed a game of your team against ' + teamB + '.\nThe game rescheduled to be in day: ' + changeDetails.day + ', in hour: ' + changeDetails.hour, read: false});
          userBInbox.messages.push({msg: 'The league manager changed a game of your team against ' + teamA + '.\nThe game rescheduled to be in day: ' + changeDetails.day + ', in hour: ' + changeDetails.hour, read: false});
        }
        else { // Not implemented yet

        }
        result = this.client
          .db("FootballLeague")
          .collection("Users")
          .updateOne({ username: userA }, { $set: {"inbox": userAInbox} });
        result = this.client
        .db("FootballLeague")
        .collection("Users")
        .updateOne({ username: userB }, { $set: {"inbox": userBInbox} });
        
        return { 
            success: true,
        }

    } else {
      console.log('Inserting new schedule');
      result = await this.client
      .db("FootballLeague")
      .collection("Schedule")
      .insertOne({ 
        schedule: schedule, 
        gamesToBeCompleted: gamesToBeCompleted, 
        teamsNumbers, teamsConstraints,
        gamesIdsToUsers: gamesIdsToUsers,
      });

      // Updating all the users about the schedule
      result = this.client
        .db("FootballLeague")
        .collection("Users")
        .find({ role: 'captain' });
      result = await result.toArray();
      for (let i=0; i<result.length; i++) {
        let user = result[i].username;
        let userInbox = result[i].inbox;
        console.log('user: ' + user + ', userInbox: ' + userInbox);
        userInbox.messages.push({ msg: 'The league manager has schedule the league, you can watch it on "Schedule"', read: false});
        let updateResult = this.client
          .db("FootballLeague")
          .collection("Users")
          .updateOne({ username: user }, { $set: {"inbox": userInbox} });
      }

      return {
        success: true,
        schedule: schedule,
        teamsNumbers: teamsNumbers,
        gamesToBeCompleted: gamesToBeCompleted,
        teamsConstraints: teamsConstraints,
      }
    }
  }

  async getMessages(user) {
    console.log('In database - getMessages()');
    let result = await this.getUser(user);
    if (!result.success)
      return result;
    
    console.log('result.inbox.messages: ' + result.inbox.messages);
    return {
      success: true,
      inbox: result.inbox,
    }
  }

  async updateInbox(inbox, user) {
    console.log('inbox: ' + inbox);
    console.log('user: ' + user);

    console.log('In database - getMessaupdateInboxges()');
    let result = await this.getUser(user);
    console.log('result: ' + result);
    if (!result.success)
      return result;
    
    result = this.client
    .db("FootballLeague")
    .collection("Users")
    .updateOne({ username: user }, { $set: {"inbox": inbox} });
    return { 
      success: true,
    }
  }
};
