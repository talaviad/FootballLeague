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
  Image,
} from 'react-native';
import {Table, Row, Rows, Col} from 'react-native-table-component';
import {Picker} from '@react-native-community/picker';
import {Header} from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import {CustomPicker} from 'react-native-custom-picker';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/blue';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/Feather';
import GLOBALS from '../Globals';

export default class LeagueSchedule extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
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
      currWeek: 1,
      thereIsSchedule: false,
      currOptionWeek: false,
      finishedLoad: false,
      alerts: {
        responseError: {
          toShow: false,
          msg: '',
        },
      },
    };
    this.load = this.load.bind(this);
    this.getWeeksTitles = this.getWeeksTitles.bind(this);
    this.createWeekGames = this.createWeekGames.bind(this);
    this.createAllAlerts = this.createAllAlerts.bind(this);
    this.setAlertsState = this.setAlertsState.bind(this);
    this.addAlertToarray = this.addAlertToarray.bind(this);
    this.renderField = this.renderField.bind(this);
  }

  createAllAlerts() {
    const alerts = [];
    this.addAlertToarray(alerts, 'responseError', 'Error');
    return alerts;
  }

  setAlertsState(field, toShow, msg) {
    this.setState(prevState => {
      let alerts = Object.assign({}, prevState.alerts);
      alerts[field] = {toShow: toShow, msg: msg};
      return {alerts, finishedLoad: true};
    });
  }

  addAlertToarray(alerts, field, title) {
    alerts.push(
      <AwesomeAlert
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
    try {
      let response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/?data=GetLeagueSchedule',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'GetLeagueSchedule',
            Authorization: await AsyncStorage.getItem('token'),
          },
        },
      );
      const json = await response.json();
      console.log('json.success: ' + json.success);
      if (json.success) {
        // Should add handle here
        this.setState({
          finishedLoad: true,
          thereIsSchedule: true,
          teamsNumbers: json.teamsNumbers,
          teamsConstraints: json.teamsConstraints,
          schedule: json.schedule,
          refereesSchedule: json.refereesSchedule,
          weekDates: json.weekDates,
        });
      } else {
        // Should handle this
        console.log(json.error.msg);
        this.setState({finishedLoad: true});
      }
    } catch (err) {
      console.error(err);
      this.setAlertsState('responseError', true, err);
    }
  }

  createWeekGames() {
    let week = this.state.schedule[this.state.currWeek - 1];
    let games = [];
    let daysContainer = {};
    for (let i = 0; i < this.state.setOfDays.days.length; i++) {
      let dayStr = this.state.setOfDays.days[i][1];
      let dateStr = this.state.weekDates[this.state.currWeek - 1].dateIsSet
        ? this.state.weekDates[this.state.currWeek - 1].date
        : '';
      let date = dateStr ? new Date(dateStr) : null;
      if (date) date.setDate(date.getDate() + i);
      let day = date ? date.getDate() : '';
      let month = date ? date.getMonth() + 1 : '';
      date = date ? ', ' + day + '/' + month : '';
      daysContainer[dayStr] = {
        title: (
          <View key={'day_' + dayStr} style={styles.titleStyle}>
            <Text
              style={{
                width: '100%',
                flex: 2,
                borderWidth: 1,
                borderColor: '#161515',
                backgroundColor: '#0c4271',
                color: 'white',
                textAlign: 'center',
                fontFamily: 'sans',
                fontWeight: 'bold',
              }}>
              {dayStr + date}
            </Text>
            <View
              style={{
                flex: 3,
                borderBottomWidth: 1,
                borderBottomColor: '#161515',
              }}
            />
          </View>
        ),
        games: [],
      };
    }
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
          daysContainer[day].games.push(
            <View key={'week_' + i + '_game_' + j} style={styles.gameContainer}>
              <View style={styles.gameDetailsContainer}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    key={teamA + '_game_' + j}
                    style={{
                      flex: 1,
                      textAlignVertical: 'center',
                      fontFamily: 'sans',
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    {teamA} vs {teamB}
                  </Text>
                </View>
                <View style={styles.gameLine}>
                  <Text style={styles.gameLineText}>
                    {hour.substring(0, 5)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  height: '100%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}} />
                <Text
                  style={{
                    flex: 2,
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: 'sans',
                    borderLeftWidth: 0.5,
                    borderLeftColor: '#161515',
                  }}>
                  Referee
                </Text>
                <Text
                  style={{
                    flex: 2,
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: 'sans',
                    borderLeftWidth: 0.5,
                    borderLeftColor: '#161515',
                  }}>
                  {thereIsReferee ? referee : 'Not Set Yet'}
                </Text>
                <View style={{flex: 1}} />
              </View>
            </View>,
          );
        }
      }
    }

    for (let i = 0; i < this.state.setOfDays.days.length; i++) {
      let dayStr = this.state.setOfDays.days[i][1];
      if (daysContainer[dayStr].games.length === 0) continue;
      games.push(daysContainer[dayStr].title);
      for (let j = 0; j < daysContainer[dayStr].games.length; j++) {
        games.push(daysContainer[dayStr].games[j]);
      }
      games.push(<View style={{height: GLOBALS.windowHeightSize * 0.02}} />);
    }

    return games;
  }

  getWeeksTitles() {
    let weeksOptions = [];
    let weeksPickers = [];
    for (let i = 0; i < this.state.schedule.length; i++) {
      let week = 'Week ' + (i + 1);
      weeksPickers.push(
        <Picker.Item key={'add_picker_week_' + i} label={week} value={week} />,
      );
      weeksOptions.push({
        label: week,
        value: i,
        option: 'white',
      });
    }
    //alert('this.state.currWeek: ' + this.state.currWeek)
    let selectedValue = '' + this.state.currWeek;
    // let defaultWeek = {
    //     value: 0,
    //     label: 'Week ' + this.state.currWeek,
    //     color: 'white'
    // };
    // let weekOptionValue = this.state.currOptionWeek? this.state.currOptionWeek : defaultWeek;
    return (
      <Picker
        selectedValue={selectedValue}
        style={{width: '60%'}}
        itemStyle={{textAlign: 'center', fontWeight: 'bold'}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({currWeek: itemIndex + 1})
        }>
        {weeksPickers}
      </Picker>
      // <CustomPicker
      //     value={weekOptionValue}
      //     fieldTemplateProps={{
      //     defaultText: 'Select Week',
      //     textStyle: {
      //         color: 'white',
      //         fontSize: 14,
      //         fontFamily: 'sans',
      //         // fontWeight: 'bold',
      //         opacity: 3,
      //         textAlign: 'center',
      //         height: '100%',
      //         textAlignVertical: 'center',
      //     },
      //     }}
      //     style={{
      //         width: '100%',
      //         height: '100%',
      //         backgroundColor: '#0c4271',
      //         borderRadius: 7.5,
      //         color: 'black',
      //         fontSize: 15,
      //         fontFamily: 'sans',
      //         fontWeight: 'bold',
      //         justifyContent: 'center'
      //     }}
      //     //fieldTemplate={this.renderField}
      //     options={weeksOptions}
      //     getLabel={item => item.label}
      //     onValueChange={option => {
      //         if (!option)
      //             return
      //         this.setState({ currOptionWeek: option, currWeek: option.value+1})
      //     }}/>
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
              <Icon name="chevron-down" size={30} style={{flex: 1}} />
            </View>
          )}
        </View>
      </View>
    );
  }

  render() {
    if (!this.state.finishedLoad)
      return (
        <ImageBackground
          source={require('../Images/wall1.png')}
          style={[styles.image, {flex: 1}, {opacity: 1}]}
          imageStyle={{opacity: 0.7}}>
          <View style={{height: GLOBALS.windowHeightSize}} />
        </ImageBackground>
      );
    if (!this.state.thereIsSchedule)
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image
            style={{
              width: GLOBALS.windowWidthSize,
              height: GLOBALS.windowHeightSize,
            }}
            source={require('../Images/comingSoon.jpeg')}
          />
        </View>
      );
    const weekTitles = this.getWeeksTitles();
    const weekGames = this.createWeekGames();
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={[styles.image, {flex: 1}, {opacity: 1}]}
        imageStyle={{opacity: 0.7}}>
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.container}>
          {/* <View style={{ height: GLOBALS.windowHeightSize*0.05 }} /> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: '100%',
                flex: 0.5,
                borderRightWidth: 1,
                borderRightColor: 'black',
              }}
            />
            <View style={styles.weekTitle}>{weekTitles}</View>
            <View
              style={{
                height: '100%',
                flex: 0.5,
                borderLeftWidth: 1,
                borderLeftColor: 'black',
              }}
            />
          </View>
          <View
            style={{
              height: GLOBALS.windowHeightSize * 0.1,
              borderTopWidth: 1,
              borderTopColor: 'black',
              width: '90%',
            }}
          />
          <ScrollView
            style={{height: GLOBALS.windowHeightSize * 0.7, width: '90%'}}>
            {weekGames}
          </ScrollView>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
        </ScrollView>
        {this.createAllAlerts()}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  fieldContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TeamViewContainer: {
    flex: 9,
    flexDirection: 'row',
    width: '100%',
    borderColor: '#000000',
  },
  gameTitlesContainer: {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: GLOBALS.colors.BackGround,
    height: Math.floor(GLOBALS.windowHeightSize / 10),
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#000000',
  },
  gameDetailsContainer: {
    flex: 3,
    flexDirection: 'row',
    //backgroundColor: GLOBALS.colors.BackGround,
    width: '100%',
  },
  weekTitle: {
    //backgroundColor: 'red',
    height: GLOBALS.windowHeightSize * 0.1,
    //width: '100%',
    flex: 9,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gameLineText: {
    color: '#000000',
    textAlign: 'center',
    textAlignVertical: 'center',
    height: '100%',
    fontFamily: 'sans',
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    height: GLOBALS.windowHeightSize * 0.1,
    width: '100%',
    borderColor: '#161515',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    //justifyContent: 'space-between',
  },
  gameLine: {
    flex: 1,
  },
  container: {
    //backgroundColor: GLOBALS.colors.BackGround,
    height: GLOBALS.windowHeightSize,
    width: '100%',
  },
  titleStyle: {
    flexDirection: 'row',
    flex: 2,
    // borderLeftWidth: 0.5,
    // borderTopWidth: 0.5,
    // borderRightWidth: 0.5,
    // borderWidth: 1,
    // borderColor: '#161515',
  },
});
