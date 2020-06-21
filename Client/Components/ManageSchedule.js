// The old good one ManageSchedule

import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {Table, Row, Rows, Col} from 'react-native-table-component';
import WeekSelector from './WeekSelector';
import {Picker} from '@react-native-community/picker';
import {Header} from 'react-navigation-stack';
import {CustomPicker} from 'react-native-custom-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Feather';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/blue';
import AwesomeAlert from 'react-native-awesome-alerts';
import GLOBALS from '../Globals';

var borderWidth = 1;
var borderColor = 'black';

export default class ManageSchedule extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    let hour = 16;
    let nextHour = 17;
    let numOfDays = 6;
    let numOfHours = 8;
    this.initializeHoursData = this.initializeHoursData.bind(this);
    this.state = {
      tableHead: ['', 'Su', 'Mo', 'Tu', 'We', 'Th'],
      schedule: [],
      currWeek: 1,
      setOfDays: {
        days: [
          [1, 'Sunday'],
          [2, 'Monday'],
          [3, 'Tuesday'],
          [4, 'Wednesday'],
          [5, 'Thuesday'],
        ],
        selected: [1, 'Sunday'],
      },
      setOfHours: {
        hours: [
          [1, '16:00-17:00'],
          [2, '17:00-18:00'],
          [3, '18:00-19:00'],
          [4, '19:00-20:00'],
          [5, '20:00-21:00'],
          [6, '21:00-22:00'],
          [7, '22:00-23:00'],
          [8, '23:00-24:00'],
        ],
        selected: [1, '16:00-17:00'],
      },
      isHourDayModalVisible: false,
      isDeleteModalVisible: false,
      isPickRefereeModalVisible: false,
      isConstraintsModalVisible: false,
      isAddModalVisible: false,
      teamVsTeamId: null,
      isChangeIsOn: false,
      dayToBeChanged: 1,
      hourToBeChanged: 1,
      gamesToBeCompleted: [],
      gameToBeAdded: new Array(2).fill(0),
      isScheduleSet: 'notSet', // Can be - 'notSet/inProcess/set
      numOfHours: numOfHours,
      numOfDays: numOfDays,
      hours: this.initializeHoursData(numOfDays, numOfHours, hour, nextHour),
      showTeamsConstraints: false,
      thereIsReferee: false,
      currDate: null,
      dates: [
        '2020-05-09T21:00:00.000Z',
        '2020-05-23T21:00:00.000Z',
        '2020-05-30T21:00:00.000Z',
      ],
      dateIsOnChange: false,
      editGame: {
        day: false,
        hour: false,
        referee: false,
      },
      addGame: {
        game: false,
        day: false,
        hour: false,
        referee: false,
      },
      canPlayColor: GLOBALS.colors.Positive,
      canNotPlayColor: GLOBALS.colors.Negative,
      currTeam: null,
      alerts: {
        fieldsNotFullChange: {
          toShow: false,
          msg: '',
        },
        fieldsNotFullAdd: {
          toShow: false,
          msg: '',
        },
        serverError: {
          toShow: false,
          msg: '',
        },
        responseError: {
          toShow: false,
          msg: '',
        },
        actionAccepted: {
          toShow: false,
          msg: '',
        },
        wrongChoose: {
          toShow: false,
          msg: '',
        },
      },
    };
    this.load = this.load.bind(this);
    this.scheduling = this.scheduling.bind(this);
    this.createWeekGames = this.createWeekGames.bind(this);
    this.changeDayOrHour = this.changeDayOrHour.bind(this);
    this.deleteGame = this.deleteGame.bind(this);
    this.pickReferee = this.pickReferee.bind(this);
    this.getWeeksTitles = this.getWeeksTitles.bind(this);
    this.createDayHourModal = this.createDayHourModal.bind(this);
    this.createDeleteModal = this.createDeleteModal.bind(this);
    //this.createPickRefereeModal = this.createPickRefereeModal.bind(this);
    this.confirmOrCancelChange = this.confirmOrCancelChange.bind(this);
    //this.confirmOrCancelReferee = this.confirmOrCancelReferee.bind(this);
    this.createAddModal = this.createAddModal.bind(this);
    this.getScheduling = this.getScheduling.bind(this);
    this.sendChangeToServer = this.sendChangeToServer.bind(this);
    //this.sendUpdatedReferees = this.sendUpdatedReferees.bind(this);
    this.createTeamsConstraintsView = this.createTeamsConstraintsView.bind(
      this,
    );
    this.getTeamNames = this.getTeamNames.bind(this);
    this.setDate = this.setDate.bind(this);
    this.createWeekSelectos = this.createWeekSelector.bind(this);
    this.createDaysOptions = this.createDaysOptions.bind(this);
    this.createHoursOptions = this.createHoursOptions.bind(this);
    this.createRefereesOptions = this.createRefereesOptions.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.createTableHead = this.createTableHead.bind(this);
    this.createHourConstraintsButtons = this.createHourConstraintsButtons.bind(
      this,
    );
    this.createAllAlerts = this.createAllAlerts.bind(this);
    this.setAlertsState = this.setAlertsState.bind(this);
    this.addAlertToarray = this.addAlertToarray.bind(this);
    this.renderField = this.renderField.bind(this);
  }

  createAllAlerts() {
    const alerts = [];
    alerts.push(
      <AwesomeAlert
        key={'fieldsNotFull_change_manageSchedule'}
        show={this.state.alerts.fieldsNotFullChange.toShow}
        showProgress={false}
        title={'Error'}
        message={'You did not fill all the fields'}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Yes"
        confirmText="ok"
        confirmButtonColor="#8fbc8f"
        onConfirmPressed={() => {
          this.setState(prevState => {
            let alerts = Object.assign({}, prevState.alerts);
            alerts.fieldsNotFullChange = {toShow: false, msg: ''};
            return {alerts, isHourDayModalVisible: true};
          });
        }}
      />,
    );
    alerts.push(
      <AwesomeAlert
        key={'fieldsNotFull_add_manageSchedule'}
        show={this.state.alerts.fieldsNotFullAdd.toShow}
        showProgress={false}
        title={'Error'}
        message={'You did not fill all the fields'}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Yes"
        confirmText="ok"
        confirmButtonColor="#8fbc8f"
        onConfirmPressed={() => {
          this.setState(prevState => {
            let alerts = Object.assign({}, prevState.alerts);
            alerts.fieldsNotFullAdd = {toShow: false, msg: ''};
            return {alerts, isAddModalVisible: true};
          });
        }}
      />,
    );
    alerts.push(
      <AwesomeAlert
        show={this.state.alerts.wrongChoose.toShow}
        showProgress={false}
        title={'Error'}
        message={this.state.alerts.wrongChoose.msg}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Yes"
        confirmText="ok"
        confirmButtonColor="#8fbc8f"
        onConfirmPressed={() => {
          this.setState(prevState => {
            let alerts = Object.assign({}, prevState.alerts);
            alerts.wrongChoose = {toShow: false, msg: ''};
            return {alerts};
          });
        }}
      />,
    );
    this.addAlertToarray(alerts, 'wrongChoose', 'Error');
    this.addAlertToarray(alerts, 'actionAccepted', 'Confirm');
    this.addAlertToarray(alerts, 'responseError', 'Error');
    this.addAlertToarray(alerts, 'serverError', 'Error');
    return alerts;
  }

  setAlertsState(field, toShow, msg) {
    this.setState(prevState => {
      let alerts = Object.assign({}, prevState.alerts);
      alerts[field] = {toShow: toShow, msg: msg};
      return {alerts};
    });
  }

  addAlertToarray(alerts, field, title) {
    alerts.push(
      <AwesomeAlert
        key={field + '_' + title}
        show={this.state.alerts[field].toShow}
        showProgress={false}
        title={title}
        message={this.state.alerts[field].msg}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Yes"
        confirmText="ok"
        confirmButtonColor="#8fbc8f"
        onConfirmPressed={() => {
          this.setAlertsState(field, false, '');
        }}
      />,
    );

    return alerts;
  }

  initializeHoursData = (numOfDays, numOfHours, hour, nextHour) => {
    let data = [];
    for (let i = 0; i < numOfHours; i++) {
      data[i] = [];
      for (let j = 0; j < numOfDays; j++) {
        data[i][j] = j == 0 ? '' + hour + ':00 - ' + nextHour + ':00' : 1;
      }
      hour++;
      nextHour++;
    }
    return data;
  };

  async getScheduling() {
    try {
      let response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/?data=GetManagerSchedule',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'GetManagerSchedule',
            Authorization: await AsyncStorage.getItem('token'),
          },
        },
      );
      const json = await response.json();
      console.log('json.success: ' + json.success);
      if (json.success) {
        let referee =
          json.refereesConstraints.length === 0
            ? 'None'
            : json.refereesConstraints[0].user;

        if (!json.schedule) {
          this.setState({
            finishedLoad: true,
            teamsConstraints: json.teamsConstraints,
            refereesConstraints: json.refereesConstraints,
            referee: referee,
          });
          return;
        }
        this.setState({
          finishedLoad: true,
          isScheduleSet: 'set',
          schedule: json.schedule,
          gamesToBeCompleted: json.gamesToBeCompleted,
          teamsNumbers: json.teamsNumbers,
          teamsConstraints: json.teamsConstraints,
          refereesConstraints: json.refereesConstraints,
          refereesSchedule: json.refereesSchedule,
          referee: referee,
          weekDates: json.weekDates,
        });
      } else {
        console.log(json.error.msg);
        this.setState({finishedLoad: true, isScheduleSet: 'notSet'});
      }
    } catch (err) {
      console.error(err);
      this.setState({finishedLoad: true, isScheduleSet: 'notSet'});
    }
  }

  async scheduling() {
    try {
      let response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/?data=StartScheduling',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'StartScheduling',
            Authorization: await AsyncStorage.getItem('token'),
          },
        },
      );
      const json = await response.json();
      if (json.success) {
        await AsyncStorage.setItem('isSchedule', 'true');
        this.setState({
          data: json.pitchConstraints,
          isScheduleSet: 'set',
          schedule: json.schedule,
          teamsNumbers: json.teamsNumbers,
          teamsConstraints: json.teamsConstraints,
          refereesConstraints: json.refereesConstraints,
          refereesSchedule: json.refereesSchedule,
          weekDates: json.weekDates,
        });
      } else {
        console.log(json.error.msg);
        this.setState({isScheduleSet: 'notSet'});
      }
    } catch (err) {
      console.error(err);
      this.setState({isScheduleSet: 'notSet'});
    }
  }

  async componentDidMount() {
    this.load();
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      this.load,
    );
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  async load() {
    let isSchedule = await AsyncStorage.getItem('isSchedule');
    this.getScheduling();
  }

  changeDayOrHour(teamVsTeamId, dayToBeChanged, hourToBeChanged) {
    let isHourDayModalVisible = this.state.isHourDayModalVisible;
    this.setState({
      isHourDayModalVisible: !isHourDayModalVisible,
      teamVsTeamId: teamVsTeamId,
      dayToBeChanged: dayToBeChanged,
      hourToBeChanged: hourToBeChanged,
    });
  }

  getTeamNames(matchId) {
    let teamAIndex = this.state.teamsNumbers[matchId][0];
    let teamBIndex = this.state.teamsNumbers[matchId][1];
    let teamA = this.state.teamsConstraints[teamAIndex].teamName;
    let teamB = this.state.teamsConstraints[teamBIndex].teamName;
    return {teamA: teamA, teamB: teamB};
  }

  confirmOrCancelDelete(mode) {
    let changeDetails = {};
    if (mode === 1) {
      // To delete
      let day = this.state.dayToBeChanged;
      let hour = this.state.hourToBeChanged;
      let time =
        (day - 1) * this.state.teamsConstraints[1].constraints.length +
        (hour - 1);
      changeDetails.change = 'DeleteGame';
      changeDetails.day = this.state.setOfDays.days[day - 1][1];
      changeDetails.hour = this.state.setOfHours.hours[hour - 1][1];
      changeDetails.matchId = this.state.teamVsTeamId;

      for (
        let i = 1;
        i < this.state.schedule[this.state.currWeek - 1][time].length;
        i++
      ) {
        if (
          this.state.schedule[this.state.currWeek - 1][time][i] ===
          this.state.teamVsTeamId
        ) {
          this.state.schedule[this.state.currWeek - 1][time].splice(i, 1);
          if (this.state.schedule[this.state.currWeek - 1][time].length === 1)
            this.state.schedule[this.state.currWeek - 1][time] = [1];
        }
      }

      this.state.gamesToBeCompleted.push(this.state.teamVsTeamId);

      // Checking if referee to this game was scheduled
      if (
        this.state.refereesSchedule[this.state.currWeek - 1][time][
          this.state.teamVsTeamId
        ] !== undefined
      ) {
        changeDetails.referee = this.state.refereesSchedule[
          this.state.currWeek - 1
        ][time][this.state.teamVsTeamId].referee;
        delete this.state.refereesSchedule[this.state.currWeek - 1][time][
          this.state.teamVsTeamId
        ];
      }
      // Updating the server
      this.sendChangeToServer(this.state.schedule, changeDetails);
    }

    this.setState({isDeleteModalVisible: false});
  }

  confirmOrCancelChange(mode) {
    let newEditGame = {
      day: false,
      hour: false,
      referee: false,
    };
    if (
      (mode === 0 || mode === 1) &&
      (!this.state.editGame.day ||
        !this.state.editGame.hour ||
        !this.state.editGame.referee)
    ) {
      this.setState(prevState => {
        let alerts = Object.assign({}, prevState.alerts);
        alerts.fieldsNotFullChange = {
          toShow: true,
          msg: 'You did not fill all the fields',
        };
        return {alerts, isHourDayModalVisible: false};
      });
      //alert('You did not fill all the fields');
      return;
    }
    let oldDay = this.state.dayToBeChanged;
    let oldHour = this.state.hourToBeChanged;
    let oldTime =
      (oldDay - 1) * this.state.teamsConstraints[1].constraints.length +
      (oldHour - 1);

    let newDay = this.state.editGame.day.value;
    let newHour = this.state.editGame.hour.value;
    let newTime =
      newDay * this.state.teamsConstraints[1].constraints.length + newHour;

    let changeDetails = {};
    changeDetails.change = 'ChangeGame';
    changeDetails.day = newDay;
    changeDetails.hour = newHour;
    changeDetails.matchId = this.state.teamVsTeamId;
    changeDetails.exReferee = null;

    if (mode === 0) {
      if (this.state.schedule[this.state.currWeek - 1][newTime][0] === 0) {
        this.setState({isChangeIsOn: true});
      } else {
        this.state.schedule[this.state.currWeek - 1][newTime] = [
          0,
          this.state.teamVsTeamId,
        ];
        for (
          let i = 1;
          i < this.state.schedule[this.state.currWeek - 1][oldTime].length;
          i++
        ) {
          if (
            this.state.schedule[this.state.currWeek - 1][oldTime][i] ===
            this.state.teamVsTeamId
          ) {
            this.state.schedule[this.state.currWeek - 1][oldTime].splice(i, 1);
            if (
              this.state.schedule[this.state.currWeek - 1][oldTime].length === 1
            )
              this.state.schedule[this.state.currWeek - 1][oldTime] = [1];
          }
        }

        // Cheking if was a referee to that game, and delete him if was
        if (
          this.state.refereesSchedule[this.state.currWeek - 1][oldTime][
            this.state.teamVsTeamId
          ] !== undefined
        ) {
          changeDetails.exReferee = this.state.refereesSchedule[
            this.state.currWeek - 1
          ][oldTime][this.state.teamVsTeamId].referee;
          delete this.state.refereesSchedule[this.state.currWeek - 1][oldTime][
            this.state.teamVsTeamId
          ];
        }
        changeDetails.newReferee = this.state.editGame.referee.label;

        let refereesWeekSchedule = this.state.refereesSchedule[
          this.state.currWeek - 1
        ];
        refereesWeekSchedule[newTime][this.state.teamVsTeamId] = {
          referee: this.state.editGame.referee.label,
        };
        // Updating the server
        this.sendChangeToServer(this.state.schedule, changeDetails);
        this.setState({
          editGame: newEditGame,
          isHourDayModalVisible: false,
          isChangeIsOn: false,
        });
      }
    } else if (mode === 1) {
      let schedule = this.state.schedule;
      schedule[this.state.currWeek - 1][newTime].push(this.state.teamVsTeamId);

      for (
        let i = 1;
        i < schedule[this.state.currWeek - 1][oldTime].length;
        i++
      ) {
        if (
          schedule[this.state.currWeek - 1][oldTime][i] ===
          this.state.teamVsTeamId
        ) {
          schedule[this.state.currWeek - 1][oldTime].splice(i, 1);
          if (schedule[this.state.currWeek - 1][oldTime].length === 1)
            schedule[this.state.currWeek - 1][oldTime] = [1];
          break;
        }
      }

      // Cheking if was a referee to that game, and delete him if was
      if (
        this.state.refereesSchedule[this.state.currWeek - 1][oldTime][
          this.state.teamVsTeamId
        ] !== undefined
      ) {
        changeDetails.exReferee = this.state.refereesSchedule[
          this.state.currWeek - 1
        ][oldTime][this.state.teamVsTeamId].referee;
        delete this.state.refereesSchedule[this.state.currWeek - 1][oldTime][
          this.state.teamVsTeamId
        ];
      }
      let refereesWeekSchedule = this.state.refereesSchedule[
        this.state.currWeek - 1
      ];
      changeDetails.newReferee = this.state.editGame.referee.label;
      refereesWeekSchedule[newTime][this.state.teamVsTeamId] = {
        referee: this.state.editGame.referee.label,
      };

      // Updating the server
      this.sendChangeToServer(schedule, changeDetails);
      this.setState({
        editGame: newEditGame,
        isHourDayModalVisible: false,
        isChangeIsOn: false,
        schedule: schedule,
      });
    } else if (mode === 2) {
      this.setState({
        editGame: newEditGame,
        isChangeIsOn: false,
        isHourDayModalVisible: false,
      });
    }
  }

  // async sendUpdatedReferees(changeDetails) { //gggggggggggggg
  //     try {
  //         let response = await fetch(
  //           'http://' +
  //             this.props.navigation.getParam('IP') +
  //             ':' +
  //             this.props.navigation.getParam('PORT') +
  //             '/',
  //           {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //               'Football-Request': 'RefereesSchedule',
  //               'Authorization': await AsyncStorage.getItem('token'),
  //             },
  //             body: JSON.stringify({
  //                 refereesSchedule: this.state.refereesSchedule,
  //                 changeDetails: changeDetails,
  //             }),
  //           },
  //         );
  //         const json = await response.json();
  //         if (json.success) {
  //             console.log('action: RefereesSchedule was updated in the server');
  //         }
  //         else
  //             alert(json.error.msg)
  //       } catch (err) {
  //         console.error(err);
  //       }
  // }

  // confirmOrCancelReferee(mode, changeDetails) {
  //     if (mode === 3) {
  //         this.setState({ isPickRefereeModalVisible: false });
  //         return;
  //     }

  //     if (!changeDetails.canBeRefThatTime)
  //         return;

  //     let teamNames = this.getTeamNames(this.state.teamVsTeamId);
  //     console.log('teamNames.teamA: ' + teamNames.teamA);
  //     console.log('teamNames.teamB: ' + teamNames.teamB);
  //     let day =  changeDetails.day;
  //     let hour = changeDetails.hour;
  //     let matchId = changeDetails.matchId;
  //     console.log('iiiiiiiiiiiiii1');
  //     let time = ((day-1)*this.state.teamsConstraints[1].constraints.length)+(hour-1);
  //     let week = this.state.currWeek;
  //     console.log('time: ' + time);
  //     let refereesWeekSchedule = this.state.refereesSchedule[week-1];
  //     changeDetails.day = this.state.setOfDays.days[day-1][1];
  //     changeDetails.hour = this.state.setOfHours.hours[hour-1][1];
  //     changeDetails.teamA = teamNames.teamA;
  //     changeDetails.teamB = teamNames.teamB;
  //     if (mode === 1) { // Add
  //         console.log('refereesWeekSchedule[time][matchId]: ' + refereesWeekSchedule[time][matchId]);
  //         refereesWeekSchedule[time][matchId] = { referee: changeDetails.referee };
  //         console.log('refereesWeekSchedule[' + time + ']: ' + refereesWeekSchedule[time]);
  //         this.sendUpdatedReferees(changeDetails);
  //     }
  //     else if (mode === 2) { // Change referees
  //         changeDetails.exReferee = refereesWeekSchedule[time][matchId].referee;
  //         refereesWeekSchedule[time][matchId] = { referee: changeDetails.referee };
  //         console.log('ex referee: ' + changeDetails.exReferee);
  //         console.log('new referee: ' + changeDetails.referee);
  //         this.sendUpdatedReferees(changeDetails);
  //     }

  //     this.setState({ isPickRefereeModalVisible: false });
  // }

  createRefereesOptions(gameState) {
    let referees = [];
    // let day = gameState.day? gameState.day.value : this.state.dayToBeChanged;
    // let hour = gameState.hour? gameState.hour.value : this.state.hourToBeChanged;

    // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    // console.log('day: ' + day)

    for (let i = 0; i < this.state.refereesConstraints.length; i++) {
      let userReferee = this.state.refereesConstraints[i].user;
      let day = gameState.day
        ? gameState.day.value + 1
        : this.state.dayToBeChanged;
      let hour = gameState.hour
        ? gameState.hour.value + 1
        : this.state.hourToBeChanged;
      let time =
        (day - 1) * this.state.teamsConstraints[1].constraints.length +
        (hour - 1);
      let canBeRefThatTime = this.state.refereesConstraints[i].constraints[
        hour - 1
      ][day];
      let backgroundColor = canBeRefThatTime
        ? GLOBALS.colors.Positive
        : GLOBALS.colors.Negative;
      // let changeDetails = {
      //     change: (this.state.thereIsReferee)? 'ChangeReferees' : 'AddRefereeToGame',
      //     matchId: this.state.teamVsTeamId,
      //     week: this.state.currWeek,
      //     day: day,
      //     hour: hour,
      //     referee: userReferee,
      //     canBeRefThatTime: canBeRefThatTime,
      // }
      referees.push({
        value: i,
        label: userReferee,
        color: backgroundColor,
      });
    }

    return referees;
  }

  // createPickRefereeModal() {
  //     let referees = [];
  //     for (let i=0; i<this.state.refereesConstraints.length; i++) {
  //         let userReferee = this.state.refereesConstraints[i].user;

  //         let day =  this.state.dayToBeChanged;
  //         let hour = this.state.hourToBeChanged;
  //         let time = ((day-1)*this.state.teamsConstraints[1].constraints.length)+(hour-1);
  //         console.log('dayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy: ' + day);
  //         console.log('hour: ' + hour);
  //         console.log('time: ' + time);
  //         console.log('week: ' + this.state.currWeek);
  //         console.log('matchId: ' + this.state.teamVsTeamId);

  //         console.log('this.state.refereesConstraints[i].constraints: ' + this.state.refereesConstraints[i].constraints);
  //         console.log('this.state.refereesConstraints[i].constraints[hour][day]: ' + this.state.refereesConstraints[i].constraints[hour-1][day]);

  //         let canBeRefThatTime = this.state.refereesConstraints[i].constraints[hour-1][day];
  //         let backgroundColor = (canBeRefThatTime)? GLOBALS.colors.Positive : GLOBALS.colors.Negative;
  //         let changeDetails = {
  //             change: (this.state.thereIsReferee)? 'ChangeReferees' : 'AddRefereeToGame',
  //             matchId: this.state.teamVsTeamId,
  //             week: this.state.currWeek,
  //             day: day,
  //             hour: hour,
  //             referee: userReferee,
  //             canBeRefThatTime: canBeRefThatTime,
  //         }

  //         referees.push(
  //             <TouchableOpacity key={'pick_referee_' + i} style={{ marginTop: 5, justifyContent: 'center', backgroundColor: backgroundColor, height: GLOBALS.windowWidthSize/10, width: '60%' }} onPress={() =>this.confirmOrCancelReferee((this.state.thereIsReferee)? 2 : 1, changeDetails)}>
  //                 <Text style={{textAlign: 'center', color: '#000000'}}>{userReferee}</Text>
  //             </TouchableOpacity>
  //             //<Picker.Item key={'pick_referee_' + i} label={userReferee} value={userReferee} />
  //         )
  //     }
  //     return (
  //         <Modal
  //                 animationType="slide"
  //                 transparent={true}
  //                 visible={this.state.isPickRefereeModalVisible}
  //                 onRequestClose={() => {
  //                 Alert.alert("Modal has been closed.");
  //                 }}
  //         >
  //                 <View style={{ alignItems: 'center', minHeight: '40%', maxHeight: '80%', width: '100%', backgroundColor: '#14B1F8' }}>
  //                     <View style={{ alignItems: 'center', height: '90%', width: '60%' }}>
  //                         <Text style={{ fontSize: 20, height: GLOBALS.windowWidthSize/10 }}>Pick Referee</Text>
  //                         <View style={{ width: '100%', flexDirection: 'row' }}>
  //                             <Text style={{ backgroundColor: GLOBALS.colors.Positive, flex: GLOBALS.windowWidthSize/10, height: GLOBALS.windowWidthSize/20 }}></Text>
  //                             <Text style={{ height: GLOBALS.windowWidthSize/5 }}> Can Judge </Text>
  //                             <Text style={{ backgroundColor: GLOBALS.colors.Negative, flex: GLOBALS.windowWidthSize/10, height: GLOBALS.windowWidthSize/20 }}></Text>
  //                             <Text style={{ height: GLOBALS.windowWidthSize/5 }}> Can Not Judge </Text>
  //                         </View>

  //                         {/* <Picker
  //                                 selectedValue={this.state.referee}
  //                                 style={{ width: '60%', height: '50%' }}
  //                                 onValueChange={(itemValue, itemIndex) => {
  //                                     let referee = { referee: this.state.refereesConstraints[itemIndex]};
  //                                     this.setState({referee: referee })}}
  //                         >
  //                                 {referees}
  //                         </Picker> */}
  //                         {referees}
  //                     </View>
  //                     <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: GLOBALS.colors.Negative, borderRadius: 25, height: '10%', width: '40%'  }} onPress={() =>this.confirmOrCancelReferee(3)}>
  //                             <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Close</Text>
  //                     </TouchableOpacity>
  //                 </View>
  //         </Modal>
  //     )
  // }

  createDeleteModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isDeleteModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View
          style={{
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: '#ECE7E4',
          }}>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <Text
            style={{
              width: '90%',
              height: GLOBALS.windowHeightSize * 0.85,
              fontSize: 20,
            }}>
            Are you sure you want to delete that game?
          </Text>
          <View
            style={{
              height: GLOBALS.windowHeightSize * 0.1,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View style={{flex: 1.5}} />
            <AwesomeButtonCartman
              onPress={() => this.confirmOrCancelDelete(1)}
              type="anchor"
              stretch={true}
              textSize={18}
              backgroundColor={GLOBALS.colors.Positive}
              style={{flex: 2}}
              borderWidth={0.5}
              borderRadius={10}
              raiseLevel={4}>
              Yes
            </AwesomeButtonCartman>
            <View style={{flex: 0.1}} />
            <AwesomeButtonCartman
              onPress={() => this.confirmOrCancelDelete(2)}
              type="anchor"
              stretch={true}
              textSize={18}
              backgroundColor={GLOBALS.colors.Negative}
              style={{flex: 2}}
              borderWidth={0.5}
              borderRadius={10}
              raiseLevel={4}>
              No
            </AwesomeButtonCartman>
            <View style={{flex: 1.5}} />
          </View>
        </View>
      </Modal>
    );
  }

  createDaysOptions(gameState) {
    let matchId = this.state.teamVsTeamId ? this.state.teamVsTeamId : 1;
    let teamA = this.state.teamsNumbers[matchId][0];
    let teamB = this.state.teamsNumbers[matchId][1];
    // let hour = gameState.hour? gameState.hour.value : this.state.hourToBeChanged;

    // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    // console.log('matchId: ' + matchId)
    // console.log('teamA: ' + teamA)
    // console.log('teamB: ' + teamB)
    // console.log('hour: ' + hour)

    let daysPickers = [];
    for (let i = 0; i < this.state.setOfDays.days.length; i++) {
      let day = '' + this.state.setOfDays.days[i][1];
      let canPlayThatDay = false;
      for (let hour = 0; hour < this.state.setOfHours.hours.length; hour++) {
        canPlayThatDay =
          this.state.teamsConstraints[teamA].constraints[hour][i] &&
          this.state.teamsConstraints[teamB].constraints[hour][i];
        if (canPlayThatDay) break;
      }
      daysPickers.push({
        value: i,
        label: day,
        color: canPlayThatDay
          ? GLOBALS.colors.Positive
          : GLOBALS.colors.Negative,
      });
    }

    return daysPickers;
  }

  createHoursOptions(gameState) {
    let matchId = this.state.teamVsTeamId ? this.state.teamVsTeamId : 1;
    let teamA = this.state.teamsNumbers[matchId][0];
    let teamB = this.state.teamsNumbers[matchId][1];
    let day = gameState.day ? gameState.day.value : this.state.dayToBeChanged;
    // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    // console.log('day: ' + day)

    let hoursPickers = [];
    for (let i = 0; i < this.state.setOfHours.hours.length; i++) {
      let canPlayThathour =
        this.state.teamsConstraints[teamA].constraints[i][day] &&
        this.state.teamsConstraints[teamB].constraints[i][day];
      let hour = '' + this.state.setOfHours.hours[i][1];
      hoursPickers.push({
        value: i,
        label: hour,
        color: canPlayThathour
          ? GLOBALS.colors.Positive
          : GLOBALS.colors.Negative,
      });
    }

    return hoursPickers;
  }

  createDayHourModal() {
    let daysOptions = this.createDaysOptions(this.state.editGame);
    let hoursOptions = this.createHoursOptions(this.state.editGame);
    let refereesOptions = this.createRefereesOptions(this.state.editGame);
    let dayOptionValue = this.state.editGame.day || undefined;
    let hourOptionValue = this.state.editGame.hour || undefined;
    let refereeOptionValue = this.state.editGame.referee || undefined;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isHourDayModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        {!this.state.isChangeIsOn ? (
          <View
            style={{
              alignItems: 'center',
              height: '100%',
              width: '100%',
              backgroundColor: '#ECE7E4',
            }}>
            <View
              style={{
                height: GLOBALS.windowHeightSize * 0.1,
                width: '60%',
                alignItems: 'center',
              }}
            />
            <View
              style={{height: GLOBALS.windowHeightSize * 0.1, width: '60%'}}>
              <CustomPicker
                value={dayOptionValue}
                fieldTemplateProps={{
                  defaultText: 'Select Day',
                  textStyle: {
                    color: 'white',
                    fontSize: 18,
                    fontFamily: 'sans',
                    // fontWeight: 'bold',
                    opacity: 3,
                    textAlign: 'center',
                    //width: '100%',
                    textAlignVertical: 'center',
                  },
                }}
                style={{
                  borderWidth: 0,
                  height: GLOBALS.windowHeightSize * 0.1,
                  backgroundColor: '#0c4271',
                  borderRadius: 7.5,
                  color: 'black',
                  fontSize: 15,
                  fontFamily: 'sans',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                }}
                options={daysOptions}
                getLabel={item => item.label}
                optionTemplate={this.renderOption}
                headerTemplate={this.renderHeader}
                onValueChange={option => {
                  let editGame = this.state.editGame;
                  editGame.hour = false;
                  editGame.referee = false;
                  if (!option) {
                    editGame.day = false;
                    this.setState({editGame: editGame});
                    return;
                  } else editGame.day = option;
                  let setOfDays = {
                    days: this.state.setOfDays.days,
                    selected: [option.value + 1, option.label],
                  };
                  this.setState({editGame: editGame, setOfDays: setOfDays});
                }}
              />
            </View>
            <View
              style={{
                height: GLOBALS.windowHeightSize * 0.05,
                width: '60%',
                alignItems: 'center',
              }}
            />
            <View
              style={{height: GLOBALS.windowHeightSize * 0.1, width: '60%'}}>
              <CustomPicker
                value={hourOptionValue}
                fieldTemplateProps={{
                  defaultText: 'Select Hour',
                  textStyle: {
                    color: 'white',
                    fontSize: 18,
                    fontFamily: 'sans',
                    // fontWeight: 'bold',
                    opacity: 3,
                    textAlign: 'center',
                    // width: '100%',
                    textAlignVertical: 'center',
                  },
                }}
                style={{
                  borderWidth: 0,
                  height: GLOBALS.windowHeightSize * 0.1,
                  backgroundColor: '#0c4271',
                  borderRadius: 7.5,
                  color: 'black',
                  fontSize: 15,
                  fontFamily: 'sans',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                }}
                options={hoursOptions}
                getLabel={item => item.label}
                optionTemplate={this.renderOption}
                headerTemplate={this.renderHeader}
                onValueChange={option => {
                  let editGame = this.state.editGame;
                  editGame.referee = false;
                  if (!option) {
                    editGame.hour = false;
                    this.setState({editGame: editGame});
                    return;
                  } else editGame.hour = option;
                  let setOfHours = {
                    hours: this.state.setOfHours.hours,
                    selected: [option.value + 1, option.label],
                  };
                  this.setState({editGame: editGame, setOfHours: setOfHours});
                }}
              />
            </View>
            <View
              style={{
                height: GLOBALS.windowHeightSize * 0.05,
                width: '60%',
                alignItems: 'center',
              }}
            />
            <View
              style={{height: GLOBALS.windowHeightSize * 0.1, width: '60%'}}>
              <CustomPicker
                value={refereeOptionValue}
                fieldTemplateProps={{
                  defaultText: 'Select Referee',
                  textStyle: {
                    color: 'white',
                    fontSize: 18,
                    fontFamily: 'sans',
                    // fontWeight: 'bold',
                    opacity: 3,
                    textAlign: 'center',
                    // width: '100%',
                    textAlignVertical: 'center',
                  },
                }}
                style={{
                  borderWidth: 0,
                  height: GLOBALS.windowHeightSize * 0.1,
                  backgroundColor: '#0c4271',
                  borderRadius: 7.5,
                  color: 'black',
                  fontSize: 15,
                  fontFamily: 'sans',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                }}
                options={refereesOptions}
                getLabel={item => item.label}
                optionTemplate={this.renderOption}
                headerTemplate={this.renderHeader}
                onValueChange={option => {
                  let editGame = this.state.editGame;
                  if (!option) {
                    editGame.referee = false;
                    this.setState({editGame: editGame});
                    return;
                  } else editGame.referee = option;

                  this.setState({editGame: editGame});
                  // this.setState({setOfHours: setOfHours })}}/> should changeeeee
                }}
              />
            </View>
            <View
              style={{
                height: GLOBALS.windowHeightSize * 0.4,
                width: '60%',
                alignItems: 'center',
              }}
            />
            <View
              style={{
                height: GLOBALS.windowHeightSize * 0.1,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{flex: 1.5}} />
              <AwesomeButtonCartman
                onPress={() => this.confirmOrCancelChange(0)}
                type="anchor"
                stretch={true}
                textSize={18}
                backgroundColor={GLOBALS.colors.Neutral}
                style={{flex: 2}}
                borderWidth={0.5}
                borderRadius={10}
                raiseLevel={4}>
                Change
              </AwesomeButtonCartman>
              <View style={{flex: 0.1}} />
              <AwesomeButtonCartman
                onPress={() => this.confirmOrCancelChange(2)}
                type="anchor"
                stretch={true}
                textSize={18}
                backgroundColor={GLOBALS.colors.Negative}
                style={{flex: 2}}
                borderWidth={0.5}
                borderRadius={10}
                raiseLevel={4}>
                Close
              </AwesomeButtonCartman>
              <View style={{flex: 1.5}} />
            </View>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              height: '100%',
              width: '100%',
              backgroundColor: '#ECE7E4',
            }}>
            <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
            <Text
              style={{
                color: '#F81422',
                fontSize: 20,
                height: GLOBALS.windowHeightSize * 0.85,
                width: '90%',
              }}>
              Warning: There are already teams which play at that time, are you
              sure you want to change?
            </Text>
            <View
              style={{
                height: GLOBALS.windowHeightSize * 0.1,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{flex: 1.5}} />
              <AwesomeButtonCartman
                onPress={() => this.confirmOrCancelChange(1)}
                type="anchor"
                stretch={true}
                textSize={18}
                backgroundColor={GLOBALS.colors.Positive}
                style={{flex: 2}}
                borderWidth={0.5}
                borderRadius={10}
                raiseLevel={4}>
                Yes
              </AwesomeButtonCartman>
              <View style={{flex: 0.1}} />
              <AwesomeButtonCartman
                onPress={() => this.confirmOrCancelChange(2)}
                type="anchor"
                stretch={true}
                textSize={18}
                backgroundColor={GLOBALS.colors.Negative}
                style={{flex: 2}}
                borderWidth={0.5}
                borderRadius={10}
                raiseLevel={4}>
                No
              </AwesomeButtonCartman>
              <View style={{flex: 1.5}} />
            </View>
            {/* <TouchableOpacity style={{ backgroundColor: '#1BA446', borderRadius: 25, flex: 1, width: '60%' }} onPress={() => this.confirmOrCancelChange(1)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#D91D1D', borderRadius: 25, flex: 1, width: '60%' }} onPress={() => this.confirmOrCancelChange(2)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>No</Text>
                        </TouchableOpacity> */}
          </View>
        )}
      </Modal>
    );
  }

  pickReferee(dayToBeChanged, hourToBeChanged, teamVsTeamId, thereIsReferee) {
    this.setState({
      isPickRefereeModalVisible: true,
      dayToBeChanged: dayToBeChanged,
      hourToBeChanged: hourToBeChanged,
      teamVsTeamId: teamVsTeamId,
      thereIsReferee: thereIsReferee,
    });
  }

  deleteGame(teamVsTeamId, dayToBeDeleted, hourToBeDeleted) {
    let isDeleteModalVisible = this.state.isDeleteModalVisible;
    this.setState({
      isDeleteModalVisible: !isDeleteModalVisible,
      teamVsTeamId: teamVsTeamId,
      dayToBeChanged: dayToBeDeleted,
      hourToBeChanged: hourToBeDeleted,
    });
  }

  createWeekGames() {
    let week = this.state.schedule[this.state.currWeek - 1];
    let games = [];
    games.push(
      <View key={'create_modals'}>
        {this.createDayHourModal()}
        {this.createDeleteModal()}
        {/* {this.createPickRefereeModal()} */}
        {this.createAddModal()}
        {/* {this.createTeamsConstraintsView()} */}
      </View>,
    );
    for (let i = 0; i < week.length; i++) {
      if (week[i][0] === 0) {
        for (let j = 1; j < week[i].length; j++) {
          let teamA = this.state.teamsConstraints[
            this.state.teamsNumbers[week[i][j]][0]
          ].teamName;
          let teamB = this.state.teamsConstraints[
            this.state.teamsNumbers[week[i][j]][1]
          ].teamName;
          let game = '' + teamA + ' vs ' + teamB;
          let day = this.state.setOfDays.days[
            Math.ceil(
              (i + 1) / this.state.teamsConstraints[1].constraints.length,
            ) - 1
          ][1];
          let dayIndex = this.state.setOfDays.days[
            Math.ceil(
              (i + 1) / this.state.teamsConstraints[1].constraints.length,
            ) - 1
          ][0];
          let temp =
            (i + 1) % this.state.teamsConstraints[1].constraints.length;
          let hour =
            temp === 0
              ? this.state.setOfHours.hours[
                  this.state.teamsConstraints[1].constraints.length - 1
                ][1]
              : this.state.setOfHours.hours[temp - 1][1];
          let time = day + ', ' + hour.substring(0, 5);
          let hourIndex =
            temp === 0
              ? this.state.setOfHours.hours[
                  this.state.teamsConstraints[1].constraints.length - 1
                ][0]
              : this.state.setOfHours.hours[temp - 1][0];
          let matchId = week[i][j];
          let thereIsReferee =
            this.state.refereesSchedule[this.state.currWeek - 1][i][matchId] !==
            undefined
              ? true
              : false;
          let referee = thereIsReferee
            ? this.state.refereesSchedule[this.state.currWeek - 1][i][matchId]
                .referee
            : null;
          games.push(
            <View key={'week_' + i + '_game_' + j} style={styles.gameContainer}>
              <View style={styles.gameDetailsContainer}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{flex: 1, fontWeight: 'bold', textAlign: 'center'}}>
                    {teamA}
                  </Text>
                  <Text style={{flex: 1, fontWeight: 'bold'}}>{teamB}</Text>
                  {/* <Text style={{ fontWeight: 'bold' }}>{teamA} vs {teamB}</Text> */}
                </View>
                <View style={styles.gameLine}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      height: '100%',
                    }}>
                    {time}
                  </Text>
                </View>
                <View style={styles.gameLine}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      height: '100%',
                    }}>
                    {thereIsReferee ? referee : 'Not Set Yet'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  flex: 1.4,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Icon.Button
                  color={GLOBALS.colors.Neutral}
                  backgroundColor="#ECE7E4"
                  name="edit"
                  onPress={() =>
                    this.changeDayOrHour(week[i][j], dayIndex, hourIndex)
                  }
                  solid
                />
                <Icon2.Button
                  name="trash-o"
                  backgroundColor="#ECE7E4"
                  color={GLOBALS.colors.Negative}
                  onPress={() =>
                    this.deleteGame(week[i][j], dayIndex, hourIndex)
                  }
                  solid
                />
              </View>
            </View>,
          );
          games.push(
            <View style={{height: GLOBALS.windowHeightSize * 0.01}} />,
          );
        }
      }
    }
    games.push(<View style={{height: GLOBALS.windowHeightSize * 0.03}} />);
    games.push(
      <View
        style={{
          height: GLOBALS.windowHeightSize * 0.1,
          width: '100%',
          alignItems: 'center',
        }}>
        <Icon3.Button
          color="white"
          backgroundColor={GLOBALS.colors.Positive}
          name="add"
          onPress={() => this.addGame()}
          iconStyle={{marginRight: 0, marginLeft: 0}}
          size={25}
          solid
        />
      </View>,
    );

    return games;
  }

  addGame() {
    this.setState({isAddModalVisible: true});
  }

  confirmOrCancelAdd(mode) {
    //kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    let newAddGame = {
      game: false,
      day: false,
      hour: false,
      referee: false,
    };

    if (
      (mode === 1 || mode === 3) &&
      (!this.state.addGame.game ||
        !this.state.addGame.day ||
        !this.state.addGame.hour ||
        !this.state.addGame.referee)
    ) {
      this.setState(prevState => {
        let alerts = Object.assign({}, prevState.alerts);
        alerts.fieldsNotFullAdd = {
          toShow: true,
          msg: 'You did not fill all the fields',
        };
        return {alerts, isAddModalVisible: false};
      });
      //alert('You did not fill all the fields');
      return;
    }

    let newDay = this.state.setOfDays.selected[0];
    let newHour = this.state.setOfHours.selected[0];
    let newTime =
      (newDay - 1) * this.state.teamsConstraints[1].constraints.length +
      (newHour - 1);

    // console.log('newDay: ' + newDay);
    // console.log('newHour: ' + newHour);
    // console.log('newTime: ' + newTime);
    // console.log('newDay: ' + this.state.setOfDays.selected[1]);
    // console.log('newHour: ' + this.state.setOfHours.selected[1]);

    if (mode === 1) {
      // Do some add work here
      let matchToAdd = this.state.addGame.game.value;
      if (this.state.schedule[this.state.currWeek - 1][newTime][0] === 0)
        this.setState({isChangeIsOn: true});
      else {
        let schedule = this.state.schedule;
        schedule[this.state.currWeek - 1][newTime] = [0, matchToAdd];
        for (
          let game = 0;
          game < this.state.gamesToBeCompleted.length;
          game++
        ) {
          if (
            this.state.gamesToBeCompleted[game] ===
            this.state.addGame.game.value
          ) {
            this.state.gamesToBeCompleted.splice(game, 1);
            break;
          }
        }

        console.log('matchToAdd: ' + matchToAdd);
        let changeDetails = {
          change: 'AddGame',
          matchId: matchToAdd,
          week: this.state.currWeek,
          day: this.state.setOfDays.selected[1],
          hour: this.state.setOfHours.selected[1],
          exReferee: null,
        };

        // Setting the referee details
        changeDetails.newReferee = this.state.addGame.referee.label;
        let refereesWeekSchedule = this.state.refereesSchedule[
          this.state.currWeek - 1
        ];
        refereesWeekSchedule[newTime][matchToAdd] = {
          referee: this.state.addGame.referee.label,
        };

        //updating the server
        this.sendChangeToServer(schedule, changeDetails);
        this.setState({
          addGame: newAddGame,
          isAddModalVisible: false,
          isChangeIsOn: false,
          gameToBeAdded: [0, 0],
        });
      }
    } else if (mode === 2)
      this.setState({
        addGame: newAddGame,
        isAddModalVisible: false,
        gameToBeAdded: [0, 0],
      });
    else if (mode === 3) {
      // To add
      let schedule = this.state.schedule;
      schedule[this.state.currWeek - 1][newTime].push(
        this.state.gameToBeAdded[1],
      );
      for (let game = 0; game < this.state.gamesToBeCompleted.length; game++) {
        if (
          this.state.gamesToBeCompleted[game] === this.state.addGame.game.value
        ) {
          this.state.gamesToBeCompleted.splice(game, 1);
          break;
        }
      }
      //this.state.gamesToBeCompleted.splice(0, 1);
      let changeDetails = {
        change: 'AddGame',
        matchId: this.state.addGame.game.value,
        week: this.state.currWeek,
        day: this.state.setOfDays.selected[1],
        hour: this.state.setOfHours.selected[1],
        exReferee: null,
      };
      // Setting the referee details
      changeDetails.newReferee = this.state.addGame.referee.label;
      let refereesWeekSchedule = this.state.refereesSchedule[
        this.state.currWeek - 1
      ];
      refereesWeekSchedule[newTime][this.state.addGame.game.value] = {
        referee: this.state.addGame.referee.label,
      };

      //updating the server
      this.sendChangeToServer(schedule, changeDetails);
      this.setState({
        addGame: newAddGame,
        isAddModalVisible: false,
        isChangeIsOn: false,
        gameToBeAdded: [0, 0],
      });
    } else if (mode === 4)
      // Not to add
      this.setState({isAddModalVisible: true, isChangeIsOn: false});
  }

  async sendChangeToServer(newSchedule, changeDetails) {
    try {
      let response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': changeDetails.change,
            Authorization: await AsyncStorage.getItem('token'),
          },
          body: JSON.stringify({
            schedule: newSchedule,
            refereesSchedule: this.state.refereesSchedule,
            refereesConstraints: this.state.refereesConstraints,
            gamesToBeCompleted: this.state.gamesToBeCompleted,
            teamsNumbers: this.state.teamsNumbers,
            teamsConstraints: this.state.teamsConstraints,
            changeDetails: changeDetails,
            weekDates: this.state.weekDates,
          }),
        },
      );
      const json = await response.json();
      if (json.success) {
        console.log(
          'action: ' + changeDetails.change + ' was updated in the server',
        );
        this.setAlertsState(
          'actionAccepted',
          true,
          'action: ' + changeDetails.change + ' was updated in the server',
        );
        //alert('action: ' + changeDetails.change + ' was updated in the server')
      } else this.setAlertsState('responseError', true, json.error.msg);
      //alert(json.error.msg)
    } catch (err) {
      console.error(err);
      this.setAlertsState('serverError', true, err);
    }
  }

  createAddModal() {
    let games = [];
    for (let i = 0; i < this.state.gamesToBeCompleted.length; i++) {
      let teamANumber = this.state.teamsNumbers[
        this.state.gamesToBeCompleted[i]
      ][0];
      let teamBNumber = this.state.teamsNumbers[
        this.state.gamesToBeCompleted[i]
      ][1];
      let currGame =
        '' +
        this.state.teamsConstraints[teamANumber].teamName +
        ' vs ' +
        this.state.teamsConstraints[teamBNumber].teamName;
      // games.push(
      //     <Picker.Item key={'add_picker_game_' + i} label={currGame} value={currGame} />
      // )
      console.log(
        'currGame: ' +
          currGame +
          ', this.state.gamesToBeCompleted[i]: ' +
          this.state.gamesToBeCompleted[i],
      );
      games.push({
        value: this.state.gamesToBeCompleted[i],
        label: currGame,
        color: 'white',
      });
    }
    let daysOptions = this.createDaysOptions(this.state.addGame);
    let hoursOptions = this.createHoursOptions(this.state.addGame);
    let refereesOptions = this.createRefereesOptions(this.state.addGame);
    let gameOptionValue = this.state.addGame.game || undefined;
    let dayOptionValue = this.state.addGame.day || undefined;
    let hourOptionValue = this.state.addGame.hour || undefined;
    let refereeOptionValue = this.state.addGame.referee || undefined;
    // let daysPickers = [];
    // for (let i=0; i<this.state.setOfDays.days.length; i++) {
    //     let day = '' + this.state.setOfDays.days[i][1];
    //     daysPickers.push(
    //         <Picker.Item key={'add_picker_day_' + i} label={day} value={day} />
    //     )
    // }

    // let hoursPickers = [];
    // for (let i=0; i<this.state.setOfHours.hours.length; i++) {
    //     let hour = '' + this.state.setOfHours.hours[i][1];
    //     hoursPickers.push(
    //         <Picker.Item key={'add_picker_hour_' + i} label={hour} value={hour} />
    //     )
    // }

    // let gameToBeAdded = [...this.state.gameToBeAdded];

    // if (this.state.gameToBeAdded[0] === 0 && this.state.gamesToBeCompleted.length !== 0) {
    //     let teamA = this.state.teamsNumbers[this.state.gamesToBeCompleted[0]][0];
    //     let teamB = this.state.teamsNumbers[this.state.gamesToBeCompleted[0]][1];
    //     let match = '' + teamA + ' vs ' + teamB;
    //     this.state.gameToBeAdded = [match, this.state.gamesToBeCompleted[0]];
    //     gameToBeAdded = [match, this.state.gamesToBeCompleted[0]];
    //     console.log('this.state.gameToBeAdded: ' + this.state.gameToBeAdded);
    //     console.log('gameToBeAdded: ' + gameToBeAdded);
    // }

    // let hourSelectedValue = '' + this.state.setOfHours.selected[1];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isAddModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View
          style={{height: '100%', width: '100%', backgroundColor: '#ECE7E4'}}>
          {!this.state.isChangeIsOn ? (
            this.state.gamesToBeCompleted.length !== 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#ECE7E4',
                }}>
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.1,
                    width: '60%',
                    alignItems: 'center',
                  }}
                />
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.1,
                    width: '60%',
                  }}>
                  <CustomPicker
                    value={gameOptionValue}
                    fieldTemplateProps={{
                      defaultText: 'Select Match',
                      textStyle: {
                        color: 'white',
                        fontSize: 18,
                        fontFamily: 'sans',
                        // fontWeight: 'bold',
                        opacity: 3,
                        textAlign: 'center',
                        //width: '100%',
                        textAlignVertical: 'center',
                      },
                    }}
                    style={{
                      borderWidth: 0,
                      height: GLOBALS.windowHeightSize * 0.1,
                      backgroundColor: '#0c4271',
                      borderRadius: 7.5,
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'sans',
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}
                    options={games}
                    getLabel={item => item.label}
                    //optionTemplate={this.renderOption}
                    //headerTemplate={this.renderHeader}
                    onValueChange={option => {
                      let addGame = this.state.addGame;
                      addGame.day = false;
                      addGame.hour = false;
                      addGame.referee = false;
                      if (!option) {
                        addGame.game = false;
                        this.setState({addGame: addGame});
                        return;
                      } else addGame.game = option;
                      this.setState({addGame: addGame});
                    }}
                  />
                </View>
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.05,
                    width: '60%',
                    alignItems: 'center',
                  }}
                />
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.1,
                    width: '60%',
                  }}>
                  <CustomPicker
                    value={dayOptionValue}
                    fieldTemplateProps={{
                      defaultText: 'Select Day',
                      textStyle: {
                        color: 'white',
                        fontSize: 18,
                        fontFamily: 'sans',
                        // fontWeight: 'bold',
                        opacity: 3,
                        textAlign: 'center',
                        //width: '100%',
                        textAlignVertical: 'center',
                      },
                    }}
                    style={{
                      borderWidth: 0,
                      height: GLOBALS.windowHeightSize * 0.1,
                      backgroundColor: '#0c4271',
                      borderRadius: 7.5,
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'sans',
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}
                    options={daysOptions}
                    getLabel={item => item.label}
                    optionTemplate={this.renderOption}
                    headerTemplate={this.renderHeader}
                    onValueChange={option => {
                      let addGame = this.state.addGame;
                      addGame.hour = false;
                      addGame.referee = false;
                      if (!option) {
                        addGame.day = false;
                        this.setState({addGame: addGame});
                        return;
                      } else addGame.day = option;
                      let setOfDays = {
                        days: this.state.setOfDays.days,
                        selected: [option.value + 1, option.label],
                      };
                      this.setState({addGame: addGame, setOfDays: setOfDays});
                    }}
                  />
                </View>
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.05,
                    width: '60%',
                    alignItems: 'center',
                  }}
                />
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.1,
                    width: '60%',
                  }}>
                  <CustomPicker
                    value={hourOptionValue}
                    fieldTemplateProps={{
                      defaultText: 'Select Hour',
                      textStyle: {
                        color: 'white',
                        fontSize: 18,
                        fontFamily: 'sans',
                        // fontWeight: 'bold',
                        opacity: 3,
                        textAlign: 'center',
                        // width: '100%',
                        textAlignVertical: 'center',
                      },
                    }}
                    style={{
                      borderWidth: 0,
                      height: GLOBALS.windowHeightSize * 0.1,
                      backgroundColor: '#0c4271',
                      borderRadius: 7.5,
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'sans',
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}
                    options={hoursOptions}
                    getLabel={item => item.label}
                    headerTemplate={this.renderHeader}
                    optionTemplate={this.renderOption}
                    onValueChange={option => {
                      let addGame = this.state.addGame;
                      addGame.referee = false;
                      if (!option) {
                        addGame.hour = false;
                        this.setState({addGame: addGame});
                        return;
                      } else addGame.hour = option;
                      let setOfHours = {
                        hours: this.state.setOfHours.hours,
                        selected: [option.value + 1, option.label],
                      };
                      this.setState({addGame: addGame, setOfHours: setOfHours});
                    }}
                  />
                </View>
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.05,
                    width: '60%',
                    alignItems: 'center',
                  }}
                />
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.1,
                    width: '60%',
                  }}>
                  <CustomPicker
                    value={refereeOptionValue}
                    fieldTemplateProps={{
                      defaultText: 'Select Referee',
                      textStyle: {
                        color: 'white',
                        fontSize: 18,
                        fontFamily: 'sans',
                        // fontWeight: 'bold',
                        opacity: 3,
                        textAlign: 'center',
                        // width: '100%',
                        textAlignVertical: 'center',
                      },
                    }}
                    style={{
                      borderWidth: 0,
                      height: GLOBALS.windowHeightSize * 0.1,
                      backgroundColor: '#0c4271',
                      borderRadius: 7.5,
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'sans',
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}
                    options={refereesOptions}
                    getLabel={item => item.label}
                    optionTemplate={this.renderOption}
                    headerTemplate={this.renderHeader}
                    onValueChange={option => {
                      let addGame = this.state.addGame;
                      if (!option) {
                        addGame.referee = false;
                        this.setState({addGame: addGame});
                        return;
                      } else addGame.referee = option;

                      this.setState({addGame: addGame});
                      // this.setState({setOfHours: setOfHours })}}/> should changeeeee
                    }}
                  />
                </View>
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.2,
                    width: '60%',
                    alignItems: 'center',
                  }}
                />
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.1,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1.5}} />
                  <AwesomeButtonCartman
                    onPress={() => this.confirmOrCancelAdd(1)}
                    type="anchor"
                    stretch={true}
                    textSize={18}
                    backgroundColor={GLOBALS.colors.Positive}
                    style={{flex: 2}}
                    borderWidth={0.5}
                    borderRadius={10}
                    raiseLevel={4}>
                    Add
                  </AwesomeButtonCartman>
                  <View style={{flex: 0.1}} />
                  <AwesomeButtonCartman
                    onPress={() => this.confirmOrCancelAdd(2)}
                    type="anchor"
                    stretch={true}
                    textSize={18}
                    backgroundColor={GLOBALS.colors.Negative}
                    style={{flex: 2}}
                    borderWidth={0.5}
                    borderRadius={10}
                    raiseLevel={4}>
                    Close
                  </AwesomeButtonCartman>
                  <View style={{flex: 1.5}} />
                </View>
              </View>
            ) : (
              // <View style={{ flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center' }}>
              //     <View style={{ alignItems: 'center', flex: 2, width: '60%', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
              //         <Text style={{ flex: 1 }}>Pick game</Text>
              //         <Picker
              //             selectedValue={gameToBeAdded[0]}
              //             style={{ width: '100%' }}
              //             onValueChange={(itemValue, itemIndex) => {
              //                 this.setState({gameToBeAdded: [itemValue, this.state.gamesToBeCompleted[itemIndex]] })}}
              //             style={{ flex: 1, width: '100%'}}
              //         >
              //             {games}
              //         </Picker>
              //     </View>
              //     <View style={{ alignItems: 'center', flex: 2, width: '60%', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
              //         <Text style={{ flex: 1 }}>Pick day</Text>
              //         <Picker
              //             selectedValue={'' + this.state.setOfDays.selected[1]}
              //             onValueChange={(itemValue, itemIndex) => {
              //                 let setOfDays = { days: this.state.setOfDays.days, selected: [itemIndex+1, itemValue]};
              //                 this.setState({setOfDays: setOfDays })}}
              //             style={{ flex: 1, width: '100%'}}
              //         >
              //             {daysPickers}
              //         </Picker>
              //     </View>
              //     <View style={{ alignItems: 'center', flex: 2, width: '60%', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
              //         <Text style={{ flex: 1 }}>Pick hour</Text>
              //         <Picker
              //             selectedValue={hourSelectedValue}
              //             onValueChange={(itemValue, itemIndex) => {
              //                 let setOfHours = { hours: this.state.setOfHours.hours, selected: [itemIndex+1, itemValue]};
              //                 this.setState({setOfHours: setOfHours })}}
              //             style={{ flex: 1, width: '100%' }}
              //         >
              //             {hoursPickers}
              //         </Picker>
              //     </View>
              //     <View style={{ flex: 2 }}></View>
              //     <TouchableOpacity style={{ justifyContent: 'center', flex: 1, width: '60%', flex: 1, backgroundColor: '#11B23C', borderRadius: 25}} onPress={() =>this.confirmOrCancelAdd(1)}>
              //             <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Add</Text>
              //     </TouchableOpacity>
              //     <TouchableOpacity style={{ justifyContent: 'center', flex: 1, width: '60%', flex: 1, backgroundColor: '#D91D1D', borderRadius: 25}} onPress={() =>this.confirmOrCancelAdd(2)}>
              //         <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Close</Text>
              //     </TouchableOpacity>

              // </View>
              <View
                style={{height: '100%', width: '100%', alignItems: 'center'}}>
                <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
                <Text
                  style={{
                    fontSize: 20,
                    width: '90%',
                    height: GLOBALS.windowHeightSize * 0.85,
                  }}>
                  All the games are already been shecduled
                </Text>
                <View
                  style={{
                    height: GLOBALS.windowHeightSize * 0.1,
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <AwesomeButtonCartman
                    onPress={() => this.confirmOrCancelAdd(2)}
                    type="anchor"
                    stretch={true}
                    textSize={18}
                    backgroundColor={GLOBALS.colors.Negative}
                    style={{width: '50%'}}
                    borderWidth={0.5}
                    borderRadius={10}
                    raiseLevel={4}>
                    Close
                  </AwesomeButtonCartman>
                </View>
              </View>
            )
          ) : (
            <View style={{height: '100%', width: '100%', alignItems: 'center'}}>
              <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
              <Text
                style={{
                  color: '#F81422',
                  fontSize: 20,
                  height: GLOBALS.windowHeightSize * 0.85,
                  width: '90%',
                }}>
                Warning: There are already teams which play at that time, are
                you sure you want to change?
              </Text>
              <View
                style={{
                  height: GLOBALS.windowHeightSize * 0.1,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View style={{flex: 1.5}} />
                <AwesomeButtonCartman
                  onPress={() => this.confirmOrCancelAdd(3)}
                  type="anchor"
                  stretch={true}
                  textSize={18}
                  backgroundColor={GLOBALS.colors.Neutral}
                  style={{flex: 2}}
                  borderWidth={0.5}
                  borderRadius={10}
                  raiseLevel={4}>
                  Yes
                </AwesomeButtonCartman>
                <View style={{flex: 0.1}} />
                <AwesomeButtonCartman
                  onPress={() => this.confirmOrCancelChange(4)}
                  type="anchor"
                  stretch={true}
                  textSize={18}
                  backgroundColor={GLOBALS.colors.Negative}
                  style={{flex: 2}}
                  borderWidth={0.5}
                  borderRadius={10}
                  raiseLevel={4}>
                  No
                </AwesomeButtonCartman>
                <View style={{flex: 1.5}} />
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  }

  getWeeksTitles() {
    let weeksPickers = [];
    for (let i = 0; i < this.state.schedule.length; i++) {
      let week = 'Week ' + (i + 1);
      weeksPickers.push({
        value: i,
        label: week,
        color: 'white',
      });
    }
    let showWeekOption = {
      value: this.state.currWeek - 1,
      label: 'Week ' + this.state.currWeek,
      color: 'white',
    };

    return (
      <CustomPicker
        value={showWeekOption}
        fieldTemplateProps={{
          defaultText: 'Select Week',
          textStyle: {
            color: 'white',
            fontSize: 14,
            fontFamily: 'sans',
            // fontWeight: 'bold',
            opacity: 3,
            textAlign: 'center',
            height: '100%',
            textAlignVertical: 'center',
          },
        }}
        style={{
          height: GLOBALS.windowHeightSize * 0.05,
          // width: '100%',
          backgroundColor: '#0c4271',
          borderRadius: 7.5,
          color: 'black',
          fontSize: 15,
          fontFamily: 'sans',
          fontWeight: 'bold',
          justifyContent: 'center',
        }}
        options={weeksPickers}
        fieldTemplate={this.renderField}
        getLabel={item => item.label}
        onValueChange={option => {
          if (!option) return;
          this.setState({dateIsOnChange: false, currWeek: option.value + 1});
        }}
      />
    );
  }

  createTableHead() {
    const tableHead = [];
    let tableHeadLength = this.state.tableHead.length;
    for (let i = 0; i < tableHeadLength; i++) {
      tableHead.push(
        <View style={{flex: 1, flexDirection: 'column', height: '100%'}}>
          <Text
            style={{
              width: '100%',
              flex: 2,
              textAlign: 'center',
              textAlignVertical: 'bottom',
            }}>
            {' '}
            {this.state.tableHead[i]}
          </Text>
          <View
            style={{
              width: '100%',
              flex: 1,
              borderRightWidth: i !== tableHeadLength - 1 ? borderWidth : 0,
              borderRightColor:
                i !== tableHeadLength - 1 ? borderColor : '#ECE7E4',
            }}
          />
        </View>,
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          height: GLOBALS.windowHeightSize * (0.7 / 9),
        }}>
        {tableHead}
      </View>
    );
  }

  createHourConstraintsButtons(hour, day) {
    let teamNum = this.state.currTeam ? this.state.currTeam.value : 1;
    let canPlay = this.state.teamsConstraints[teamNum].constraints[hour][
      day - 1
    ];
    console.log('teamNum: ' + teamNum + ', hour: ' + hour + ', day: ' + day);
    return (
      <View style={styles.ButtonContainer}>
        <TouchableOpacity
          style={{
            height: '95%',
            width: '95%',
            backgroundColor: canPlay
              ? this.state.canPlayColor
              : this.state.canNotPlayColor,
          }}>
          <Text style={{textAlign: 'center', color: '#FCFAFA'}} />
        </TouchableOpacity>
      </View>
    );
  }

  // rrrrrrrrrrrrrrrr
  createTeamsConstraintsView() {
    if (!this.state.isConstraintsModalVisible) return null;

    console.log('ooooo');
    const tableHead = this.createTableHead();
    const weeklyConstraints = [];
    for (let i = 0; i < this.state.numOfHours; i++) {
      weeklyConstraints.push(
        <View
          key={'week_hour_' + i}
          style={{
            height: GLOBALS.windowHeightSize * (0.7 / 9),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={styles.weeklyTitle}>
            <Text
              style={{
                color: 'black',
                height: '100%',
                flex: 2,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              {this.state.hours[i][0].substring(0, 5)}
            </Text>
            <View
              style={{
                height: '100%',
                flex: 1,
                borderTopColor: borderColor,
                borderTopWidth: borderWidth,
              }}
            />
          </View>
          {this.createHourConstraintsButtons(i, 1)}
          {this.createHourConstraintsButtons(i, 2)}
          {this.createHourConstraintsButtons(i, 3)}
          {this.createHourConstraintsButtons(i, 4)}
          {this.createHourConstraintsButtons(i, 5)}
        </View>,
      );
    }

    const teamOptionValue = this.state.currTeam || undefined;
    const teamOptions = [];
    const teamsConstraints = this.state.teamsConstraints;
    for (let teamNum in teamsConstraints) {
      let teamName = this.state.teamsConstraints[teamNum].teamName;
      console.log('teamName: ' + teamName + ', teamNum: ' + teamNum);
      teamOptions.push({
        label: teamName,
        value: teamNum,
        color: 'white',
      });
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isConstraintsModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#ECE7E4',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/*Rendering weekly constraints */}
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <View
            style={{
              height: GLOBALS.windowHeightSize * 0.1,
              width: '40%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomPicker
              value={teamOptionValue}
              fieldTemplateProps={{
                defaultText: 'Select Team',
                textStyle: {
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'sans',
                  // fontWeight: 'bold',
                  opacity: 3,
                  textAlign: 'center',
                  //width: '100%',
                  height: '100%',
                  textAlignVertical: 'center',
                },
              }}
              style={{
                borderWidth: 0,
                height: '100%',
                width: GLOBALS.windowWidthSize * 0.4,
                backgroundColor: '#0c4271',
                borderRadius: 7.5,
                color: 'black',
                fontSize: 15,
                fontFamily: 'sans',
                fontWeight: 'bold',
                //justifyContent: 'center'
              }}
              options={teamOptions}
              getLabel={item => item.label}
              fieldTemplate={this.renderField}
              //optionTemplate={this.renderOption}
              onValueChange={option => {
                if (!option) return;
                this.setState({currTeam: option});
              }}
            />
          </View>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <View style={{height: GLOBALS.windowHeightSize * 0.7, width: '90%'}}>
            {tableHead}
            {weeklyConstraints}
          </View>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <View
            style={{
              width: '100%',
              height: GLOBALS.windowHeightSize * 0.1,
              alignItems: 'center',
            }}>
            <AwesomeButtonCartman
              onPress={() => this.setState({isConstraintsModalVisible: false})}
              type="anchor"
              stretch={true}
              textSize={18}
              backgroundColor="#123c69"
              style={{width: '50%'}}
              borderWidth={0.5}
              borderRadius={10}
              raiseLevel={4}>
              Close
            </AwesomeButtonCartman>
          </View>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
        </View>
      </Modal>
    );

    // const teamsCViews = [];
    // const teamsConstraints = this.state.teamsConstraints;
    // for (let teamNum in teamsConstraints) {
    //     let teamView = [];
    //     let teamName = this.state.teamsConstraints[teamNum].teamName;
    //     teamView.push(
    //         <View key={teamNum + '_tableTitle'} style={{ width: '100%', flex: 1, flexDirection: 'column', backgroundColor: GLOBALS.colors.BackGround, alignItems: 'center' }}>
    //             <View style={{flex: 1, width: '100%'}}>
    //                 <Text style={{ color: '#AED6F1', height: '100%', width: '100%', textAlign: 'center' }}>{teamName}</Text>
    //             </View>
    //             <Table borderStyle={{borderWidth: 1}} style={{ width: '100%', paddingTop: 10, flex: 1 }}>
    //                 <Row
    //                 data={this.state.tableHead}
    //                 flexArr={[30, 30, 30, 30, 30, 30]}
    //                 style={styles.head}
    //                 textStyle={styles.textHead}
    //                 />
    //             </Table>
    //         </View>
    //     )
    //     for (let j=0; j<this.state.hours.length; j++) {
    //         teamView.push(
    //             <View key={j + '_hour'} style={styles.TeamViewContainer}>
    //                 <View style={styles.TeamsTytle}>
    //                     <Text style={{color: '#AED6F1', height: '100%', width: '100%', textAlign: 'center'}}>{this.state.hours[j][0]}</Text>
    //                 </View>
    //                 <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][0]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
    //                     <TouchableOpacity>
    //                         <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
    //                     </TouchableOpacity>
    //                 </View>
    //                 <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][1]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
    //                     <TouchableOpacity>
    //                         <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
    //                     </TouchableOpacity>
    //                 </View>
    //                 <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][2]? GLOBALS.colors.Positive: GLOBALS.colors.Negative }}>
    //                     <TouchableOpacity>
    //                         <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
    //                     </TouchableOpacity>
    //                 </View>
    //                 <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][3]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
    //                     <TouchableOpacity>
    //                         <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
    //                     </TouchableOpacity>
    //                </View>
    //                 <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][4]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
    //                     <TouchableOpacity>
    //                         <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </View>
    //         );
    //     }
    //     teamsCViews.push(teamView);
    // }
    // return teamsCViews
  }

  setDate(date) {
    let week = this.state.currWeek - 1;
    let weekDates = this.state.weekDates;
    weekDates[week].dateIsSet = true;
    weekDates[week].date = date;

    // Update the server
    let changeDetails = {};
    changeDetails.change = 'SetWeekDate';
    this.sendChangeToServer(this.state.schedule, changeDetails);
    this.setState({weekDates: weekDates});
  }

  createWeekSelector(date) {
    return <WeekSelector date={new Date(date)} weekPage={this} />;
  }

  renderOption(settings) {
    const {item, getLabel} = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, {backgroundColor: item.color}]} />
          <Text style={{color: 'black', alignSelf: 'flex-start'}}>
            {' '}
            {getLabel(item)}{' '}
          </Text>
        </View>
      </View>
    );
  }

  renderField(settings) {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={styles.fieldContainer}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!selectedItem && (
            <Text
              style={{
                height: '100%',
                width: '100%',
                color: 'white',
                fontSize: 18,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontFamily: 'sans',
              }}>
              {defaultText}
            </Text>
          )}
          {selectedItem && (
            <View
              style={{
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  height: '100%',
                  flex: 3,
                  color: '#FEFFFF',
                  fontFamily: 'sans',
                  fontSize: 15,
                }}>
                {getLabel(selectedItem)}
              </Text>
              <Icon4 name="chevron-down" size={30} style={{flex: 1}} />
            </View>
          )}
        </View>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.headerFooterContainer}>
        <View
          style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
          <View
            style={[styles.box, {backgroundColor: GLOBALS.colors.Positive}]}
          />
          <View
            style={[styles.box, {backgroundColor: GLOBALS.colors.Negative}]}
          />
        </View>
        <View
          style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
          <View style={{marginLeft: 2}}>
            <Text>Can</Text>
          </View>
          <View style={{marginLeft: 2}}>
            <Text>Can't</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    // if (!this.state.finishedLoad)
    //     return (
    //     <ImageBackground
    //         source={require('../Images/wall.jpg')}
    //         style={[styles.image, {flex: 1}, {opacity: 1}]}>
    //         <View style={{ height: GLOBALS.windowHeightSize }} />
    //     </ImageBackground>
    //     )
    if (this.state.isScheduleSet === 'notSet') {
      return (
        <ImageBackground
          source={require('../Images/wall1.png')}
          imageStyle={{opacity: 0.7}}
          style={[styles.image, {flex: 1}, {opacity: 1}]}>
          <View
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            style={{height: GLOBALS.windowHeightSize, width: '100%'}}>
            {/* <TouchableOpacity style={ GLOBALS.styles.touchAble } 
                                        onPress={() => { 
                                            alert('The server is now processing and computing the schedule, its might take a while...');
                                            this.scheduling()
                                            this.setState({isScheduleSet: 'inProcess'});
                                            }}>
                            <Text style={{ textAlign: 'center', color: GLOBALS.colors.ButtonText }}> Start Scheduling </Text>
                        </TouchableOpacity>            */}
            {/* <TouchableOpacity style={ GLOBALS.styles.touchAble }
                                            onPress={() => { 
                                                this.setState({ showTeamsConstraints: !this.state.showTeamsConstraints });
                                                }}>
                                <Text style={{ textAlign: 'center', color: GLOBALS.colors.ButtonText }}> {this.state.showTeamsConstraints? 'Hide' : 'Show'} Teams Constraints </Text>
                        </TouchableOpacity>  */}
            <View style={{height: GLOBALS.windowHeightSize * 0.25}} />
            <View
              style={{
                alignItems: 'center',
                height: GLOBALS.windowHeightSize * 0.1,
              }}>
              <AwesomeButtonCartman
                onPress={() => {
                  this.scheduling();
                  this.setAlertsState(
                    'scheduleInProccess',
                    true,
                    'The server is now processing and computing the schedule, its might take a while...',
                  );
                  //alert('The server is now processing and computing the schedule, its might take a while...');
                  this.setState({isScheduleSet: 'inProcess'});
                }}
                type="anchor"
                stretch={true}
                textSize={18}
                backgroundColor="#123c69"
                style={{width: '60%'}}
                borderWidth={0.5}
                borderRadius={10}
                raiseLevel={4}>
                Start Scheduling
              </AwesomeButtonCartman>
            </View>
            <View style={{height: GLOBALS.windowHeightSize * 0.1}} />
            <View
              style={{
                alignItems: 'center',
                height: GLOBALS.windowHeightSize * 0.1,
              }}>
              <AwesomeButtonCartman
                onPress={() => this.setState({isConstraintsModalVisible: true})}
                type="anchor"
                stretch={true}
                textSize={18}
                backgroundColor="#123c69"
                style={{width: '60%'}}
                borderWidth={0.5}
                borderRadius={10}
                raiseLevel={4}>
                Show Team Constraints
              </AwesomeButtonCartman>
            </View>
            {/* <View style={{ width: '80%', flexDirection: 'column' }}>
                            {(this.state.showTeamsConstraints)? this.createTeamsConstraintsView() : null}
                        </View> */}
            {this.createTeamsConstraintsView()}
            {this.createAllAlerts()}
          </View>
        </ImageBackground>
      );
    } else if (this.state.isScheduleSet === 'inProcess') {
      return (
        <ImageBackground
          imageStyle={{opacity: 0.7}}
          source={require('../Images/wall1.png')}
          style={[styles.image, {flex: 1}, {opacity: 1}]}>
          <View>
            <Text style={{color: 'white', fontSize: 25, fontFamily: 'sans'}}>
              Server is still scheduling...:
            </Text>
          </View>
        </ImageBackground>
      );
    }
    // else 'set'
    // Should get now the constraints
    const weekTitles = this.getWeeksTitles();
    const weekGames = this.createWeekGames();
    const date =
      this.state.weekDates !== undefined &&
      this.state.weekDates[this.state.currWeek - 1].dateIsSet
        ? this.state.weekDates[this.state.currWeek - 1].date
        : null;
    const weekSelector = this.createWeekSelector(date);
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        imageStyle={{opacity: 0.7}}
        style={[styles.image, {flex: 1}, {opacity: 1}]}>
        <View style={styles.container}>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <View
            style={{
              height: GLOBALS.windowHeightSize * 0.1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View style={{flex: 0.5}} />
            <View style={styles.weekTitle}>{weekTitles}</View>
            <View style={{flex: 0.5}} />
            <View style={{flex: 1, justifyContent: 'flex-start'}}>
              {weekSelector}
            </View>
            <View style={{flex: 0.5}} />
          </View>
          <View style={styles.gameTitlesContainer}>
            <View style={styles.gameLine}>
              <Text style={styles.gameLineText}>Match</Text>
            </View>
            <View style={styles.gameLine}>
              <Text style={styles.gameLineText}>Time</Text>
            </View>
            <View style={styles.gameLine}>
              <Text style={styles.gameLineText}>Referee</Text>
            </View>
          </View>
          <View style={{height: GLOBALS.windowHeightSize * 0.02}} />
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            style={{width: '100%', height: GLOBALS.windowHeightSize * 0.53}}>
            {weekGames}
          </ScrollView>
          {/* <View style={{ height: GLOBALS.windowHeightSize*0.03 }}/>
                    <View style={{ height: GLOBALS.windowHeightSize*0.1, width: '100%', alignItems: 'center' }}>
                        <Icon3.Button 
                            color='white'
                            backgroundColor={GLOBALS.colors.Positive}
                            name="add" 
                            onPress={() => this.addGame()}
                            iconStyle={{ marginRight: 0, marginLeft: 0 }}
                            size={25}
                            //style={{ height: '100%', padding: 0, margin: 0  }}
                            solid>
                        </Icon3.Button>
                    </View> */}
          <View style={{height: GLOBALS.windowHeightSize * 0.02}} />
          <View
            style={{
              height: GLOBALS.windowHeightSize * 0.1,
              width: '100%',
              alignItems: 'center',
            }}>
            <AwesomeButtonCartman
              onPress={() => {
                this.setState({
                  showTeamsConstraints: !this.state.showTeamsConstraints,
                  isConstraintsModalVisible: true,
                });
              }}
              type="anchor"
              textSize={18}
              backgroundColor="#123c69"
              borderWidth={0.5}
              borderRadius={10}
              raiseLevel={4}>
              Show Team Constraints
            </AwesomeButtonCartman>
          </View>
          {this.state.isConstraintsModalVisible && (
            <View
              style={{
                marginLeft: GLOBALS.windowWidthSize / 10,
                backgroundColor: '#000000',
                width: '80%',
                flexDirection: 'column',
              }}>
              {this.createTeamsConstraintsView()}
            </View>
          )}
          {this.createAllAlerts()}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  optionContainer: {
    padding: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  box: {
    width: 20,
    height: 20,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerFooterContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  TeamViewContainer: {
    flex: 9,
    flexDirection: 'row',
    width: '100%',
    borderColor: '#000000',
    //height: GLOBALS.windowHeightSize/14,
    //alignItems: 'center',
  },
  TeamsTytle: {
    flex: 1,
    borderColor: '#000000',
    backgroundColor: '#5D6D7E',
    borderWidth: 1,
  },
  TeamsDayContainer: {},
  gameTitlesContainer: {
    //flex: 1,
    flexDirection: 'row',
    //backgroundColor: GLOBALS.colors.BackGround,
    height: GLOBALS.windowHeightSize * 0.05,
    width: '95%',
    //backgroundColor: 'red'
    //borderBottomWidth: 2,
    //borderColor: '#000000',
  },
  gameDetailsContainer: {
    flex: 2,
    flexDirection: 'row',
    //backgroundColor: GLOBALS.colors.BackGround,
    width: '100%',
  },
  weekTitle: {
    flex: 1,
  },
  gameLineText: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
    height: '100%',
    textAlignVertical: 'bottom',
  },
  gameContainer: {
    flexDirection: 'column',
    height: Math.floor(GLOBALS.windowHeightSize / 7),
    width: '95%',
    backgroundColor: '#ECE7E4',
    borderRadius: 7.5,

    //borderColor: '#000000',
    // borderBottomWidth: 2,
    // borderLeftWidth: 2,
    // borderRightWidth: 2,
    //justifyContent: 'space-between',
  },
  gameLine: {
    flex: 1,
  },
  fieldContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    //backgroundColor: GLOBALS.colors.BackGround,
    height: GLOBALS.windowHeightSize,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
  },
  head: {
    height: 28,
    backgroundColor: '#5D6D7E',
  },
  ButtonContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: borderWidth,
    borderTopWidth: borderWidth,
    borderTopColor: borderColor,
    borderLeftColor: borderColor,
  },
  weeklyTitle: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
});
