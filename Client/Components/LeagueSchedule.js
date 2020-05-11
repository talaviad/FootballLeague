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
} from 'react-native';
import {
    Table,
    Row,
    Rows,
    Col,
} from 'react-native-table-component';
import { Picker } from '@react-native-community/picker';
import { Header } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBALS from '../Globals';

export default class LeagueSchedule extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
        setOfDays: { days: [[1, 'Sunday'], [2, 'Monday'], [3, 'Tuesday'], [4, 'Wednesday'], [5, 'Thuesday']], selected: [1, 'Sunday'] },
        setOfHours: { hours: [[1, '16:00-17:00'], [2, '17:00-18:00'], [3, '18:00-19:00'], [4, '19:00-20:00'], [5, '20:00-21:00'], [6, '21:00-22:00'], [7, '22:00-23:00'], [8, '23:00-24:00']], selected: [1, '16:00-17:00'] },
        currWeek: 1,
        thereIsSchedule: false,
    };
    this.load = this.load.bind(this);
    this.getWeeksTitles = this.getWeeksTitles.bind(this);
    this.createWeekGames = this.createWeekGames.bind(this);
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
        let response = await fetch('http://' + this.props.navigation.getParam('IP') + ':' + this.props.navigation.getParam('PORT') + '/?data=GetLeagueSchedule', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'GetLeagueSchedule',
            'Authorization': await AsyncStorage.getItem('token'),
          },
        });
        const json = await response.json();
        console.log('json.success: ' + json.success);
        if (json.success) {
            // Should add handle here
            this.setState({ thereIsSchedule: true, teamsNumbers: json.teamsNumbers, teamsConstraints: json.teamsConstraints, schedule: json.schedule, refereesSchedule: json.refereesSchedule });
        }
        else {
          // Should handle this
          console.log(json.error.msg);
        }
  
      } catch (err) {
        console.error(err);
      }
  }

    createWeekGames() {
        console.log('this.state.currWeek: ' + this.state.currWeek);
        console.log('this.state.schedule[this.currWeek-1]: ' + this.state.schedule[this.state.currWeek-1]);
        let week = this.state.schedule[this.state.currWeek-1];
        console.log('week: ' + week);
        let games = [];
        console.log('yyyyyyyy');
        console.log('week length: ' + week.length);
        for (let i=0; i<week.length; i++) {
            if (week[i][0] === 0) {
                console.log('nnnnn');
                for (let j=1; j<week[i].length; j++) {
                    console.log('week[' + i + ']: ' + week[i]);
                    let teamA = this.state.teamsConstraints[this.state.teamsNumbers[week[i][j]][0]].teamName;
                    let teamB = this.state.teamsConstraints[this.state.teamsNumbers[week[i][j]][1]].teamName;
                    console.log('teamA: ' + teamA + ', teamB: ' + teamB);
                    let game = '' +teamA + ' vs ' + teamB;
                    let day = this.state.setOfDays.days[Math.ceil((i+1)/(this.state.teamsConstraints[1].constraints.length))-1][1];
                    let dayIndex = this.state.setOfDays.days[Math.ceil((i+1)/(this.state.teamsConstraints[1].constraints.length))-1][0];
                    let temp = (i+1)%(this.state.teamsConstraints[1].constraints.length);
                    let hour = ((temp === 0)? this.state.setOfHours.hours[this.state.teamsConstraints[1].constraints.length-1][1] : this.state.setOfHours.hours[temp-1][1]);
                    let hourIndex = ((temp === 0)? this.state.setOfHours.hours[this.state.teamsConstraints[1].constraints.length-1][0] : this.state.setOfHours.hours[temp-1][0]);
                    let matchId = week[i][j];
                    let thereIsReferee = (this.state.refereesSchedule[this.state.currWeek-1][i][matchId] !== undefined)? true : false;
                    let referee = (thereIsReferee)? this.state.refereesSchedule[this.state.currWeek-1][i][matchId].referee : null;
                    console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmm');
                    console.log('this.state.refereesSchedule[this.state.currWeek-1]: ' + this.state.refereesSchedule[this.state.currWeek-1]);
                    console.log('matchId: ' + matchId);
                    console.log('i: ' + i);
                    console.log('thereIsReferee: ' + thereIsReferee);
                    console.log('referee: ' + referee);
                    games.push(
                        <View key={'week_' + i + '_game_' + j} style={styles.gameContainer}>
                            <View style={styles.gameDetailsContainer}>
                                <View style={styles.gameLine}>
                                    <Text style={styles.gameLineText}>{teamA + ' vs ' + teamB}</Text>
                                </View>
                                <View style={styles.gameLine}>
                                    <Text style={styles.gameLineText}>{day}</Text>
                                </View>
                                <View style={styles.gameLine}>
                                    <Text style={styles.gameLineText}>{hour}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 2, width: '100%', alignItems: 'center' }}>
                                <Text> {(thereIsReferee)? 'Referee - ' + referee : 'Referee - Not Set Yet'}</Text>
                            </View>
                        </View>
                    )
                }
            }
        }

        return games;
    }

    getWeeksTitles() {
        let weeksPickers = [];
        for (let i=0; i<this.state.schedule.length; i++) {
            let week = 'Week ' + (i+1);
            weeksPickers.push(
                <Picker.Item key={'add_picker_week_' + i}label={week} value={week} />
            )
        }
        let selectedValue = 'Week ' + this.state.currWeek; 
        return (
            <Picker
                selectedValue={selectedValue}
                style={{ width: '50%' }}
                onValueChange={(itemValue, itemIndex) => this.setState({currWeek: itemIndex+1 })}
            >
                {weeksPickers}
            </Picker>
        )
    }

    render() {
        if (!this.state.thereIsSchedule)
            return (
                <View>
                    <Text> blabla </Text>
                </View>
            )
        const weekTitles = this.getWeeksTitles();
        console.log('aaaaaaaaaaaaaaaaaaaaaaa1');
        const weekGames = this.createWeekGames();
        console.log('aaaaaaaaaaaaaaaaaaaaa2');
        return (
            <ScrollView style={styles.container}>
                <View style={styles.weekTitle}>
                    {weekTitles}
                </View>
                <View style={styles.gameTitlesContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.gameLineText}>Game</Text>
                    </View>
                    <View style={styles.gameLine}>
                        <Text style={styles.gameLineText}>Day</Text>
                    </View>
                    <View style={styles.gameLine}>
                        <Text style={styles.gameLineText}>Hour</Text>
                    </View>
                </View>
                <ScrollView style={{ height: Math.floor(GLOBALS.windowHeightSize*(6/10)), flexDirection: 'column' }}>
                    {weekGames}
                </ScrollView>
                <View style={{ height: Math.floor(GLOBALS.windowHeightSize/10), width: '100%', alignItems: 'center',  }}>         
                </View>
            </ScrollView>
        )
    }  
};


const styles = StyleSheet.create({
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
        height: Math.floor(GLOBALS.windowHeightSize/10),
        width: '100%', 
        borderBottomWidth: 2,
        borderColor: '#000000',
    },
    gameDetailsContainer: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: GLOBALS.colors.BackGround,
        width: '100%', 
    },
    weekTitle: {
        backgroundColor: GLOBALS.colors.BackGround,
        height: Math.floor(GLOBALS.windowHeightSize/10),
    },
    gameLineText: {
        color: '#000000',
        textAlign: 'center',
    },
    gameContainer: {
        flex: 1,
        flexDirection: 'column',
        height: Math.floor(GLOBALS.windowHeightSize/7),
        width: '100%',
        borderColor: '#000000',
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        //justifyContent: 'space-between',
    },
    gameLine: {
        flex: 1,
    },
    container: {
        backgroundColor: GLOBALS.colors.BackGround,
        height: '100%',
        width: '100%',
    },
});
