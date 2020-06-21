import React from 'react';
import {
  Table,
  Row,
  Rows,
  Col,
  TableWrapper,
} from 'react-native-table-component';
import {
  View,
  StyleSheet,
  ScrollView,
  Button,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/blue';
import DatePicker from 'react-native-datepicker';
import AwesomeAlert from 'react-native-awesome-alerts';
import GLOBALS from '../Globals';

export default class PitchConstraints extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.changeColor = this.changeColor.bind(this);
    this.submitConstraints = this.submitConstraints.bind(this);
    this.load = this.load.bind(this);
    this.getConstraints = this.getConstraints.bind(this);
    this.initializeHoursData = this.initializeHoursData.bind(this);
    this.createHourConstraintsButtons = this.createHourConstraintsButtons.bind(
      this,
    );
    this.createTableHead = this.createTableHead.bind(this);
    this.createAllAlerts = this.createAllAlerts.bind(this);
    this.setAlertsState = this.setAlertsState.bind(this);
    this.addAlertToarray = this.addAlertToarray.bind(this);
    let hour = 16;
    let nextHour = 17;
    let numOfDays = 6;
    let numOfHours = 8;

    // Initialize state
    this.state = {
      canPlayColor: GLOBALS.colors.Positive,
      canNotPlayColor: GLOBALS.colors.Negative,
      canPlayText: '',
      canNotPlayText: '',
      numOfDays: numOfDays,
      numOfHours: numOfHours,
      data: this.initializeHoursData(numOfDays, numOfHours, hour, nextHour),
      tableHead: ['', 'Su', 'Mo', 'Tu', 'We', 'Th'],
      textInput: '',
      constraintDate: '',
      specificConstraints: {
        counter: 0,
        constraints: [],
      },
      alerts: {
        constraintsApproved: {
          toShow: false,
          msg: '',
        },
        requestFailed: {
          toShow: false,
          msg: '',
        },
        serverError: {
          toShow: false,
          msg: '',
        },
      },
    };
  }

  createAllAlerts() {
    const alerts = [];
    this.addAlertToarray(alerts, 'constraintsApproved', 'Confirm');
    this.addAlertToarray(alerts, 'requestFailed', 'Error');
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

  changeColor = (hour, day) => {
    return () => {
      let newData = this.state.data;
      newData[hour][day] = !newData[hour][day];
      this.setState({data: newData});
    };
  };

  submitConstraints = async () => {
    console.log('sssssssss');
    try {
      let response = fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'PitchConstraints',
            Authorization: await AsyncStorage.getItem('token'),
          },
          body: JSON.stringify({
            pitchConstraints: this.state.data,
          }),
        },
      )
        .then(response => response.json())
        .then(async resJson => {
          if (resJson.success) {
            console.log('submitConstraints(): in success scenario');
            this.setAlertsState(
              'constraintsApproved',
              true,
              'Your constraints have been set',
            );
            //this.props.navigation.navigate('Home');
          } else {
            console.log('submitConstraints(): in fail scenario');
            this.setAlertsState('requestFailed', true, '' + resJson.error.msg);
            //alert(resJson.error.msg);
          }
        });
    } catch (err) {
      console.log(err);
      this.setAlertsState('serverError', true, '' + err);
    }
  };

  componentDidMount() {
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
    let token;

    try {
      token = await AsyncStorage.getItem('token');
    } catch (err) {
      throw err;
    }

    this.getConstraints(token);
  }

  async getConstraints(token) {
    let response;
    try {
      response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/?data=GetPitchConstraints',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'GetPitchConstraints',
            Authorization: await AsyncStorage.getItem('token'),
          },
        },
      );
      const json = await response.json();
      if (json.success) {
        this.setState({data: json.pitchConstraints});
      } else console.log(json.error.msg);
    } catch (err) {
      console.error('error: ' + err);
    }
  }

  // addSpecificConstraint = () => {
  //   console.log('addSpecificConstraint(): curr counter: ' + this.state.specificConstraints.counter);
  //   const constraints = this.state.specificConstraints.constraints;
  //   constraints.push({ id: this.state.specificConstraints.counter+1, date: this.state.constraintDate, reason: this.state.textInput })
  //   this.setState({ constraintDate: '', specificConstraints: { counter: this.state.specificConstraints.counter+1, constraints: constraints }});
  // }

  // removeSpecificConstraints = (id) => {
  //     const constraints = this.state.specificConstraints.constraints;
  //     for (let j=0; j<constraints.length; j++) {
  //       if (constraints[j].id === id) {
  //           constraints.splice(j, 1);
  //           console.log('removeSpecificConstraints(): ' + constraints);
  //           this.setState({ textInput: 'Enter a reason..', specificConstraints: { counter: this.state.specificConstraints.counter, constraints: constraints } })
  //           return;
  //       }
  //     }
  // }

  // changeConstraintReason = (id, newReason) => {
  //   console.log('changeConstraintReason(): id: ' + constraints[j].id);
  //   const constraints = this.state.specificConstraints.constraints;
  //   for (let j=0; j<constraints.length; j++) {
  //     if (constraints[j].id === id) {
  //         constraints[j].reason = newReason;
  //         this.setState({ specificConstraints: { counter: this.state.specificConstraints.counter, constraints: constraints } })
  //         return;
  //     }
  //   }
  // }

  createHourConstraintsButtons(hour, day) {
    return (
      <View style={styles.ButtonContainer}>
        <TouchableOpacity
          onPress={this.changeColor(hour, day)}
          style={{
            height: '95%',
            width: '95%',
            backgroundColor: this.state.data[hour][day]
              ? this.state.canPlayColor
              : this.state.canNotPlayColor,
          }}>
          <Text style={{textAlign: 'center', color: '#FCFAFA'}}>
            {this.state.data[hour][day]
              ? this.state.canPlayText
              : this.state.canNotPlayText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  createTableHead() {
    const tableHead = [];
    let tableHeadLength = this.state.tableHead.length;
    for (let i = 0; i < tableHeadLength; i++) {
      tableHead.push(
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: GLOBALS.windowHeightSize * (0.75 / 9),
          }}>
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
          height: GLOBALS.windowHeightSize * (0.75 / 9),
        }}>
        {tableHead}
      </View>
    );
  }

  render() {
    const tableHead = this.createTableHead();
    const state = this.state;
    // weekly constraints
    const weeklyConstraints = [];
    for (let i = 0; i < this.state.numOfHours; i++) {
      weeklyConstraints.push(
        <View
          key={'week_hour_' + i}
          style={{
            height: GLOBALS.windowHeightSize * (0.75 / 9),
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
              {this.state.data[i][0].substring(0, 5)}
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
    // // specific constraints
    // const specificConstraints = [];
    // for (let i=0; i<this.state.specificConstraints.constraints.length; i++) {
    //     specificConstraints.push(
    //     <View key={'specific_constraint_' + i} style={styles.specificConstraints}>
    //         <DatePicker
    //             // style={{width: 200, paddingVertical: 20}}
    //             style={{ backgroundColor: '#8DC825', flex: 2 }}
    //             date={this.state.specificConstraints.constraints[i].date}
    //             mode="date"
    //             //placeholder="Pick a date"
    //             format="DD/MM/YY"
    //             minDate="01/11/19"
    //             maxDate="01/11/20"
    //             confirmBtnText="Confirm"
    //             cancelBtnText="Cancel"
    //             customStyles={{
    //               dateIcon: {
    //                 position: 'absolute',
    //                 left: 0,
    //                 top: 4,
    //                 marginLeft: 0,
    //               },
    //               dateInput: {
    //                 marginLeft: 36,
    //               },
    //             }}
    //         />
    //         <TextInput
    //             onChangeText={(newInput)=> this.changeConstraintReason(this.state.specificConstraints.constraints[i].id, newInput)}
    //             style={{ flex: 3 }}>{this.state.specificConstraints.constraints[i].reason}
    //         </TextInput>
    //         <TouchableOpacity
    //             onPress={() => { this.removeSpecificConstraints(this.state.specificConstraints.constraints[i].id) }}
    //             style={{ backgroundColor: '#DB850A', flex: 1, alignItems: 'center'}}
    //           >
    //             <Text style={{ backgroundColor: '#2569C8', width: '100%', height: '100%', textAlign: 'center'}}>Remove me</Text>
    //         </TouchableOpacity>
    //     </View>
    //     )
    // }
    return (
      <View style={styles.container}>
        {/*Rendering weekly constraints */}
        <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
        <View style={{height: GLOBALS.windowHeightSize * 0.75, width: '90%'}}>
          {tableHead}
          {weeklyConstraints}
        </View>
        <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
        {/* <View style={{ padding: 10 }}>
              <Text style={styles.submitText}>Specific Constraints</Text>
          </View>

          <View style={styles.specificConstraints}>
              <DatePicker
                  style={{ backgroundColor: '#8DC825', flex: 2 }}
                  date={this.state.constraintDate}
                  mode="date"
                  placeholder="Pick a date"
                  format="DD/MM/YY"
                  minDate="01/11/19"
                  maxDate="01/11/20"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      marginLeft: 36,
                    },
                  }}
                  onDateChange={date => {
                    this.setState({constraintDate: date});
                }}
              />
              <TextInput onChangeText={(newInput)=> this.setState({ textInput: newInput })} style={{ flex: 3 }} placeholder='Enter a reason..'></TextInput>
              <TouchableOpacity onPress={this.addSpecificConstraint} style={{ backgroundColor: '#DB850A', flex: 1, alignItems: 'center'}}>
                  <Text style={{ backgroundColor: '#2569C8', width: '100%', height: '100%', textAlign: 'center'}}>Add Me</Text>
              </TouchableOpacity>
          </View> */}
        {/*Rendering specific constraints */}
        {/* {specificConstraints} */}
        <View
          style={{
            width: '100%',
            height: GLOBALS.windowHeightSize * 0.1,
            alignItems: 'center',
          }}>
          <AwesomeButtonCartman
            onPress={() => this.submitConstraints()}
            type="anchor"
            stretch={true}
            textSize={18}
            backgroundColor="#123c69"
            style={{width: '50%'}}
            borderWidth={0.5}
            borderRadius={10}
            raiseLevel={4}>
            Submit
          </AwesomeButtonCartman>
        </View>
        <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
        {this.createAllAlerts()}
      </View>
    );
  }
}

var borderWidth = 1;
var borderColor = 'black';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECE7E4',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  ViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
