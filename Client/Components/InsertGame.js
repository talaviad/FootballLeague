import React from 'react';
import {
  StyleSheet,
  View,
  Picker,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import 'isomorphic-fetch';
import DatePicker from 'react-native-datepicker';
import TeamSelector from './TeamSelector';
import NumericInput from 'react-native-numeric-input';


export default class InsertGame extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      teamsNames: [],
      scoreTeam1: '',
      scoreTeam2: '',
      date: '',
      selectedTeam1: null,
      selectedTeam2: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getTeamsNames();
  }

  async getTeamsNames() {
    let response;

    try {
      response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':3000/?data=TeamsNames',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'TeamsNames',
          },
        },
      );
      const json = await response.json();
      this.state.teamsNames = json.teamsNames;
      var isLoading = false;
      this.setState({isLoading});
    } catch (err) {
      console.error(err);
    }
  }

  async sendResultToServer() {
    if (
      this.state.selectedTeam1 === this.state.selectedTeam2 ||
      isNaN(parseInt(this.state.scoreTeam1)) ||
      isNaN(parseInt(this.state.scoreTeam2)) ||
      (parseInt(this.state.scoreTeam1) < 0) |
        (parseInt(this.state.scoreTeam1) > 30) ||
      parseInt(this.state.scoreTeam2) < 0 ||
      parseInt(this.state.scoreTeam2) > 30 ||
      isNaN(parseInt(this.state.date))
    ) {
      alert('Invalid Input');
      return;
    }
    try {
      let response = fetch(
        'http://' + this.props.navigation.getParam('IP') + ':3000/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'Result',
          },
          body: JSON.stringify({
            selectedTeam1: this.state.selectedTeam1,
            selectedTeam2: this.state.selectedTeam2,
            scoreTeam1: this.state.scoreTeam1,
            scoreTeam2: this.state.scoreTeam2,
            date: this.state.date,
          }),
        },
      )
        .then(response => response.json())
        .then(async resJson => {
          if (resJson.success) {
            alert('The game updated successfully');
            this.props.navigation.navigate('Home');
          } else {
            alert('error: ' + resJson.error.msg);
            return;
          }
        })
        .catch(err => alert(err));
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.wrapper}>
        <DatePicker
          style={{width: 200, paddingVertical: 20}}
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
          }}
        />

        <View style={styles.teamSelector}>
          <View
            style={{
              paddingLeft: 20,
              flexDirection: 'column',
              width: 200,
            }}>
            <Text
              style={{
                alignSelf: 'flex-start',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Team1
            </Text>
            <TeamSelector
              teamList={this.props.navigation.getParam('teamList')}
              onSelect={value => this.setState({selectedTeam1: value})}
            />
            <Text
              style={{fontWeight: 'bold', fontSize: 15}}
              borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              Score:
            </Text>
            {/* <NumericInput
              value={this.state.scoreTeam1}
              onChange={value => this.setState({scoreTeam1: value})}
            /> */}
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="#2C3E50"
              onChangeText={scoreTeam1 => this.setState({scoreTeam1})}
              value={this.state.scoreTeam1}
              placeholder="0"
            />
          </View>
        </View>
        <View style={styles.teamSelector}>
          <View
            style={{
              paddingLeft: 20,
              flexDirection: 'column',
              width: 200,
            }}>
            <Text
              style={{
                alignSelf: 'flex-start',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Team2
            </Text>
            <TeamSelector
              teamList={this.props.navigation.getParam('teamList')}
              onSelect={value => this.setState({selectedTeam2: value})}
            />
            <Text
              style={{fontWeight: 'bold', fontSize: 15}}
              borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              Score:
            </Text>
            {/* <NumericInput
              value={this.state.scoreTeam1}
              onChange={value => this.setState({scoreTeam1: value})}
            /> */}
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="#2C3E50"
              onChangeText={scoreTeam2 => this.setState({scoreTeam2})}
              value={this.state.scoreTeam2}
              placeholder="0"
            />
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.sendResultToServer()}>
            <Text style={styles.buttonText}>Insert Game Result</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    // height: '100%',
    backgroundColor: '#5499C7',
    flex: 1,
    flexDirection: 'column',
  },
  teamSelectorWrapper: {
    //flex: 1,
    paddingTop: 20,
    textAlign: 'left',
    backgroundColor: '#5499C7',
    //justifyContent: 'space-between',
    flexDirection: 'row',

    paddingLeft: 20,
  },
  teamSelector: {
    //flex: 1,
    textAlign: 'left',
    backgroundColor: '#5499C7',
    alignItems: 'center',
    //justifyContent: 'space-between',
    paddingTop: 30,
    width: 200,
    flexDirection: 'row',
  },
  button: {
    width: '80%',
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    marginHorizontal: '10%',
    paddingVertical: 13,
    justifyContent: 'flex-end',
  },
  textInput: {
    textAlign: 'center',
    // marginLeft: 20,
    // marginTop: 60,
    // height: 40,
    // borderColor: '#5499C7',
    // borderWidth: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#AED6F1',
    textAlign: 'center',
  },
});

