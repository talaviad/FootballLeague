module.exports = class Schedule {
  // tal's old state
  constructor(database) {
    console.log("connecting to database...");
    this.database = database;
    this.computeScheduling = this.computeScheduling.bind(this);
    this.checkSchedule = this.checkSchedule.bind(this);
    this.rotateLeft = this.rotateLeft.bind(this);
    this.rotateRight = this.rotateRight.bind(this);
    this.checkConstraints = this.checkConstraints.bind(this);
    this.checkCurrSchedule = this.checkCurrSchedule.bind(this);
    this.setWinSchedule = this.setWinSchedule.bind(this);
    this.isThereSchedule = this.isThereSchedule.bind(this);
  }

  computeScheduling = async () => {
    let result = await this.database.getPitchConstraints();
    if (!result.success) return result;

    let pitchConstraints = result.pitchConstraints;
    console.log("pitchConstraints: " + pitchConstraints);
    result = await this.database.getTeamsConstraints();
    if (!result.success) return result;

    let teamsConstraints = result.teamsConstraints;
    console.log("pitchConstraints: " + pitchConstraints);
    console.log(
      "teamsConstraints[1].constraints: " + teamsConstraints[1].constraints
    );
    console.log(
      "teamsConstraints[2].constraints: " + teamsConstraints[2].constraints
    );
    console.log(
      "teamsConstraints[3].constraints: " + teamsConstraints[3].constraints
    );
    console.log(
      "teamsConstraints[4].constraints: " + teamsConstraints[4].constraints
    );

    // Suits the teams constraints and the pitch constraints to be synchronized
    let arr = [];
    for (let teamId in teamsConstraints) {
      arr.push(teamId);
      for (let i = 0; i < pitchConstraints.length; i++) {
        teamsConstraints[teamId].constraints[i].splice(0, 1);
        console.log(
          "numOfDays of " +
            teamId +
            ": " +
            teamsConstraints[teamId].constraints[i].length
        );
        for (let j = 1; j < pitchConstraints[0].length; j++) {
          console.log(
            "teamsConstraints[teamId].constraints[i][j-1]: " +
              teamsConstraints[teamId].constraints[i][j - 1]
          );
          console.log("pitchConstraints[i][j]: " + pitchConstraints[i][j]);
          console.log(
            "(teamsConstraints[" +
              teamId +
              "].constraints[" +
              i +
              "][" +
              (j - 1) +
              "] && pitchConstraints[" +
              i +
              "][" +
              j +
              "]: " +
              (teamsConstraints[teamId].constraints[i][j - 1] &&
                pitchConstraints[i][j])
          );
          teamsConstraints[teamId].constraints[i][j - 1] =
            teamsConstraints[teamId].constraints[i][j - 1] &&
            pitchConstraints[i][j];
        }
      }
    }

    // for(let teamId in teamsConstraints) {
    //     console.log('Constraints of ' + teamId + ':')
    //     for(let i=0; i<teamsConstraints[teamId].constraints.length; i++) {
    //         for(let j=0; j<teamsConstraints[teamId].constraints[0].length; j++) {
    //             console.log('Day: ' + (i+1) +', Hour: ' + (j+1) + ', CanPlay: ' + teamsConstraints[teamId].constraints[i][j]);
    //         }
    //     }
    // }
    console.log(
      "teamsConstraints[1].constraints: " + teamsConstraints[1].constraints
    );
    let arr1 = arr.splice(0, arr.length / 2);
    console.log("arr1: " + arr1);
    console.log("arr: " + arr);
    arr = [arr1, arr];
    console.log("arr after union: " + arr);

    console.log("computeScheduling(): In beginning");
    let matrix = [];
    for (let j = 1; j <= arr[0].length * 2; j++) {
      matrix[j] = new Array(arr[0].length * 2 + 1);
    }

    let numOfDays = teamsConstraints[1].constraints[0].length;
    let numOfHours = teamsConstraints[1].constraints.length;
    console.log("numOfDays: " + numOfDays);
    console.log("numOfHours: " + numOfHours);
    const matches = [];
    let teamVsTeamId = 0;
    let teamsNumbers = [];
    let gamesIdsToUsers = {};
    for (let i = 1; i <= arr[0].length * 2; i++) {
      //should also add a consider to pitch constraints
      for (let j = i + 1; j <= arr[0].length * 2; j++) {
        let constraintsA = teamsConstraints[i].constraints;
        let constraintsB = teamsConstraints[j].constraints;
        let matchFound = false;
        matches[teamVsTeamId] = new Array(numOfDays * numOfHours).fill(0);
        console.log("Pre-check: teamA: " + i);
        console.log("Pre-check teamB: " + j);
        for (let k = 0; k < constraintsA.length; k++) {
          for (let m = 0; m < constraintsA[0].length; m++) {
            let canPlayInThatTime =
              constraintsA[k][m] === 1 && constraintsB[k][m] === 1
                ? true
                : false;
            matches[teamVsTeamId][
              k * constraintsA[0].length + m
            ] = canPlayInThatTime;
            //console.log('tttt constraintsA['+k+']['+m+']: ' + constraintsA[k][m] + ',   constraintsB['+k+']['+m+']: ' + constraintsB[k][m]);
            if (canPlayInThatTime) {
              matrix[i][j] = [1, teamVsTeamId];
              matrix[j][i] = [1, teamVsTeamId];
              matchFound = true;
              teamsNumbers[teamVsTeamId] = [i, j];
              console.log(
                "teamsConstraints[i].teamName: " + teamsConstraints[i].teamName
              );
              gamesIdsToUsers[teamVsTeamId] = [
                {
                  user: teamsConstraints[i].teamCaptainUser,
                  teamName: teamsConstraints[i].teamName,
                },
                {
                  user: teamsConstraints[j].teamCaptainUser,
                  teamName: teamsConstraints[j].teamName,
                },
              ];
            }
          }
        }
        if (!matchFound) {
          console.log("in pre-checking we found false");
          console.log(
            "Problem - teamA: " +
              i +
              ", teamB: " +
              j +
              ", cannot play against each other"
          );
          return;
        }
        teamVsTeamId++;
      }
    }
    console.log("matrix: " + matrix);
    console.log("teamsNumbers: " + teamsNumbers);
    console.log("matches: " + matches);

    let playedGames = {};
    let games = [];
    let ans = this.checkSchedule(
      arr,
      0,
      matrix,
      arr[0].length * 2,
      games,
      matches,
      teamsNumbers,
      playedGames
    );
    console.log("ans.success: " + ans.success);
    console.log("games: " + games);

    // Checking the results to make sure
    for (let i = 0; i < arr[0].length * 2 - 1; i++) {
      for (let j = 0; j < arr[0].length; j++) {
        let teamA = arr[0][j];
        let teamB = arr[1][j];
        if (!matrix[teamA][teamB]) {
          console.log("in checking we found false");
          console.log("Problem - teamA: " + teamA + ", teamB: " + teamB);
          return {
            success: false,
            error: {
              msg: "Problem - teamA: " + teamA + ", teamB: " + teamB,
            },
          };
        }
      }
      this.rotateRight(arr, 0);
    }
    console.log("in checking we found true");
    console.log("scheduleeeeeeeeeeeeeeee: " + ans.schedule);
    if (ans.success) {
      // Adding to database and making referess schedule
      let refereesSchedule = JSON.parse(JSON.stringify(ans.schedule));
      for (let i = 0; i < refereesSchedule.length; i++) {
        for (let j = 0; j < refereesSchedule[0].length; j++) {
          refereesSchedule[i][j] = {};
        }
        console.log("refereesSchedule[" + i + "]: " + refereesSchedule[i]);
      }
      let result = await this.database.updateSchedule(
        ans.schedule,
        [],
        teamsNumbers,
        teamsConstraints,
        gamesIdsToUsers,
        null,
        null,
        refereesSchedule
      );
      return result;
    } else {
      return {
        success: false,
        error: {
          msg:
            "server could not find any schedule with the current constraints",
        },
      };
    }
  };

  checkSchedule(
    arr,
    rowIndex,
    matrix,
    originalLength,
    games,
    matches,
    teamsNumbers,
    playedGames
  ) {
    console.log("checkSchedule(): in beginning");
    let ans;
    if (originalLength === 4 || (arr[0].length - rowIndex) * 2 === 4) {
      console.log("checkSchedule(): in original or length === 4");
      for (let i = 0; i < 3; i++) {
        ans = this.checkCurrSchedule(
          arr,
          matrix,
          games,
          matches,
          teamsNumbers,
          playedGames
        );
        if (ans.success) {
          this.setWinSchedule(games, arr);
          this.rotateLeft(arr, i, rowIndex);
          //this.printSchedule(schedule);
          ans.teamsNumbers = teamsNumbers;
          return ans;
        }
        this.rotateRight(arr, rowIndex);
      }
      return { success: false };
    }
    let currLength = (arr[0].length - rowIndex) * 2;
    // if (maxMatch !== -1 && rowIndex>maxMatch)
    //     return false;
    for (let i = 0; i < currLength - 1; i++) {
      // console.log('Going to check constraints for: ');
      ans = this.checkCurrSchedule(
        arr,
        matrix,
        games,
        matches,
        teamsNumbers,
        playedGames
      );
      if (ans.success) {
        this.setWinSchedule(games, arr);
        this.rotateLeft(arr, i, rowIndex);
        ans.teamsNumbers = teamsNumbers;
        return ans;
      }

      ans = this.checkSchedule(
        arr,
        rowIndex + 1,
        matrix,
        originalLength,
        games,
        matches,
        teamsNumbers,
        playedGames
      );
      if (ans.success) {
        //this.setWinSchedule(games, arr);
        this.rotateLeft(arr, i, rowIndex);
        ans.teamsNumbers = teamsNumbers;
        return ans;
      }
      this.rotateRight(arr, rowIndex);
    }
    return { success: false };
  }

  setWinSchedule(games, arr) {
    console.log("here");
    games.push("<<<<<<<<start>>>>>>>>");
    for (let j = 0; j < arr[0].length; j++) {
      games.push([arr[0][j], " vs ", arr[1][j]]);
    }
    games.push("<<<<<<<<end>>>>>>>>");
  }

  checkCurrSchedule(arr, matrix, games, matches, teamsNumbers, playedGames) {
    let length = arr[0].length * 2;
    let schedule = new Array(length - 1);
    for (let i = 0; i < schedule.length; i++) {
      schedule[i] = new Array(matches[0].length);
      for (let j = 0; j < matches[0].length; j++) {
        schedule[i][j] = [1];
      }
    }
    //.fill(new Array(matches[0].length).fill(new Array(1).fill(1)));
    for (let i = 0; i < length - 1; i++) {
      console.log("schedule[i]: " + schedule[i]);
      if (
        !this.checkConstraints(
          arr,
          0,
          matrix,
          matches,
          schedule[i],
          playedGames
        )
      ) {
        //this.setWinSchedule(games, arr);
        this.rotateLeft(arr, i, 0);
        return { success: false };
      }
      this.rotateRight(arr, 0);
    }
    console.log("checkCurrSchedule(): There is a schedule: ");
    //this.printSchedule(schedule, teamsNumbers);
    return { success: true, schedule: schedule };
  }

  checkConstraints(arr, rowIndex, matrix, matches, schedule, playedGames) {
    let length = arr[0].length;
    let matchesIds = [];
    for (let i = rowIndex; i < length; i++) {
      let teamA = arr[0][i];
      let teamB = arr[1][i];
      let teamVsTeamId = matrix[teamA][teamB][1];
      console.log("checkConstraints(): teamA: " + teamA);
      console.log("checkConstraints(): teamB: " + teamB);
      console.log("checkConstraints(): teamVsTeamId: " + teamVsTeamId);
      matchesIds.push([teamVsTeamId, 0]);
    }

    let ans = this.isThereSchedule(matches, matchesIds, schedule);
    console.log("checkConstraints(): return " + ans + " from here");
    return ans;
  }

  // printSchedule(schedule, teamsNumbers) {
  //     let length = schedule.length;
  //     console.log('<<<<<<<<start>>>>>>>>');
  //     for (let i=0; i<length; i++) {
  //         console.log('Week ' + (i+1));
  //         for (let j=0; j<schedule[i].length; j++) {
  //             if (schedule[i][j][0] === 0) {
  //                 let day = Math.ceil((j+1)/(this.state.teamsConstraints[1].constraints[0].length));
  //                 let temp = (j+1)%(this.state.teamsConstraints[1].constraints[0].length);
  //                 let hour = (temp === 0)? this.state.teamsConstraints[1].constraints[0].length : temp;
  //                 let teamsId = schedule[i][j][1];
  //                 console.log('teamsId: ' + teamsId);
  //                 let teamA = teamsNumbers[teamsId][0];
  //                 let teamB = teamsNumbers[teamsId][1];
  //                 console.log('Day: ' + day + ', Hour: ' + hour + ', Teams: (' +teamA + ' vs ' + teamB + ')');
  //             }
  //         }
  //     }
  //     console.log('<<<<<<<<end>>>>>>>>');
  // }

  isThereSchedule(matches, matchesIds, schedule) {
    let ans;
    //let maxMatch = 0;
    console.log("isThereSchedule(): in beginning");
    for (let k = 0; k < matchesIds.length; k++) {
      let startMatcheId = matchesIds[k][0];
      let isBraked = false;
      for (let j = matchesIds[k][1]; j < matches[startMatcheId].length; j++) {
        // console.log('matches[startMatcheId][j]: ' + matches[startMatcheId][j]);
        // console.log('schedule[j][0]: ' + schedule[j][0]);
        //maxMatch = (k>maxMatch)? k : maxMatch;
        if (matches[startMatcheId][j] && schedule[j][0] === 1) {
          //matchesIds.shift(); // Remove startMatcheId
          //console.log('Now mas is: ' + max);
          console.log("j: " + j);
          schedule[j] = [0, startMatcheId];
          // console.log('curr schedule: ');
          //this.printArray(schedule);
          if (k === matchesIds.length - 1) {
            console.log("schedule after: " + schedule);
            return true;
          }
          // ans = this.isThereSchedule(matches, matchesIds, schedule, matchesIds[0]);
          isBraked = true;
          j++;
          matchesIds[k] = [startMatcheId, j];
          break;
          //matchesIds.unshift(startMatcheId);
          schedule[j] = [1];
        }
      }
      if (!isBraked) {
        if (k === 0) return false;
        schedule[matchesIds[k - 1][1] - 1] = [1]; // was schedule[matchesIds[startMatcheId][1]-1] = 1; why?
        matchesIds[k] = [startMatcheId, 0];
        k -= 2;
      }
    }
    return false;
  }

  rotateLeft(arr, numOfTimes, rowIndex) {
    for (let i = 0; i < numOfTimes; i++) {
      let length = arr[0].length;

      arr[0].push(arr[0].splice(rowIndex, 1)[0]);
      let temp = arr[0][length - 1];
      arr[0][length - 1] = arr[1][length - 1];
      arr[1][length - 1] = temp;

      arr[1].splice(rowIndex, 0, arr[1].pop());
      temp = arr[0][rowIndex];
      arr[0][rowIndex] = arr[1][rowIndex];
      arr[1][rowIndex] = temp;
    }
  }

  rotateRight(arr, rowIndex) {
    let length = arr[0].length;

    let temp = arr[0][rowIndex];
    arr[0][rowIndex] = arr[1][rowIndex];
    arr[1][rowIndex] = temp;

    arr[0].splice(rowIndex, 0, arr[0].pop());
    arr[1].push(arr[1].splice(rowIndex, 1)[0]);

    temp = arr[0][rowIndex];
    arr[0][rowIndex] = arr[1][length - 1];
    arr[1][length - 1] = temp;
  }
};
