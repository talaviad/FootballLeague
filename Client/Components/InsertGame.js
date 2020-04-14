import React from 'react';
import {
  Button,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import 'isomorphic-fetch';
import DatePicker from 'react-native-datepicker';
import TeamSelector from './TeamSelector';

export default class InsertGame extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      date: '',
      team1Name: '',
      team2Name: '',
      team1Goals: '',
      team2Goals: '',
      team1ScorrersDic: [],
      team2ScorrersDic: [],
      selectedTeam1: false,
      selectedTeam2: false,
      score1Legal: true,
      score2Legal: true,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
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
          <View style={{flexDirection: 'row', width: 200}}>
            <View style={{marginRight: 10, width: 200}}>
              <Text style={{alignSelf: 'flex-start'}}>Team1</Text>
              <TeamSelector
                teamList={this.props.navigation.getParam('teamList')}
                onSelect={text =>
                  this.setState({
                    team1Name: text,
                    team1Goals: '',
                    team1ScorrersDic: [],
                    selectedTeam1: true,
                  })
                }
              />
            </View>
            <View style={{marginRight: 10, width: 200}}>
              <Text style={{alignSelf: 'flex-start'}}>score:</Text>
              <TextInput
                style={[
                  styles.scoreTextInput,
                  !this.state.score1Legal
                    ? {backgroundColor: 'red'}
                    : this.state.selectedTeam1
                    ? {backgroundColor: 'white'}
                    : {backgroundColor: '#c0c0c0'},
                ]}
                keyboardType="number-pad"
                placeholder="0"
                value={this.state.team1Goals}
                editable={this.state.selectedTeam1}
                onChangeText={text => {
                  if (!this.isNumeric(text)) {
                    this.setState({score1Legal: false});
                  } else {
                    this.setState({score1Legal: true});
                  }
                  this.setState({team1Goals: text});
                  var arr = [];
                  for (var i = 0; i < text; i++) {
                    arr.push({
                      Name: [],
                      Team: this.state.team1Name,
                      Number: '',
                      Goals: 0,
                    });
                  }
                  this.setState({team1ScorrersDic: arr});
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', width: 200}}>
            <View style={{marginRight: 10, width: 200}}>
              <Text style={{alignSelf: 'flex-start'}}>Team2</Text>
              <TeamSelector
                teamList={this.props.navigation.getParam('teamList')}
                onSelect={text => {
                  this.setState({
                    team2Name: text,
                    team2Goals: '',
                    team2ScorrersDic: [],
                    selectedTeam2: true,
                  });
                }}
              />
            </View>
            <View style={{marginRight: 10, width: 200}}>
              <Text style={{alignSelf: 'flex-start'}}>score:</Text>
              <TextInput
                style={[
                  styles.scoreTextInput,
                  ,
                  !this.state.score2Legal
                    ? {backgroundColor: 'red'}
                    : this.state.selectedTeam2
                    ? {backgroundColor: 'white'}
                    : {backgroundColor: '#c0c0c0'},
                ]}
                keyboardType="numeric"
                placeholder="0"
                value={this.state.team2Goals}
                editable={this.state.selectedTeam2}
                onChangeText={text => {
                  if (!this.isNumeric(text)) {
                    this.setState({score2Legal: false});
                  } else {
                    this.setState({score2Legal: true});
                  }
                  this.setState({team2Goals: text});
                  var arr = [];
                  for (var i = 0; i < text; i++) {
                    arr.push({
                      Name: [],
                      Team: this.state.team2Name,
                      Number: '',
                      Goals: 0,
                    });
                  }
                  this.setState({team2ScorrersDic: arr});
                }}
              />
            </View>
          </View>
          {this.displayScorersFields(1)}
          {this.displayScorersFields(2)}
          <View style={styles.button}>
            <Button
              onPress={() => {
                this.submitGame();
              }}
              title="Submit"
              color="#000080"
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  async sendResultToServer() {
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
            selectedTeam1: this.state.team1Name,
            selectedTeam2: this.state.team2Name,
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

  async updateScorerTable() {
    let response = fetch(
      'http://' + this.props.navigation.getParam('IP') + ':3000/',
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

  submitGame = () => {
    if (this.state.date === '') {
      alert('Please Select The Date');
      return;
    }
    if (this.state.team1Name === '' || this.state.team2Name === '') {
      alert('Please Select The Teams');
      return;
    }
    if (this.state.team1Name === this.state.team2Name) {
      alert('Please Select Different Teams');
      return;
    }
    if (this.state.team1Goals === '' || this.state.team2Goals === '') {
      alert('Please Fill The Teams Score');
      return;
    }

    if (!this.state.score1Legal || !this.state.score2Legal) {
      alert('Illeagl Score');
      return;
    }
    for (var i = 0; i < this.state.team1ScorrersDic.length; i++) {
      if (
        this.state.team1ScorrersDic[i].Number === '' ||
        this.state.team1ScorrersDic[i].Name.length === 0
      ) {
        alert('Please Fill All The Scorers Details');
        return;
      }
      if (!this.isNumeric(this.state.team1ScorrersDic[i].Number)) {
        alert('Illegal scorer details');
        return;
      }
    }
    for (var i = 0; i < this.state.team2ScorrersDic.length; i++) {
      if (
        this.state.team2ScorrersDic[i].Number === '' ||
        this.state.team2ScorrersDic[i].Name.length === 0
      ) {
        alert('Please Fill All The Scorers Details');
        return;
      }
      if (!this.isNumeric(this.state.team2ScorrersDic[i].Number)) {
        alert('Illegal scorer details');
        return;
      }
    }
    this.sendResultToServer(); //Inside this function I call the updateScorerTable()
  };

  displayScorersFields = teamNum => {
    //This function called twice, with teamNum=1 and teamNum=2
    return eval('this.state.team' + teamNum + 'ScorrersDic').map((x, i) => {
      return (
        <View>
          {i === 0 && (
            <Text
              style={{fontWeight: 'bold', fontSize: 20}}
              borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              {'Team ' + teamNum + ' Scorers:'}
            </Text>
          )}
          <View style={styles.columns}>
            <Text
              style={{fontWeight: 'bold', fontSize: 15}}
              borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              {i + 1 + '. '}
            </Text>

            <TextInput
              style={{backgroundColor: 'white', borderWidth: 0.6}}
              keyboardType="numeric"
              placeholder="#Shirt"
              onChangeText={text => {
                switch (teamNum) {
                  case 1: {
                    this.state.team1ScorrersDic[i].Number = text;
                    this.state.team1ScorrersDic[i].Goals = +1;

                    break;
                  }
                  case 2: {
                    this.state.team2ScorrersDic[i].Number = text;
                    this.state.team2ScorrersDic[i].Goals = +1;
                    break;
                  }
                }
              }}
            />
            <TextInput
              style={{
                backgroundColor: 'white',
                borderWidth: 0.6,
                width: 100,
                marginLeft: 10,
              }}
              placeholder="Name"
              onChangeText={text => {
                //To convert the first letter of the name to Capital letter
                var name = text.replace(/\b\w/g, l => l.toUpperCase());
                switch (teamNum) {
                  case 1: {
                    this.state.team1ScorrersDic[i].Name[0] = name;
                    break;
                  }
                  case 2: {
                    this.state.team2ScorrersDic[i].Name[0] = name;
                    break;
                  }
                }
              }}
            />
          </View>
        </View>
      );
    });
  };

  isNumeric = value => {
    return /^\d+$/.test(value);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5499C7',
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  row: {
    marginBottom: 20,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  field: {
    marginRight: 10,
  },
  fieldNumber: {
    marginRight: 10,
    width: 60,
    height: 40,
  },
  fieldName: {
    marginRight: 10,
    width: 100,
    height: 40,
  },
  scorerField: {
    marginRight: 10,
    width: 50,
  },
  teamSelector: {marginRight: 10, width: 200},
  ageField: {
    width: 60,
  },
  button: {
    width: 80,
    marginTop: 15,
  },
  error: {
    marginTop: 10,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
  },
  scoreTextInput: {
    borderWidth: 0.6,
    width: 50,
    borderRadius: 10,
    textAlign: 'center',
  },
  errorMsg: {
    color: 'red',
  },
});
