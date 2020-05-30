import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Picker,
  Platform,
  Button,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import moment from 'moment';
import TeamSelector from './TeamSelector';

import Counter from 'react-native-counters';
import DialogInput from 'react-native-dialog-input';
import AwesomeAlert from 'react-native-awesome-alerts';
import DatePicker from 'react-native-datepicker'; // tal's old state
import Select2 from 'react-native-select-two';
import DialogAndroid from 'react-native-dialogs';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';

function Timer({interval, style}) {
  const pad = n => (n < 10 ? '0' + n : n);
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>
        {pad(duration.seconds())}
        {':'}
      </Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  );
}

function RoundButton({title, color, background, onPress, disabled}) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[styles.button, {backgroundColor: background}]}
      activeOpacity={disabled ? 1.0 : 0.8}>
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, {color}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ButtonsRow({children}) {
  return <View style={styles.buttonsRow}>{children}</View>;
}

export default class GameMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team1: null,
      team2: null,
      team1Goals: 0,
      team2Goals: 0,
      team1ScorrersDic: [],
      team2ScorrersDic: [],
      start: 0,
      now: 0,
      laps: [],
      firstStart: true,
      teamsSelected: false,
      dateSelected: false,
      isDialogVisible1: false,
      isDialogVisible2: false,
      submitConfirmationAlert: false,
      date: '',
      isLoading: false,
      playersTeam1: [],
      playersTeam2: [],
    };
    const {navigation} = this.props;
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  start = () => {
    if (!this.state.dateSelected) {
      alert('Please Select The Date');
    } else if (!this.state.teamsSelected) {
      alert('Please Select The Teams');
    } else if (this.state.team1 === this.state.team2) {
      alert('Please Select Two Different Teams');
    } else {
      const now = new Date().getTime();
      this.setState({
        start: now,
        now,
        laps: [0],
        firstStart: false,
      });
      this.timer = setInterval(() => {
        this.setState({now: new Date().getTime()});
      }, 100);
    }
  };

  stop = () => {
    clearInterval(this.timer);
    const {laps, now, start} = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,
    });
  };

  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0,
      team1: null,
      team2: null,
      team1Goals: 0,
      team2Goals: 0,
      team1ScorrersDic: [],
      team2ScorrersDic: [],
      firstStart: true,
      teamsSelected: false,
      dateSelected: false,
      isDialogVisible1: false,
      isDialogVisible2: false,
      date: '',
    });
  };
  resume = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
    });
    this.timer = setInterval(() => {
      this.setState({now: new Date().getTime()});
    }, 100);
  };

  handleSelectTeam1 = team1Name => {
    this.state.team1 = team1Name;
    if (team1Name !== null && this.state.team2 !== null) {
      this.state.teamsSelected = true;
    } else {
      this.state.teamsSelected = false;
    }
    if (team1Name !== null) {
      this.getPlayersList(1, team1Name);
    }
  };
  handleSelectTeam2 = team2Name => {
    this.state.team2 = team2Name;
    if (this.state.team1 !== null && team2Name !== null) {
      this.state.teamsSelected = true;
    } else {
      this.state.teamsSelected = false;
    }
    if (team2Name !== null) {
      this.getPlayersList(2, team2Name);
    }
  };

  async getPlayersList(clubIndex, clubName) {
    try {
      let response = fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/?data=' +
          clubName,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'PlayersList',
          },
        },
      )
        .then(response => response.json())
        .then(async resJson => {
          if (resJson.success) {
            this.arrangePlayersList(clubIndex, resJson.players);
          } else {
            alert('Error');
          }
        })
        .catch(err => alert(err));
    } catch (err) {
      alert(err);
    }
  }

  arrangePlayersList = (clubIndex, playersList) => {
    var newPlayersList = playersList.map(
      dic =>
        '#' +
        dic.jerseyNumber.toString() +
        ' ' +
        dic.firstName.toString() +
        ' ' +
        dic.lastName.toString(),
    );
    clubIndex === 1
      ? this.setState({
          playersTeam1: newPlayersList,
        })
      : this.setState({
          playersTeam2: newPlayersList,
        });
  };

  async team1GoalChanged() {
    this.stop();
    //this.setState({team1Goals: number});

    //this.setState({isDialogVisible1: true});
    const {selectedItem} = await DialogAndroid.showPicker(
      'Pick The Scorer',
      null,
      {
        positiveText: 'OK', // this is what makes disables auto dismiss
        negativeText: 'Cancel',
        type: DialogAndroid.listRadio,
        //selectedId: 'apple',
        items: this.state.playersTeam1.map((x, i) => {
          return {label: x, id: i};
        }),
      },
    );
    if (selectedItem) {
      var index = selectedItem.id;
      var arr = this.state.playersTeam1[index].split(' ');
      this.state.team1ScorrersDic.push({
        Name: arr[1] + ' ' + arr[2],
        Team: this.state.team1,
        Number: arr[0].substring(1),
        Goals: 1,
      });
      this.setState({team1Goals: this.state.team1Goals + 1});
    }
    this.resume();
  }

  async team2GoalChanged() {
    this.stop();
    //this.setState({team1Goals: number});

    //this.setState({isDialogVisible1: true});
    const {selectedItem} = await DialogAndroid.showPicker(
      'Pick The Scorer',
      null,
      {
        positiveText: 'OK', // this is what makes disables auto dismiss
        negativeText: 'Cancel',
        type: DialogAndroid.listRadio,
        //selectedId: 'apple',
        items: this.state.playersTeam2.map((x, i) => {
          return {label: x, id: i};
        }),
      },
    );
    if (selectedItem) {
      var index = selectedItem.id;
      var arr = this.state.playersTeam2[index].split(' ');
      this.state.team2ScorrersDic.push({
        Name: arr[1] + ' ' + arr[2],
        Team: this.state.team2,
        Number: arr[0].substring(1),
        Goals: 1,
      });
      this.setState({team2Goals: this.state.team2Goals + 1});
    }
    this.resume();
  }

  // async team2GoalChanged(number, type) {
  //   this.stop();
  //   this.setState({team2Goals: number});

  //   //this.setState({isDialogVisible1: true});
  //   const {selectedItem} = await DialogAndroid.showPicker(
  //     'Pick The Scorer',
  //     null,
  //     {
  //       positiveText: 'OK', // this is what makes disables auto dismiss
  //       negativeText: 'Cancel',
  //       type: DialogAndroid.listRadio,
  //       //selectedId: 'apple',
  //       items: this.state.playersTeam2.map((x, i) => {
  //         return {label: x, id: i};
  //       }),
  //     },
  //   );
  //   if (selectedItem) {
  //     var index = selectedItem.id;
  //     var arr = this.state.playersTeam2[index].split(' ');
  //     this.state.team2ScorrersDic.push({
  //       Name: arr[1] + ' ' + arr[2],
  //       Team: this.state.team1,
  //       Number: arr[0].substring(1),
  //       Goals: 1,
  //     });
  //   }
  //   this.resume();
  // }

  sendDialogInput = (textInput, isTeam1) => {
    var reg = new RegExp('^[\\s]*[0-9]+[\\s-:,]+[a-zA-Z]+([\\s]+[a-zA-Z]+)*$');
    if (!reg.test(textInput)) {
      alert('bad input');
      return;
    }
    var jerzyNumber = textInput.match(/^\d+/g);
    var tempPlayerName = textInput.match(/[a-zA-Z]+/g); //if it's the first and the last name return array of 2
    var playerName = '';
    for (var i = 0; i < tempPlayerName.length; i++) {
      playerName =
        playerName +
        tempPlayerName[i][0].toUpperCase() +
        tempPlayerName[i].substring(1).toLowerCase();
      if (i !== tempPlayerName.length - 1) {
        playerName = playerName + ' ';
      }
    }
    /*
    var num;
    var name;
    try {
      num = textInput.match(/\d/g);
      num = num.join('');
      name = textInput.replace(/[^a-zA-Z' ']+/g, '');
      name = name.toLowerCase();
      while (name[0] === ' ') {
        name = name.substring(1);
      }
      //Change the first letter in firstName and first letter in Last name to upper case
      name = name.replace(/\b\w/g, l => l.toUpperCase());
    } catch {
      num, (name = '');
    }
*/
    if (isTeam1) {
      this.state.team1ScorrersDic.push({
        Name: [playerName],
        Team: this.state.team1,
        Number: jerzyNumber,
        Goals: 1,
      });
      this.setState({isDialogVisible1: false});
    } else {
      this.state.team2ScorrersDic.push({
        Name: [playerName],
        Team: this.state.team2,
        Number: jerzyNumber,
        Goals: 1,
      });
      this.setState({isDialogVisible2: false});
    }
  };

  cancelAlert = () => {
    this.setState({
      submitConfirmationAlert: false,
    });
  };

  confirmAlert = () => {
    this.setState({
      submitConfirmationAlert: false,
    });
    this.sendResultToServer();
  };

  pressSubmitButton = () => {
    this.setState({
      submitConfirmationAlert: true,
    });
  };

  async updateScorerTable() {
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
          'Football-Request': 'ScorerTable',
        },
        body: JSON.stringify({
          dicTeam1: this.state.team1ScorrersDic,
          dicTeam2: this.state.team2ScorrersDic,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        if (resJson.success) {
          alert('The game submited successfully');
          this.props.navigation.navigate('Home');
        } else {
          alert(resJson.error.msg);
        }
      })
      .catch(err => alert(err));
  }

  async sendResultToServer() {
    try {
      this.setState({isLoading: true});

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
            'Football-Request': 'Result',
          },
          body: JSON.stringify({
            selectedTeam1: this.state.team1,
            selectedTeam2: this.state.team2,
            scoreTeam1: this.state.team1Goals,
            scoreTeam2: this.state.team2Goals,
            date: this.state.date,
            team1ScorrersDic: this.state.team1ScorrersDic,
            team2ScorrersDic: this.state.team2ScorrersDic,
          }),
        },
      )
        .then(response => response.json())
        .then(async resJson => {
          if (resJson.success) {
            this.updateScorerTable();
          } else {
            alert('error: ' + resJson.error.msg);
          }
        })
        .catch(err => alert(err));
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const {submitConfirmationAlert} = this.state;
    const {now, start, laps} = this.state;
    const timer = now - start;

    return (
      <ImageBackground
        source={require('../Images/c.jpg')}
        style={[styles.image /*, {opacity: 0.8}*/]}
        imageStyle={{opacity: 0.8}}>
        <View style={styles.container}>
          {this.state.firstStart && (
            <View style={styles.teamSelectorWrapper}>
              <DatePicker
                style={{
                  marginTop: '15%',
                  flex: 1,
                  width: '100%',
                }}
                date={this.state.date}
                mode="date"
                placeholder="Date Of The Match"
                format="DD/MM/YY"
                minDate="01/11/19"
                maxDate="01/11/20"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateTouchBody: {borderWidth: 0.8, borderRadius: 7.5},
                  dateIcon: {
                    position: 'absolute',
                    left: 4,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderWidth: 0,
                  },
                  // dateInput: {backgroundColor: '#ADADAD'},
                  dateText: {
                    color: 'black',
                    fontSize: 19,
                    fontFamily: 'sans',
                    fontWeight: 'bold',
                  },
                  placeholderText: {
                    color: 'black',
                    fontSize: 19,
                    fontFamily: 'sans-serif-medium',
                    fontStyle: 'italic',
                    fontWeight: '600',
                  },
                }}
                onDateChange={date => {
                  this.setState({date: date});
                  this.setState({dateSelected: true});
                }}
              />
              <View
                style={{
                  flex: 1.2,
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <TeamSelector
                  selectedTitleStyle={{
                    //the style of select team text
                    color: 'black',
                    fontSize: 18,
                    textAlign: 'center',
                    fontFamily: 'sans-serif-medium',
                    fontWeight: '60',
                  }}
                  teamList={this.props.navigation.getParam('teamList')}
                  onSelect={this.handleSelectTeam1}
                />
                {/* </View> */}
                {/* <View style={styles.teamSelector}> */}
                <TeamSelector
                  selectedTitleStyle={{
                    //the style of select team text

                    color: 'black',
                    fontSize: 18,
                    textAlign: 'center',
                    fontFamily: 'sans-serif-medium',
                    fontWeight: '60',
                  }}
                  teamList={this.props.navigation.getParam('teamList')}
                  onSelect={this.handleSelectTeam2}
                />
              </View>
            </View>
          )}
          <Timer
            interval={laps.reduce((total, curr) => total + curr, 0) + timer}
            style={styles.timer}
          />
          {this.state.firstStart && (
            <ButtonsRow>
              <RoundButton
                title="Start"
                color="#50D167"
                background="#1B361F"
                onPress={this.start}
              />
            </ButtonsRow>
          )}
          {start > 0 && (
            <View style={{alignItems: 'flex-start'}}>
              <ButtonsRow style={{justifyContent: 'center'}}>
                <RoundButton
                  title="Stop"
                  color="#E33935"
                  background="#3C1715"
                  onPress={this.stop}
                />
              </ButtonsRow>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{flex: 1, paddingLeft: 0}}>
                  <Text style={{fontSize: 24, fontFamily: 'sans-serif-medium'}}>
                    {this.state.team1}
                  </Text>
                  <Counter
                    countTextStyle={{
                      color: 'black',
                      fontSize: 24,
                      fontFamily: 'sans-serif-medium',
                    }}
                    buttonTextStyle={{
                      color: 'black',
                      fontSize: 24,
                      fontFamily: 'sans-serif-medium',
                      borderColor: 'black',
                    }}
                    buttonStyle={{
                      color: 'black',
                      borderColor: 'black',
                      borderWidth: 1.5,
                    }}
                    onChange={() => {
                      this.team1GoalChanged();
                    }}
                    start={this.state.team1Goals}
                    someProp={this.state.team1Goals}
                  />
                </View>
                <View style={{flex: 1, paddingLeft: 70}}>
                  <Text style={{fontSize: 24, fontFamily: 'sans-serif-medium'}}>
                    {this.state.team2}
                  </Text>
                  <Counter
                    countTextStyle={{
                      color: 'black',
                      fontSize: 24,
                      fontFamily: 'sans-serif-medium',
                    }}
                    buttonTextStyle={{
                      color: 'black',
                      fontSize: 24,
                      fontFamily: 'sans-serif-medium',
                      borderColor: 'black',
                    }}
                    buttonStyle={{
                      color: 'black',
                      borderWidth: 1.5,
                      borderColor: 'black',
                    }}
                    onChange={() => {
                      // this.setState({team2Goals: number});
                      this.team2GoalChanged();
                    }}
                    start={this.state.team2Goals}
                    someProp={this.state.team2Goals}
                  />
                </View>
              </View>
            </View>
          )}
          {laps.length > 0 && start === 0 && (
            <View style={{alignItems: 'flex-start'}}>
              <ButtonsRow>
                <RoundButton
                  title="Reset"
                  color="#FFFFFF"
                  background="#3D3D3D"
                  onPress={this.reset}
                />
                <RoundButton
                  title="Continue"
                  color="#50D167"
                  background="#1B361F"
                  onPress={this.resume}
                />
              </ButtonsRow>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {/* <View style={{flex: 1, paddingLeft: 0}}>
                <Text style={{fontSize: 24}}>{this.state.team1}</Text>
                <Counter
                  onChange={() => {
                    this.setState({team1Goals: number});
                    this.team1GoalChanged();
                  }}
                  start={this.state.team1Goals}
                  someProp={this.state.team1Goals}
                />
              </View>
              <View style={{flex: 1, paddingLeft: 70}}>
                <Text style={{fontSize: 24}}>{this.state.team2}</Text>
                <Counter
                  onChange={() => {
                    this.setState({team2Goals: number});
                    this.team2GoalChanged();
                  }}
                  start={this.state.team2Goals}
                />
              </View> */}
              </View>
              {!this.state.submitConfirmationAlert && (
                <AwesomeButtonCartman
                  onPress={() => this.pressSubmitButton()}
                  backgroundDarker="#687864"
                  type="primary"
                  textColor="#FFF"
                  textSize={18}
                  backgroundColor="#844D36"
                  raiseLevel={7}>
                  Finish Game And Submit Result
                </AwesomeButtonCartman>
              )}
            </View>
          )}
          {/* <View style={styles.dialogBox}>
          <DialogInput
            isDialogVisible={
              this.state.isDialogVisible1 || this.state.isDialogVisible2
            }
            title={'Scorrer Details'}
            message={"Enter the shirt's number and the scorrer name"}
            hintInput={'10 Alon'}
            submitInput={inputText => {
              this.sendDialogInput(inputText, this.state.isDialogVisible1);
            }}
            closeDialog={() => {
              if (this.state.isDialogVisible1) {
                this.setState({team1Goals: this.state.team1Goals - 1});
                this.setState({isDialogVisible1: false});
              } else {
                this.setState({team2Goals: this.state.team2Goals - 1});
                this.setState({isDialogVisible2: false});
              }
            }}
          />
        </View> */}
          {/* {(this.state.isDialogVisible1 || this.state.isDialogVisible2) && (
          <Select2
            isSelectSingle
            style={{borderRadius: 10}}
            colorTheme={'blue'}
            popupTitle="Select Player"
            title="Select Player"
            data={
              this.state.isDialogVisible1
                ? this.state.playersTeam1
                : this.satate.playersTeam2
            }
            onSelect={data => {
              this.setState({data});
              this.props.onSelect(this.teamsData[data - 1].name);
            }}
            onRemoveItem={data => {
              this.setState({data});
            }}
          />
        )} */}
          <View style={styles.loadingStyle}>
            {this.state.isLoading && (
              <ActivityIndicator color={'#fff'} size={80} />
            )}
          </View>
          <AwesomeAlert
            show={submitConfirmationAlert}
            alertContainerStyle={{opacity: 3}}
            showProgress={false}
            title="Confirmation"
            message="Do You Want To Submit The Game?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="No"
            confirmText="Yes"
            confirmButtonColor="#8fbc8f"
            onCancelPressed={this.cancelAlert}
            onConfirmPressed={this.confirmAlert}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#5499C7',
    alignItems: 'center',
    // paddingTop: 20,
    paddingHorizontal: '10%',
  },
  teamSelectorWrapper: {
    width: '100%',
    flex: 0.7,
    // paddingTop: 20,
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamSelector: {
    textAlign: 'left',
    // backgroundColor: '#5499C7',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingTop: 30,
  },
  timer: {
    paddingTop: 30,
    color: 'black',
    fontSize: 76,
    fontWeight: '200',
    width: 110,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingLeft: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#AED6F1',
    textAlign: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 80,
    marginBottom: 30,
  },
  scrollView: {
    alignSelf: 'stretch',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  fastest: {
    color: '#4BC05F',
  },
  slowest: {
    color: '#CC3531',
  },
  timerContainer: {
    flexDirection: 'row',
  },
  dialogBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  confirmationBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
