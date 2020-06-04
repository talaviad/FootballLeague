import React from 'react';
import {
  Button,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

import 'isomorphic-fetch';
import DatePicker from 'react-native-datepicker';
import {CustomPicker} from 'react-native-custom-picker';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/blue';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TeamSelector from './TeamSelector';

export default class InsertGame extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      date: '',
      team1Name: null,
      team2Name: null,
      team1Goals: '',
      team2Goals: '',
      team1ScorrersDic: [],
      team2ScorrersDic: [],
      selectedTeam1: false,
      selectedTeam2: false,
      score1Legal: true,
      score2Legal: true,
      isLoading: false,
      playersTeam1: [],
      playersTeam2: [],
    };
  }

  render() {
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={[styles.image, styles.container, {opacity: 0.8}]}>
        {/* <View style={styles.container}> */}
        <ScrollView>
          <DatePicker
            style={{
              paddingVertical: 20,
              flex: 1,
              width: '92%',
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
              dateTouchBody: {
                borderWidth: 0.65,
                borderRadius: 7.5,
                backgroundColor: '#0c4271',
              },
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
                color: 'white',
                fontSize: 19,
                fontFamily: 'sans',
                fontWeight: 'bold',
              },
              placeholderText: {
                color: 'white',
                fontSize: 19,
                fontFamily: 'sans-serif-condensed',
                fontStyle: 'italic',
                fontWeight: '600',
              },
            }}
            onDateChange={date => {
              this.setState({date: date});
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '70%'}}>
              {/* <Text style={{alignSelf: 'flex-start', fontSize: 16}}>Team1</Text> */}
              <TeamSelector
                selectedTitleStyle={{
                  //the style of select team text
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '60',
                }}
                style={{backgroundColor: '#0c4271'}}
                teamList={this.props.navigation.getParam('teamList')}
                onSelect={text => {
                  if (text !== null) {
                    this.setState({
                      team1Name: text,
                      team1Goals: '',
                      team1ScorrersDic: [],
                      selectedTeam1: true,
                    });
                    this.getPlayersList(1, text);
                  } else {
                    this.setState({
                      team1Name: text,
                      team1Goals: '',
                      team1ScorrersDic: [],
                      selectedTeam1: false,
                    });
                  }
                }}
              />
            </View>
            {/* <View style={{marginRight: 10, width: '20%'}}> */}
            {/* <Text style={{alignSelf: 'center'}}>score:</Text> */}
            <TextInput
              style={[
                styles.scoreTextInput,
                !this.state.score1Legal
                  ? {backgroundColor: 'red'}
                  : this.state.selectedTeam1
                  ? {backgroundColor: 'white'}
                  : {backgroundColor: '#a9a9a9'},
              ]}
              keyboardType="number-pad"
              value={this.state.team1Goals}
              editable={this.state.selectedTeam1}
              onChangeText={text => {
                if (!this.isNumericAndLegal(text)) {
                  this.setState({team1Goals: text});
                  this.setState({score1Legal: false});
                } else {
                  this.setState({score1Legal: true});
                  this.setState({team1Goals: text});
                  var arr = [];
                  for (var i = 0; i < text; i++) {
                    arr.push({
                      Name: '',
                      Team: this.state.team1Name,
                      Number: '',
                      Goals: 0,
                    });
                  }
                  this.setState({team1ScorrersDic: arr});
                }
              }}
            />
            <Icon
              name="soccer"
              size={35}
              style={{
                marginTop: '1%',
                width: '12%',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: '7.5%',
            }}>
            <View style={{width: '70%'}}>
              <TeamSelector
                selectedTitleStyle={{
                  //the style of select team text
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '60',
                }}
                style={{backgroundColor: '#0c4271'}}
                teamList={this.props.navigation.getParam('teamList')}
                onSelect={text => {
                  if (text !== null) {
                    this.setState({
                      team2Name: text,
                      team2Goals: '',
                      team2ScorrersDic: [],
                      selectedTeam2: true,
                    });
                    this.getPlayersList(2, text);
                  } else {
                    this.setState({
                      team2Name: text,
                      team2Goals: '',
                      team2ScorrersDic: [],
                      selectedTeam2: false,
                    });
                  }
                }}
              />
            </View>
            {/* <View style={{marginRight: 10, width: '20%'}}>
              <Text style={{alignSelf: 'center'}}>score:</Text> */}
            <TextInput
              style={[
                styles.scoreTextInput,
                ,
                !this.state.score2Legal
                  ? {backgroundColor: 'red'}
                  : this.state.selectedTeam2
                  ? {backgroundColor: 'white'}
                  : {backgroundColor: '#a9a9a9'},
              ]}
              keyboardType="numeric"
              value={this.state.team2Goals}
              editable={this.state.selectedTeam2}
              onChangeText={text => {
                if (!this.isNumericAndLegal(text)) {
                  this.setState({team2Goals: text});
                  this.setState({score2Legal: false});
                } else {
                  this.setState({score2Legal: true});
                  this.setState({team2Goals: text});
                  var arr = [];
                  for (var i = 0; i < text; i++) {
                    arr.push({
                      Name: '',
                      Team: this.state.team2Name,
                      Number: '',
                      Goals: 0,
                    });
                  }
                  this.setState({team2ScorrersDic: arr});
                }
              }}
            />
            <Icon
              name="soccer"
              size={35}
              style={{
                marginTop: '1%',
                width: '12%',
              }}
            />
          </View>
          {this.state.score1Legal && this.displayScorersFields(1)}
          {this.state.score2Legal && this.displayScorersFields(2)}
          <View style={styles.button}>
            <AwesomeButtonCartman
              onPress={() => {
                this.submitGame();
              }}
              type="anchor"
              //textColor="#FFF"
              textSize={18}
              backgroundColor="#123c69"
              paddingHorizontal={50}
              // backgroundActive="#123c69"
              // backgroundDarker="#123c69"
              //backgroundDarker="#123c69"
              //backgroundPlaceholder="#123c69"
              //borderColor="white"
              borderWidth={0.5}
              borderRadius={10}
              raiseLevel={4}>
              Submit
            </AwesomeButtonCartman>
            {/* <AwesomeButtonCartman
              onPress={() => {
                this.submitGame();
              }}
              type="primary"
              textColor="#FFF"
              textSize={18}
              backgroundColor="#0e4f88"
              paddingHorizontal={50}
              // backgroundActive="#123c69"
              // backgroundDarker="#123c69"
              backgroundDarker="#123c69"
              backgroundPlaceholder="#123c69"
              borderColor="white"
              borderWidth={0.5}
              borderRadius={10}
              raiseLevel={4}>
              Submit
            </AwesomeButtonCartman> */}
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {this.state.isLoading && (
              <ActivityIndicator color={'#fff'} size={80} />
            )}
          </View>
        </ScrollView>
        {/* </View> */}
      </ImageBackground>
    );
  }

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
      alert('catch');
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

  //part of the picker, the views of the options
  renderOption(settings) {
    const {item, getLabel} = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, {backgroundColor: item.color}]} />
          <Text
            style={{
              fontFamily: 'sans-serif-condensed',
              fontSize: 17,
              color: item.color,
              alignSelf: 'flex-start',
            }}>
            {getLabel(item)}
          </Text>
        </View>
      </View>
    );
  }

  initalizeState = () => {
    this.setState({
      date: '',
      team1Name: null,
      team2Name: null,
      team1Goals: '',
      team2Goals: '',
      team1ScorrersDic: [],
      team2ScorrersDic: [],
      selectedTeam1: false,
      selectedTeam2: false,
      score1Legal: true,
      score2Legal: true,
      isLoading: false,
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
          this.initalizeState();
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
    if (this.state.team1Name === null || this.state.team2Name === null) {
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
        this.state.team1ScorrersDic[i].Name === ''
      ) {
        alert('Please Fill All The Scorers Details');
        return;
      }
    }
    for (var i = 0; i < this.state.team2ScorrersDic.length; i++) {
      if (
        this.state.team2ScorrersDic[i].Number === '' ||
        this.state.team2ScorrersDic[i].Name === ''
      ) {
        alert('Please Fill All The Scorers Details');
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
              style={{
                marginTop: '2%',
                fontWeight: '700',
                fontSize: 20,
                fontStyle: 'sans-serif-medium',
              }}
              borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              {'Team ' + teamNum + ' Scorers:'}
            </Text>
          )}
          <View style={styles.columns}>
            <Text
              style={{
                fontStyle: 'sans-serif-medium',
                fontSize: 16,
                fontWeight: 'bold',
              }}
              borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              {i + 1 + '. '}
            </Text>
            <CustomPicker
              fieldTemplateProps={{
                defaultText: 'Select The Scorer',
                textStyle: {
                  color: 'black',
                  fontSize: 19,
                  fontFamily: 'sans',
                  // fontWeight: 'bold',
                  opacity: 3,
                },
              }}
              style={{
                color: 'black',
                fontSize: 19,
                fontFamily: 'sans',
                fontWeight: 'bold',
              }}
              options={
                teamNum === 1
                  ? this.state.playersTeam1
                  : this.state.playersTeam2
              }
              optionTemplate={this.renderOption}
              onValueChange={value => {
                switch (teamNum) {
                  case 1: {
                    if (value === null) {
                      this.state.team1ScorrersDic[i].Number = '';
                      this.state.team1ScorrersDic[i].Name = '';
                      return;
                    }
                    var arr = value.split(' ');
                    this.state.team1ScorrersDic[i].Number = arr[0].substring(1);
                    this.state.team1ScorrersDic[i].Name = arr[1] + ' ' + arr[2];
                    this.state.team1ScorrersDic[i].Goals = 1;
                    break;
                  }
                  case 2: {
                    if (value === null) {
                      this.state.team2ScorrersDic[i].Number = '';
                      this.state.team2ScorrersDic[i].Name = '';
                      return;
                    }
                    var arr = value.split(' ');
                    this.state.team2ScorrersDic[i].Number = arr[0].subString(1);
                    this.state.team2ScorrersDic[i].Name = arr[1] + arr[2];
                    this.state.team2ScorrersDic[i].Goals = 1;
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

  isNumericAndLegal = value => {
    return /^\d+$/.test(value) && parseInt(value) < 25;
  };

  isNumeric = value => {
    return /^\d+$/.test(value);
  };

  isLegalName = value => {
    var reg = new RegExp('^[a-zA-Z]+([\\s]+[a-zA-Z]+)*$');
    return reg.test(value);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEF2F1',
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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

  scorerField: {
    marginRight: 10,
    width: 50,
  },
  teamSelector: {marginRight: 10, width: 200},
  ageField: {
    width: 60,
  },
  button: {
    alignSelf: 'center',
    marginTop: '10%',
  },
  error: {
    marginTop: 10,
  },

  scoreTextInput: {
    height: '90%',
    fontSize: 19,

    borderWidth: 0.8,
    borderColor: 'black',
    width: '15%',
    borderRadius: 10,
    textAlign: 'center',
    marginLeft: '2%',
    color: 'black',
  },
  errorMsg: {
    color: 'red',
  },
  optionContainer: {
    padding: 10,
    borderBottomColor: 'grey',
  },

  box: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
