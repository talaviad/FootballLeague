import React from 'react';
import { Table, Row } from 'react-native-table-component';
import { View, StyleSheet, ScrollView, Button, Text, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
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
    let hour = 16;
    let nextHour = 17;
    let numOfDays = 6;
    let numOfHours = 8;

    // Initialize state
    this.state = {
      canPlayColor: GLOBALS.colors.Positive,
      canNotPlayColor: GLOBALS.colors.Negative,
      canPlayText: 'ABLE',
      canNotPlayText: 'NOT ABLE',
      numOfDays: numOfDays,
      numOfHours: numOfHours,
      data: this.initializeHoursData(numOfDays, numOfHours, hour, nextHour),
      tableHead: ['', 'S', 'M', 'T', 'W', 'T'],
    };
  }

  initializeHoursData = (numOfDays, numOfHours, hour, nextHour) => {
      let data = [];
      for (let i=0; i<numOfHours; i++) {
        data[i] = [];
        for (let j=0; j<numOfDays; j++) {
            data[i][j] = (j==0)? ''+hour+':00 - '+nextHour+':00' : 1; 
        }
        hour++;
        nextHour++;
      }
      return data;
  }

  changeColor = (hour, day) => {
      return () => {
        let newData = this.state.data;
        newData[hour][day] = !newData[hour][day];
        this.setState({data: newData});
      }
  }

  submitConstraints = async () => {
    try {
      let response = fetch(
          'http://' + this.props.navigation.getParam('IP') + ':' + this.props.navigation.getParam('PORT') + '/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Football-Request': 'PitchConstraints',
              'Authorization': await AsyncStorage.getItem('token')
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
              alert('Your constraints have been set'); 
              this.props.navigation.navigate('Home');
            } else {
              console.log('submitConstraints(): in fail scenario'); 
              alert(resJson.error.msg);
            }
          })
      }
      catch (err) {
        alert(err);
      }
  }

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
      response = await fetch('http://' + this.props.navigation.getParam('IP') + ':' + this.props.navigation.getParam('PORT') +'/?data=GetPitchConstraints', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'GetPitchConstraints',
          'Authorization': await AsyncStorage.getItem('token'),
        },
      });
      const json = await response.json();
      if (json.success) {
        this.setState({ data: json.pitchConstraints });
      }
      else 
        console.log(json.error.msg);

    } catch (err) {
      console.error('error: ' + err);
    }
  }

  render() {
    const state = this.state;
    // weekly constraints
    const pitchConstraints = [];
    for (let i=0; i<this.state.numOfHours; i++) {
        pitchConstraints.push(
                    <View key={'constraint_' + i} style={styles.ViewContainer}>
                        <View style={styles.Tytle}>
                            <Text style={{color: '#AED6F1', height: '100%', width: '100%', textAlign: 'center'}}>{this.state.data[i][0]}</Text>
                        </View>
                        <View style={styles.ButtonContainer}>
                            <TouchableOpacity onPress={this.changeColor(i,1)} style={{height: 60, width: '100%', backgroundColor: this.state.data[i][1]? this.state.canPlayColor : this.state.canNotPlayColor}}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>{this.state.data[i][1]? this.state.canPlayText : this.state.canNotPlayText}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ButtonContainer}>
                            <TouchableOpacity onPress={this.changeColor(i,2)} style={{height: 60, width: '100%', backgroundColor: this.state.data[i][2]? this.state.canPlayColor : this.state.canNotPlayColor}}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>{this.state.data[i][2]? this.state.canPlayText : this.state.canNotPlayText}</Text>
                            </TouchableOpacity>                      
                        </View>
                        <View style={styles.ButtonContainer}>
                            <TouchableOpacity onPress={this.changeColor(i,3)} style={{height: 60, width: '100%', backgroundColor: this.state.data[i][3]? this.state.canPlayColor : this.state.canNotPlayColor}}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>{this.state.data[i][3]? this.state.canPlayText : this.state.canNotPlayText}</Text>
                            </TouchableOpacity>                     
                        </View>
                        <View style={styles.ButtonContainer}>
                            <TouchableOpacity onPress={this.changeColor(i,4)} style={{height: 60, width: '100%', backgroundColor: this.state.data[i][4]? this.state.canPlayColor : this.state.canNotPlayColor}}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>{this.state.data[i][4]? this.state.canPlayText : this.state.canNotPlayText}</Text>
                            </TouchableOpacity>
                       </View>
                        <View style={styles.ButtonContainer}>
                            <TouchableOpacity onPress={this.changeColor(i,5)} style={{height: 60, width: '100%', backgroundColor: this.state.data[i][5]? this.state.canPlayColor : this.state.canNotPlayColor}}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>{this.state.data[i][5]? this.state.canPlayText : this.state.canNotPlayText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            );
    }

    return (
      <View style={{ alignItems: 'center', width: '100%', height: GLOBALS.windowHeightSize, backgroundColor: GLOBALS.colors.BackGround }}>
        <View style={{ justifyContent: 'center', backgroundColor: GLOBALS.colors.BackGround, width: '80%', height: GLOBALS.windowHeightSize/10, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '500', textAlign: 'center' }}>Set Pitch Constraints</Text>
        </View>
        <ScrollView style={styles.container}>
            <Table borderStyle={{borderWidth: 1}} style={{ flex: 1 }}>
                <Row
                  data={state.tableHead}
                  flexArr={[30, 30, 30, 30, 30, 30]}
                  style={styles.head}
                  textStyle={styles.textHead}
                />
            </Table>
            {/*Rendering weekly constraints */}
            {pitchConstraints}
        </ScrollView>
        <View style={{ backgroundColor: GLOBALS.colors.BackGround, width: '80%', height: GLOBALS.windowHeightSize/10, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.submitButton} onPress={this.submitConstraints}>
                    <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  specificConstraints: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: GLOBALS.colors.BackGround,
    height: GLOBALS.windowHeightSize*(9/10),
    width: '80%',
  },
  ViewContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ButtonContainer: {
    flex: 1,
    height: 60,
    alignItems: 'center',
  },
  Tytle: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    backgroundColor: '#5D6D7E',
  },
  Button: {
    height: 60,
    width: '100%',
    backgroundColor: '#E0FB13'
  },
  head: {
    height: 28,
    backgroundColor: '#5D6D7E',
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
  },
  submitButton: {
    width: '60%',
    backgroundColor: '#2C3E50',
    borderRadius: 25,
  },
  submitText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: GLOBALS.colors.ButtonTextColor,
  },
});