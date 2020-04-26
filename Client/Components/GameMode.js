import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import TeamSelector from './TeamSelector';
import Counter from 'react-native-counters';
import DialogInput from 'react-native-dialog-input';
import AwesomeAlert from 'react-native-awesome-alerts';
import DatePicker from 'react-native-datepicker';

function Timer({interval, style}) {
  const pad = n => (n < 10 ? '0' + n : n);
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())},</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  );
}

function RoundButton({title, color, background, onPress, disabled}) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[styles.button, {backgroundColor: background}]}
      activeOpacity={disabled ? 1.0 : 0.7}>
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
      teamSelected: false,
      dateSelected: false,
      isDialogVisible1: false,
      isDialogVisible2: false,
      submitConfirmationAlert: false,
      date: '',
      isLoading: false,
    };
    const {navigation} = this.props;
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  start = () => {
    if (!this.state.teamSelected) {
      alert('First Select The Teams');
    } else if (this.state.team1 === this.state.team2) {
      alert('Please Select Two Different Teams');
    } else if (!this.state.dateSelected) {
      alert('Please Select Date First');
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
      teamSelected: false,
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

  handleSelectTeam1 = team1 => {
    this.state.team1 = team1;
    if (this.state.team1 !== null && this.state.team2 !== null) {
      this.state.teamSelected = true;
    }
  };
  handleSelectTeam2 = team2 => {
    this.state.team2 = team2;
    if (this.state.team1 !== null && this.state.team2 !== null) {
      this.state.teamSelected = true;
    }
  };

  team1GoalChanged = (number, type) => {
    this.setState({team1Goals: number});
    this.setState({isDialogVisible1: true});
  };

  team2GoalChanged = (number, type) => {
    this.setState({team2Goals: number});
    this.setState({isDialogVisible2: true});
  };

  sendDialogInput = (textInput, isTeam1) => {
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

    if (isTeam1) {
      this.state.team1ScorrersDic.push({
        Name: [name],
        Team: this.state.team1,
        Number: num,
        Goals: 1,
      });
      this.setState({isDialogVisible1: false});
    } else {
      this.state.team2ScorrersDic.push({
        Name: [name],
        Team: this.state.team2,
        Number: num,
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
        this.props.navigation.getParam('port') +
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
          this.props.navigation.getParam('port') +
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
      <View style={styles.container}>
        {this.state.firstStart && (
          <View style={styles.teamSelectorWrapper}>
            <DatePicker
              style={{width: 200, alignSelf: 'flex-start'}}
              date={this.state.date}
              mode="date"
              placeholder="Date Of The Match"
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
                this.setState({date: date});
                this.setState({dateSelected: true});
              }}
            />
            <View style={styles.teamSelector}>
              <Text style={{alignSelf: 'flex-start'}}>Team1</Text>
              <TeamSelector
                teamList={this.props.navigation.getParam('teamList')}
                onSelect={this.handleSelectTeam1}
              />
            </View>
            <View style={styles.teamSelector}>
              <Text style={{alignSelf: 'flex-start'}}>Team2</Text>
              <TeamSelector
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
                <Text style={{fontSize: 24}}>{this.state.team1}</Text>
                <Counter
                  onChange={this.team1GoalChanged}
                  start={this.state.team1Goals}
                  someProp={this.state.team1Goals}
                />
              </View>
              <View style={{flex: 1, paddingLeft: 70}}>
                <Text style={{fontSize: 24}}>{this.state.team2}</Text>
                <Counter
                  onChange={this.team2GoalChanged}
                  start={this.state.team2Goals}
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
              <View style={{flex: 1, paddingLeft: 0}}>
                <Text style={{fontSize: 24}}>{this.state.team1}</Text>
                <Counter
                  onChange={this.team1GoalChanged}
                  start={this.state.team1Goals}
                  someProp={this.state.team1Goals}
                />
              </View>
              <View style={{flex: 1, paddingLeft: 70}}>
                <Text style={{fontSize: 24}}>{this.state.team2}</Text>
                <Counter
                  onChange={this.team2GoalChanged}
                  start={this.state.team2Goals}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.pressSubmitButton()}>
              <Text style={styles.buttonText}>
                Finish Game And Submit Result
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.dialogBox}>
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
        </View>
        <View style={styles.loadingStyle}>
          {this.state.isLoading && (
            <ActivityIndicator color={'#fff'} size={80} />
          )}
        </View>
        <AwesomeAlert
          show={submitConfirmationAlert}
          showProgress={false}
          title="Confirmation"
          message="Do You Want To Submit The Game?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No"
          confirmText="Yes"
          confirmButtonColor="#DD6B55"
          onCancelPressed={this.cancelAlert}
          onConfirmPressed={this.confirmAlert}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5499C7',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 50,
  },
  teamSelectorWrapper: {
    paddingTop: 20,
    textAlign: 'left',
    backgroundColor: '#5499C7',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamSelector: {
    textAlign: 'left',
    backgroundColor: '#5499C7',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
  },
  timer: {
    paddingTop: 30,

    color: '#FFFFFF',
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
