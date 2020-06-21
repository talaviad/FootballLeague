var MongoClient = require("mongodb").MongoClient;
var bcrypt = require("bcrypt");
var config = require("./config.js");

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

  async registerNewUser(user, pass, email, requestedRole, team) {
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
          team: team,
          inbox: {
            messages: [
              {
                msg: "Hello " + user + ", we hope you will enjoy our app",
                read: false,
              },
            ],
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

    if (requestedRole === "referee") {
      result = await this.client
        .db("FootballLeague")
        .collection("RefereesGames")
        .insertOne({
          user: user,
          games: {},
        });
    }

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

      //for the Clubs page - players stats of team1
      let result1 = await this.client
        .db("FootballLeague")
        .collection("Clubs")
        .find({
          clubName: combine_dict[i].Team,
        });

      result1 = await result1.toArray();
      for (var j = 0; j < result1[0].players.length; j++) {
        if (result1[0].players[j].jerseyNumber === combine_dict[i].Number) {
          result1[0].players[j].goals = result1[0].players[j].goals + 1;
          break;
        }
      }
      let result2 = this.client
        .db("FootballLeague")
        .collection("Clubs")
        .replaceOne({ clubName: result1[0].clubName }, result1[0]);

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
    console.log("Trying to find user: " + user);
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

  async addNewClub(clubName, players, color) {
    try {
      console.log("In DataBase, addNewClub()");
      await this.client
        .db("FootballLeague")
        .collection("LeagueTable")
        .insertOne({
          Club: clubName,
          MP: 0,
          W: 0,
          D: 0,
          L: 0,
          GF: 0,
          GA: 0,
          GD: 0,
          Pts: 0,
        });
      console.log(
        "In DataBase, addNewClub()- succeed to insert a new club - " + clubName
      );
      await this.client.db("FootballLeague").collection("Clubs").insertOne({
        clubName: clubName,
        players: players,
        color: color,
        results: [],
      });
      console.log(
        "In DataBase, addNewClub()- succeed to insert a squad of a club - " +
          clubName
      );
      return { success: true };
    } catch (err) {
      console.log("In DataBase, addNewClub() - error: " + err);
      let error = {
        success: false,
        error: {
          msg: err,
        },
      };
      return error;
    }
  }
  async changePassword(username, oldPassword, newPassword) {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("Users")
        .find({ username: username });
      result = await result.toArray();
      if (result.length === 0) {
        let error = {
          success: false,
          error: {
            msg: "Not exist such username",
          },
        };
        return error;
      } else {
        let passwordAreMatch = await bcrypt.compare(
          oldPassword,
          result[0].password
        );
        if (passwordAreMatch) {
          let hashPassword = await bcrypt.hash(
            newPassword,
            config.BCRYPT_SALT_ROUNDS
          );
          result[0].password = hashPassword;
          let ans = this.client
            .db("FootballLeague")
            .collection("Users")
            .replaceOne({ username: result[0].username }, result[0]);
          return {
            success: true,
          };
        } else {
          let error = {
            success: false,
            error: {
              msg: "The password is incorrect",
            },
          };
          return error;
        }
      }
    } catch (err) {
      let error = {
        success: false,
        error: {
          msg: "Server Error, Please try again later",
        },
      };
      return error;
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
      console.log("for alon: " + result[2].Name);
      let results = result.map((scorer) => {
        console.log(JSON.stringify(JSON.stringify(scorer)));
        return [
          scorer.Name.toString(),
          scorer.Number.toString(),
          scorer.Team.toString(),
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

  async getClubs() {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("Clubs")
        .find();
      result = await result.toArray();
      // let results = result.map((club) => {
      //   return {
      //     clubName: club.clubName,
      //     players: club.players.map((player) => [
      //       player.jerseyNumber +
      //         "  " +
      //         player.firstName +
      //         " " +
      //         player.lastName,
      //     ]),
      //   };
      // });
      let resultsToTheServer = {
        success: true,
        tableData: result,
      };
      return resultsToTheServer;
    } catch {
      console.log("in catch");
      return {
        success: false,
        error: {
          msg: 'Coudln"t find collection "Clubs"',
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
          game.team1ScorrersDic,
          game.team2ScorrersDic,
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

  async getPlayersList(clubName) {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("Clubs")
        .find({ clubName: clubName });
      result = await result.toArray();

      let resultsToTheServer = {
        success: true,
        players: result[0].players,
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

  async getFreePlayers() {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("FreePlayers")
        .find();
      result = await result.toArray();
      let results = result.map((player) => {
        return [player.fullName, player.contactDetails, player.freeText];
      });
      let resultsToTheServer = {
        success: true,
        freePlayersArray: results,
      };
      return JSON.stringify(resultsToTheServer);
    } catch {
      console.log("in catch");
      return JSON.stringify({ success: false });
    }
  }

  async getLiveResult() {
    try {
      let result = await this.client
        .db("FootballLeague")
        .collection("LiveResults")
        .find();
      result = await result.toArray();
      if (result.length !== 0) {
        return {
          success: true,
          team1: result[0].team1,
          team2: result[0].team2,
          scoreTeam1: result[0].scoreTeam1,
          scoreTeam2: result[0].scoreTeam2,
        };
      } else {
        return { success: false };
      }
    } catch {
      console.log("in catch");
      return { success: false };
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

  async insertLiveResult(selectedTeam1, selectedTeam2, scoreTeam1, scoreTeam2) {
    try {
      await this.client
        .db("FootballLeague")
        .collection("LiveResults")
        .remove({});

      await this.client
        .db("FootballLeague")
        .collection("LiveResults")
        .insertOne({
          team1: selectedTeam1,
          team2: selectedTeam2,
          scoreTeam1: scoreTeam1,
          scoreTeam2: scoreTeam2,
        });

      return { success: true };
    } catch (err) {
      let error = {
        success: false,
        error: {
          msg: err,
        },
      };
      return error;
    }
  }

  async removeLiveResult() {
    try {
      await this.client
        .db("FootballLeague")
        .collection("LiveResults")
        .remove({});
      return { success: true };
    } catch (err) {
      let error = {
        success: false,
        error: {
          msg: err,
        },
      };
      return error;
    }
  }

  async removePlayer(clubName, playerJerseyNUmber) {
    try {
      await this.client
        .db("FootballLeague")
        .collection("Clubs")
        .update(
          { clubName: clubName },
          { $pull: { players: { jerseyNumber: playerJerseyNUmber } } }
        );
      return { success: true };
    } catch (err) {
      let error = {
        success: false,
        error: {
          msg: err,
        },
      };
      return error;
    }
  }

  async addPlayer(clubName, jerseyToAdd, firstNameToAdd, lastNameToAdd) {
    try {
      await this.client
        .db("FootballLeague")
        .collection("Clubs")
        .update(
          { clubName: clubName },
          {
            $push: {
              players: {
                $each: [
                  {
                    jerseyNumber: jerseyToAdd,
                    firstName: firstNameToAdd,
                    lastName: lastNameToAdd,
                    goals: 0,
                  },
                ],
              },
            },
          }
        );
      return { success: true };
    } catch (err) {
      let error = {
        success: false,
        error: {
          msg: err,
        },
      };
      return error;
    }
  }

  async addFreePlayer(fullName, contactDetails, freeText) {
    try {
      await this.client.db("FootballLeague").collection("FreePlayers").insert({
        fullName: fullName,
        contactDetails: contactDetails,
        freeText: freeText,
      });
      return { success: true };
    } catch (err) {
      let error = {
        success: false,
        error: {
          msg: err,
        },
      };
      return error;
    }
  }

  async insertResult(
    selectedTeam1,
    selectedTeam2,
    scoreTeam1,
    scoreTeam2,
    date,
    team1ScorrersDic,
    team2ScorrersDic
  ) {
    let winner = 0;
    try {
      //remove the live result
      await this.client
        .db("FootballLeague")
        .collection("LiveResults")
        .remove({});

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
          team1ScorrersDic: team1ScorrersDic,
          team2ScorrersDic: team2ScorrersDic,
        });
      //for the Clubs page - team stats
      result = this.client
        .db("FootballLeague")
        .collection("Clubs")
        .updateMany(
          { $or: [{ clubName: selectedTeam1 }, { clubName: selectedTeam2 }] },
          {
            $push: {
              results: {
                team1: selectedTeam1,
                result: scoreTeam1 + " - " + scoreTeam2,
                team2: selectedTeam2,
                date: date,
              },
            },
          }
        );

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
    console.log("result: " + result);
    result = await result.toArray();

    if (result.length !== 0) {
      console.log("pitchConstraints: " + pitchConstraints);
      console.log("result: " + result[0]);
      console.log(
        "there are already pitch constraints, now we will update them"
      );
      result = this.client
        .db("FootballLeague")
        .collection("PitchConstraints")
        .replaceOne({}, { pitchConstraints: pitchConstraints });
      return {
        success: true,
      };
    } else {
      console.log(
        "there are no pitch constraints yet, now we will insert thyem"
      );
      result = await this.client
        .db("FootballLeague")
        .collection("PitchConstraints")
        .insertOne({
          pitchConstraints: pitchConstraints,
        });
      return {
        success: true,
      };
    }
  }

  async insertOrUpdateConstraints(
    user,
    weeklyConstraints,
    specificConstraints,
    collection
  ) {
    let result = await this.getUser(user);
    if (result.success) {
      result = await this.client
        .db("FootballLeague")
        .collection(collection)
        .find({ user: user });
      result = await result.toArray();
      console.log("result: " + result);
      if (result.length !== 0) {
        console.log("there is already user, now we will update");
        let teamName = result[0].teamName;
        result = this.client
          .db("FootballLeague")
          .collection(collection)
          .replaceOne(
            { user: user },
            {
              teamName: teamName,
              user: user,
              weeklyConstraints: weeklyConstraints,
              specificConstraints: specificConstraints,
            }
          );
        return {
          success: true,
        };
      } else {
        console.log("there is no user, now we will insert");
        result = await this.client
          .db("FootballLeague")
          .collection("Users")
          .find({ username: user });
        result = await result.toArray();
        console.log("result: " + result[0]);
        let team = result[0].team;
        console.log("The team is: " + team);
        result = await this.client
          .db("FootballLeague")
          .collection(collection)
          .insertOne({
            user: user,
            teamName: team,
            weeklyConstraints: weeklyConstraints,
            specificConstraints: {
              counter: 0,
              constraints: [],
            },
          });
        console.log("uuuuuuuuuuuuuuuuuuuuuu");
        return {
          success: true,
        };
      }
    } else {
      console.log("failed to get user");
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
      for (let i = 0; i < result.length; i++) {
        let teamId = i + 1;
        let teamName = result[i].teamName;
        let constraints = result[i].weeklyConstraints;
        let user = result[i].user;
        teamsConstraints[teamId] = {
          teamName: teamName,
          constraints: constraints,
          teamCaptainUser: user,
        };
      }
      return {
        success: true,
        teamsConstraints: teamsConstraints,
      };
    } else {
      console.log("there are captain constraints set yet");
      return {
        success: false,
        error: {
          msg: "there are captain constraints set yet",
        },
      };
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
    console.log("before toArray()");
    result = await result.toArray();
    // We assume there are already constraints on database..
    if (result.length !== 0) {
      return {
        success: true,
        pitchConstraints: result[0].pitchConstraints,
      };
    } else {
      console.log("there are no pitch constraints on database yet");
      return {
        success: false,
        error: {
          msg: "there are no pitch constraints set yet",
        },
      };
    }
  }

  async getLeagueSchedule() {
    console.log("In Database.js - getLeagueSchedule() - at beginning.....");
    let result = await this.client
      .db("FootballLeague")
      .collection("Schedule")
      .find({});
    result = await result.toArray();
    if (result.length === 0)
      return {
        success: false,
        error: {
          msg: "there is no schedule set by league manager yet",
        },
      };

    let schedule = result[0].schedule;
    let teamsNumbers = result[0].teamsNumbers;
    let refereesSchedule = result[0].refereesSchedule;
    let teamsConstraints = result[0].teamsConstraints;
    let weekDates = result[0].weekDates;

    console.log("In Database.js - getLeagueSchedule() - returning.....");
    return {
      success: true,
      schedule: schedule,
      teamsNumbers: teamsNumbers,
      refereesSchedule: refereesSchedule,
      teamsConstraints: teamsConstraints,
      weekDates: weekDates,
    };
  }

  async getConstraints(user, collection) {
    let result = await this.getUser(user);
    if (result.success) {
      result = await this.client
        .db("FootballLeague")
        .collection("Schedule")
        .find({});
      result = await result.toArray();
      let canSubmit = result.length === 0;
      result = await this.client
        .db("FootballLeague")
        .collection(collection)
        .find({ user: user });
      result = await result.toArray();
      console.log("result: " + result);
      if (result.length !== 0) {
        console.log(
          "there is a user, now we will send the constraints to the client"
        );
        console.log("constraints: " + result[0].weeklyConstraints);
        return {
          success: true,
          weeklyConstraints: result[0].weeklyConstraints,
          specificConstraints: result[0].specificConstraints,
          canSubmit: canSubmit,
        };
      } else {
        console.log("that user(" + user + ") is not set with constraints");
        return {
          success: false,
          error: {
            msg: "there are no constraints set yet",
          },
        };
      }
    } else {
      console.log("failed to get user");
      return result;
    }
  }

  async getManagerSchedule() {
    let result = await this.client
      .db("FootballLeague")
      .collection("Schedule")
      .find({});
    console.log("result: " + result);
    result = await result.toArray();
    if (result.length !== 0) {
      let refereesResult = await this.client
        .db("FootballLeague")
        .collection("RefereeConstraints")
        .find({});
      console.log("result: " + refereesResult);
      refereesResult = await refereesResult.toArray();
      let refereesConstraints = [];
      for (let i = 0; i < refereesResult.length; i++) {
        refereesConstraints.push({
          user: refereesResult[i].user,
          constraints: refereesResult[i].weeklyConstraints,
        });
      }

      return {
        success: true,
        schedule: result[0].schedule,
        refereesSchedule: result[0].refereesSchedule,
        gamesToBeCompleted: result[0].gamesToBeCompleted,
        teamsNumbers: result[0].teamsNumbers,
        teamsConstraints: result[0].teamsConstraints,
        refereesConstraints: refereesConstraints,
        weekDates: result[0].weekDates,
      };
    } else {
      result = await this.getTeamsConstraints();
      if (!result.success) {
        return {
          success: false,
          error: {
            msg: "there is no schedule set",
          },
        };
      }

      return {
        success: true,
        teamsConstraints: result.teamsConstraints,
        refereesConstraints: [],
      };
    }
  }

  async deleteGameFromReferee(changeDetails) {
    console.log("In Database.js - deleteGameFromReferee()");
    let referee = changeDetails.exReferee;
    let matchId = changeDetails.matchId;
    let result = await this.client
      .db("FootballLeague")
      .collection("RefereesGames")
      .find({ user: referee });

    result = await result.toArray();
    if (result.length === 0)
      return {
        success: false,
        error: {
          msg: "no such referee games for: " + referee,
        },
      };

    let games = result[0].games;
    let day = games[matchId].day;
    let hour = games[matchId].hour;
    let teamA = games[matchId].teamA;
    let teamB = games[matchId].teamB;

    delete games[matchId];
    result = await this.client
      .db("FootballLeague")
      .collection("RefereesGames")
      .updateOne({ user: referee }, { $set: { games: games } });

    // Send the referee a message to let him know
    result = await this.client
      .db("FootballLeague")
      .collection("Users")
      .find({ username: referee });
    result = await result.toArray();
    if (result.length === 0)
      return {
        success: false,
        error: {
          msg: "no such user: " + referee,
        },
      };

    let inbox = result[0].inbox;
    let game =
      teamA + " - " + teamB + ", on day: " + day + ", at " + hour + "o`clock";
    inbox.messages.push({
      msg: "The league manager has removed you from game: " + game,
    });
    result = await this.client
      .db("FootballLeague")
      .collection("Users")
      .updateOne({ username: referee }, { $set: { inbox: inbox } });

    return {
      success: true,
    };
  }

  async updateSchedule(
    schedule,
    gamesToBeCompleted,
    teamsNumbers,
    teamsConstraints,
    gamesIdsToUsers,
    changeDetails,
    refereesConstraints,
    refereesSchedule,
    weekDates
  ) {
    let result = await this.client
      .db("FootballLeague")
      .collection("Schedule")
      .find({});
    console.log("result: " + result);
    result = await result.toArray();

    if (result.length !== 0) {
      console.log("Updating an existung schedule");
      console.log("result: " + result[0]);
      let gamesIdsToUsers = result[0].gamesIdsToUsers;
      result = this.client
        .db("FootballLeague")
        .collection("Schedule")
        .replaceOne(
          {},
          {
            schedule: schedule,
            gamesToBeCompleted: gamesToBeCompleted,
            teamsNumbers: teamsNumbers,
            teamsConstraints: teamsConstraints,
            gamesIdsToUsers: result[0].gamesIdsToUsers,
            refereesConstraints: refereesConstraints,
            refereesSchedule: refereesSchedule,
            weekDates: weekDates,
          }
        );
      if (changeDetails.change === "SetWeekDate") {
        return { success: true };
      }
      let userA = gamesIdsToUsers[changeDetails.matchId][0].user;
      let teamA = gamesIdsToUsers[changeDetails.matchId][0].teamName;
      let userB = gamesIdsToUsers[changeDetails.matchId][1].user;
      let teamB = gamesIdsToUsers[changeDetails.matchId][1].teamName;

      // Send messages to the users
      result = this.client
        .db("FootballLeague")
        .collection("Users")
        .find({ $or: [{ username: userA }, { username: userB }] });
      if (result.length === 0)
        return {
          success: false,
          error: {
            msg: "change has set but the users didnt get the message",
          },
        };
      result = await result.toArray();
      console.log("before updating the messages of the users...");
      console.log(
        "changeDetails.change: " +
          changeDetails.change +
          ", changeDetails.matchId: " +
          changeDetails.matchId
      );
      console.log("userA: " + userA + ", userB: " + userB);
      let userAInbox =
        result[0].username === userA ? result[0].inbox : result[1].inbox;
      let userBInbox =
        result[0].username === userB ? result[0].inbox : result[1].inbox;
      if (changeDetails.change === "AddGame") {
        userAInbox.messages.push({
          msg:
            "The league manager added a game of your team.\nThe game is against " +
            teamB +
            ", in day: " +
            changeDetails.day +
            ", in hour: " +
            changeDetails.hour,
          read: false,
        });
        userBInbox.messages.push({
          msg:
            "The league manager added a game of your team.\nThe game is against " +
            teamA +
            ", in day: " +
            changeDetails.day +
            ", in hour: " +
            changeDetails.hour,
          read: false,
        });
      } else if (changeDetails.change === "DeleteGame") {
        userAInbox.messages.push({
          msg:
            "The league manager deleted a game of your team against " +
            teamB +
            ".\nThe game supposed to be in day: " +
            changeDetails.day +
            ", in hour: " +
            changeDetails.hour,
          read: false,
        });
        userBInbox.messages.push({
          msg:
            "The league manager deleted a game of your team against " +
            teamA +
            ".\nThe game supposed to be in day: " +
            changeDetails.day +
            ", in hour: " +
            changeDetails.hour,
          read: false,
        });
      } else if (changeDetails.change === "ChangeGame") {
        userAInbox.messages.push({
          msg:
            "The league manager changed a game of your team against " +
            teamB +
            ".\nThe game rescheduled to be in day: " +
            changeDetails.day +
            ", in hour: " +
            changeDetails.hour,
          read: false,
        });
        userBInbox.messages.push({
          msg:
            "The league manager changed a game of your team against " +
            teamA +
            ".\nThe game rescheduled to be in day: " +
            changeDetails.day +
            ", in hour: " +
            changeDetails.hour,
          read: false,
        });
      } else {
        // Not implemented yet
      }

      // Removing the exReferee and let him know
      if (changeDetails.eXeferee)
        await this.deleteGameFromReferee(changeDetails);

      // Adding the new referee and let him know
      if (changeDetails.newReferee) await this.addGameToReferee(changeDetails);

      result = this.client
        .db("FootballLeague")
        .collection("Users")
        .updateOne({ username: userA }, { $set: { inbox: userAInbox } });
      result = this.client
        .db("FootballLeague")
        .collection("Users")
        .updateOne({ username: userB }, { $set: { inbox: userBInbox } });

      return {
        success: true,
      };
    } else {
      let refereesResult = await this.client
        .db("FootballLeague")
        .collection("RefereeConstraints")
        .find({});
      refereesResult = await refereesResult.toArray();
      let refereesConstraints = [];
      for (let i = 0; i < refereesResult.length; i++) {
        refereesConstraints.push({
          user: refereesResult[i].user,
          constraints: refereesResult[i].weeklyConstraints,
        });
      }

      console.log("Inserting new schedule");
      let weekDates = [];
      for (let weekNum = 0; weekNum < schedule.length; weekNum++) {
        weekDates.push({
          dateIsSet: false,
          date: null,
        });
      }
      console.log("weekDates: " + weekDates);

      result = await this.client
        .db("FootballLeague")
        .collection("Schedule")
        .insertOne({
          schedule: schedule,
          refereesSchedule: refereesSchedule,
          gamesToBeCompleted: gamesToBeCompleted,
          teamsNumbers: teamsNumbers,
          teamsConstraints: teamsConstraints,
          gamesIdsToUsers: gamesIdsToUsers,
          refereesConstraints: refereesConstraints,
          weekDates: weekDates,
        });

      // Updating all the users about the schedule
      result = this.client
        .db("FootballLeague")
        .collection("Users")
        .find({ role: "captain" });
      result = await result.toArray();
      for (let i = 0; i < result.length; i++) {
        let user = result[i].username;
        let userInbox = result[i].inbox;
        console.log("user: " + user + ", userInbox: " + userInbox);
        userInbox.messages.push({
          msg:
            'The league manager has schedule the league, you can watch it on "Schedule"',
          read: false,
        });
        let updateResult = this.client
          .db("FootballLeague")
          .collection("Users")
          .updateOne({ username: user }, { $set: { inbox: userInbox } });
      }

      return {
        success: true,
        schedule: schedule,
        refereesSchedule: refereesSchedule,
        teamsNumbers: teamsNumbers,
        gamesToBeCompleted: gamesToBeCompleted,
        teamsConstraints: teamsConstraints,
        refereesConstraints: refereesConstraints,
        weekDates: weekDates,
      };
    }
  }

  async getRefereesGames() {
    let result = this.client
      .db("FootballLeague")
      .collection("RefereesGames")
      .find({});
    result = await result.toArray();
    if (result.length === 0)
      return {
        success: false,
        error: {
          msg: "no referees are found in the league",
        },
      };

    let refereesGames = [];
    for (let i = 0; i < result.length; i++) {
      refereesGames.push(result[i]);
    }

    return {
      success: true,
      refereesGames: refereesGames,
    };
  }

  async getMessages(user) {
    console.log("In database - getMessages()");
    let result = await this.getUser(user);
    if (!result.success) return result;

    console.log("result.inbox.messages: " + result.inbox.messages);
    return {
      success: true,
      inbox: result.inbox,
    };
  }

  async addGameToReferee(changeDetails) {
    console.log("In Database.js - addGameToReferee()");
    let referee = changeDetails.newReferee;
    let matchId = changeDetails.matchId;
    let result = await this.client
      .db("FootballLeague")
      .collection("RefereesGames")
      .find({ user: referee });

    result = await result.toArray();
    if (result.length === 0)
      return {
        success: false,
        error: {
          msg: "no such referee games for: " + referee,
        },
      };

    let games = result[0].games;
    games[changeDetails.matchId] = {
      day: changeDetails.day,
      hour: changeDetails.hour,
      teamA: changeDetails.teamA,
      teamB: changeDetails.teamB,
    };

    result = await this.client
      .db("FootballLeague")
      .collection("RefereesGames")
      .updateOne({ user: referee }, { $set: { games: games } });

    // Send the referee a message to let him know
    result = await this.client
      .db("FootballLeague")
      .collection("Users")
      .find({ username: referee });
    result = await result.toArray();
    if (result.length === 0)
      return {
        success: false,
        error: {
          msg: "no such user: " + referee,
        },
      };

    let inbox = result[0].inbox;
    let game =
      changeDetails.teamA +
      " - " +
      changeDetails.teamB +
      ", on day: " +
      changeDetails.day +
      ", at " +
      changeDetails.hour +
      "o`clock";
    inbox.messages.push({
      msg: "The league manager has added you to judge the game: " + game,
    });
    result = await this.client
      .db("FootballLeague")
      .collection("Users")
      .updateOne({ username: referee }, { $set: { inbox: inbox } });

    return {
      success: true,
    };
  }

  async updateRefereesSchedule(refereesSchedule, changeDetails) {
    console.log("In Database.js - updateRefereesSchedule()");
    let result = await this.getUser(changeDetails.referee);
    if (!result.success) return result;

    switch (changeDetails.change) {
      case "AddRefereeToGame":
        result = await this.addGameToReferee(changeDetails);
        break;
      case "ChangeReferees":
        result = await this.addGameToReferee(changeDetails);
        changeDetails.referee = changeDetails.exReferee;
        result = await this.deleteGameFromReferee(changeDetails);
        // if (refereeGames[changeDetails.matchId])
        //   refereeGames[changeDetails.matchId] = null;
        break;
      default:
        break;
    }

    if (!result.success) return result;

    // Updating the referees schedule
    result = await this.client
      .db("FootballLeague")
      .collection("Schedule")
      .updateOne({}, { $set: { refereesSchedule: refereesSchedule } });

    return {
      success: true,
    };
  }

  async updateInbox(inbox, user) {
    console.log("inbox: " + inbox);
    console.log("user: " + user);

    console.log("In database - getMessaupdateInboxges()");
    let result = await this.getUser(user);
    console.log("result: " + result);
    if (!result.success) return result;

    result = await this.client
      .db("FootballLeague")
      .collection("Users")
      .updateOne({ username: user }, { $set: { inbox: inbox } });

    console.log("returning trueeee");
    return {
      success: true,
    };
  }
};
