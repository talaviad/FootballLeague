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
};
