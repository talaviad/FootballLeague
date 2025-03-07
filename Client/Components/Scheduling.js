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


export default class Scheduling extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        let hour = 16;
        let nextHour = 17;
        let numOfDays = 6;
        let numOfHours = 8;
        this.initializeHoursData = this.initializeHoursData.bind(this);
        this.state = {
            tableHead: ['', 'S', 'M', 'T', 'W', 'T'],
            schedule: [],
            currWeek: 1,
            setOfDays: { days: [[1, 'Sunday'], [2, 'Monday'], [3, 'Tuesday'], [4, 'Wednesday'], [5, 'Thuesday']], selected: [1, 'Sunday'] },
            setOfHours: { hours: [[1, '16:00-17:00'], [2, '17:00-18:00'], [3, '18:00-19:00'], [4, '19:00-20:00'], [5, '20:00-21:00'], [6, '21:00-22:00'], [7, '22:00-23:00'], [8, '23:00-24:00']], selected: [1, '16:00-17:00'] },
            isHourDayModalVisible: false,
            isDeleteModalVisible: false,
            isAddModalVisible: false,
            teamVsTeamId: null,
            isChangeIsOn: false,
            dayToBeChanged: 1,
            hourToBeChanged: 1,
            gamesToBeCompleted: [],
            gameToBeAdded: new Array(2).fill(0),
            isScheduleSet: 'notSet', // Can be - 'notSet/inProcess/set
            hours: this.initializeHoursData(numOfDays, numOfHours, hour, nextHour),
            showTeamsConstraints: false,
        };
        this.load = this.load.bind(this)
        this.scheduling = this.scheduling.bind(this);
        this.createWeekGames = this.createWeekGames.bind(this);
        this.changeDayOrHour = this.changeDayOrHour.bind(this)
        this.deleteGame = this.deleteGame.bind(this);
        this.getWeeksTitles = this.getWeeksTitles.bind(this);
        this.createDayHourModal = this.createDayHourModal.bind(this);
        this.createDeleteModal = this.createDeleteModal.bind(this);
        this.confirmOrCancelChange = this.confirmOrCancelChange.bind(this);
        this.createAddModal = this.createAddModal.bind(this);
        this.getScheduling = this.getScheduling.bind(this);
        this.sendChangeToServer = this.sendChangeToServer.bind(this);
        this.createTeamsConstraintsView = this.createTeamsConstraintsView.bind(this);
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

    async getScheduling() {
        try {
            let response = await fetch('http://' + this.props.navigation.getParam('IP') + ':' + this.props.navigation.getParam('PORT') + '/?data=GetManagerSchedule', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Football-Request': 'GetManagerSchedule',
                'Authorization': await AsyncStorage.getItem('token'),
              },
            });
            const json = await response.json();
            console.log('json.success: ' + json.success);
            if (json.success) {
              if (!json.schedule) {
                this.setState({ teamsConstraints: json.teamsConstraints });
                return;
              }
              this.setState({ isScheduleSet: 'set', schedule: json.schedule, gamesToBeCompleted: json.gamesToBeCompleted, teamsNumbers: json.teamsNumbers, teamsConstraints: json.teamsConstraints });
            }
            else {
              console.log(json.error.msg);
              this.setState({ isScheduleSet: 'notSet' });
            }
      
          } catch (err) {
            console.error(err);
            this.setState({ isScheduleSet: 'notSet' });
          }
    }

    async scheduling() {
        try {
            let response = await fetch('http://' + this.props.navigation.getParam('IP') + ':' + this.props.navigation.getParam('PORT') + '/?data=StartScheduling', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Football-Request': 'StartScheduling',
                'Authorization': await AsyncStorage.getItem('token'),
              },
            });
            const json = await response.json();
            if (json.success) {
              await AsyncStorage.setItem('isSchedule', 'true');
              this.setState({ data: json.pitchConstraints, isScheduleSet: 'set', schedule: json.schedule, teamsNumbers: json.teamsNumbers, teamsConstraints: json.teamsConstraints });
            }
            else {
              console.log(json.error.msg);
              this.setState({ isScheduleSet: 'notSet' });
            }
      
          } catch (err) {
            console.error(err);
            this.setState({ isScheduleSet: 'notSet' });
          }
    }

    async componentDidMount() {
        this.load()
        this.focusListener = this.props.navigation.addListener('didFocus', this.load)
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    async load() {
        console.log('load(): ' + 'going to make/get schedule');
        let isSchedule = await AsyncStorage.getItem('isSchedule');
        console.log('load(): ' + 'isSchedule - ' + isSchedule);
        this.getScheduling();
    }

    changeDayOrHour(teamVsTeamId, dayToBeChanged, hourToBeChanged) {
        let isHourDayModalVisible = this.state.isHourDayModalVisible;
        this.setState({ isHourDayModalVisible: !isHourDayModalVisible, teamVsTeamId:teamVsTeamId, dayToBeChanged: dayToBeChanged, hourToBeChanged: hourToBeChanged})
    }

    confirmOrCancelDelete(mode) {
        let changeDetails = {};
        if (mode === 1) { // To delete
            let day =  this.state.dayToBeChanged;
            let hour = this.state.hourToBeChanged;
            let time = ((day-1)*this.state.teamsConstraints[1].constraints.length)+(hour-1);;
            changeDetails.change = 'DeleteGame'
            changeDetails.day = this.state.setOfDays.days[day-1][1]
            changeDetails.hour = this.state.setOfHours.hours[hour-1][1];
            changeDetails.matchId = this.state.teamVsTeamId;

            for (let i=1; i<this.state.schedule[this.state.currWeek-1][time].length; i++) {
                if (this.state.schedule[this.state.currWeek-1][time][i] === this.state.teamVsTeamId) {
                    this.state.schedule[this.state.currWeek-1][time].splice(i, 1);
                    if (this.state.schedule[this.state.currWeek-1][time].length === 1)
                        this.state.schedule[this.state.currWeek-1][time] = [1];
                }
            }

            this.state.gamesToBeCompleted.push(this.state.teamVsTeamId);
            console.log('this.state.gamesToBeCompleted: ' + this.state.gamesToBeCompleted);
            // Updating the server
            this.sendChangeToServer(this.state.schedule, changeDetails);
        }

        this.setState({ isDeleteModalVisible: false });
    }

    confirmOrCancelChange(mode) {
        let oldDay = this.state.dayToBeChanged;
        let oldHour = this.state.hourToBeChanged;
        let oldTime = ((oldDay-1)*this.state.teamsConstraints[1].constraints.length)+(oldHour-1);
        
        console.log('oldDay: ' + oldDay);
        console.log('oldHour: ' + oldHour);
        console.log('oldTime: ' + oldTime);

        let newDay = this.state.setOfDays.selected[0];
        let newHour = this.state.setOfHours.selected[0];
        let newTime = ((newDay-1)*this.state.teamsConstraints[1].constraints.length)+(newHour-1);
        console.log('changeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
        console.log('newDay: ' + newDay);
        console.log('newHour: ' + newHour);
        console.log('newTime: ' + newTime);

        console.log('newDay: ' + this.state.setOfDays.selected[1]);
        console.log('newHour: ' + this.state.setOfHours.selected[1]);

        let changeDetails = {};
        changeDetails.change = 'ChangeGame'
        changeDetails.day = this.state.setOfDays.selected[1];
        changeDetails.hour = this.state.setOfHours.selected[1];
        changeDetails.matchId = this.state.teamVsTeamId;

        if (mode === 0) {

            if (this.state.schedule[this.state.currWeek-1][newTime][0] === 0) {
                this.setState({ isChangeIsOn: true });
            }
            else {
                this.state.schedule[this.state.currWeek-1][newTime] = [0, this.state.teamVsTeamId];
                for (let i=1; i<this.state.schedule[this.state.currWeek-1][oldTime].length; i++) {
                    if (this.state.schedule[this.state.currWeek-1][oldTime][i] === this.state.teamVsTeamId) {
                        this.state.schedule[this.state.currWeek-1][oldTime].splice(i, 1);
                        if (this.state.schedule[this.state.currWeek-1][oldTime].length === 1)
                            this.state.schedule[this.state.currWeek-1][oldTime] = [1];
                    }
                }

                // Updating the server
                this.sendChangeToServer(this.state.schedule, changeDetails);
                this.setState({ isHourDayModalVisible: false, isChangeIsOn: false })
            }
        }
        else if (mode === 1) {
            let schedule = this.state.schedule;
            schedule[this.state.currWeek-1][newTime].push(this.state.teamVsTeamId);
            console.log('schedule[this.currWeek-1]: ' + schedule[this.currWeek-1]);

            for (let i=1; i<schedule[this.state.currWeek-1][oldTime].length; i++) {
                if (schedule[this.state.currWeek-1][oldTime][i] === this.state.teamVsTeamId) {
                    schedule[this.state.currWeek-1][oldTime].splice(i, 1);
                    if (schedule[this.state.currWeek-1][oldTime].length === 1)
                        schedule[this.state.currWeek-1][oldTime] = [1];
                    break;
                }
            }

            // Updating the server
            this.sendChangeToServer(schedule, changeDetails);
            this.setState({ isHourDayModalVisible: false, isChangeIsOn: false, schedule: schedule });
        }
        else if (mode === 2) {
            this.setState({ isChangeIsOn: false });
        }
    }

    createDeleteModal() {
        return (
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isDeleteModalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}
            >
                    <View style={{ alignItems: 'center', height: '40%', width: '100%', backgroundColor: '#14B1F8' }}>
                        <Text style={{ height: '60%', fontSize: 20 }}>Are you sure you want to delete that game?</Text>
                        <TouchableOpacity style={{ backgroundColor: '#1BA446', borderRadius: 25, height: '20%', width: '60%' }} onPress={() =>this.confirmOrCancelDelete(1)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#D91D1D', borderRadius: 25, height: '20%', width: '60%'  }} onPress={() =>this.confirmOrCancelDelete(2)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>No</Text>
                        </TouchableOpacity>
                    </View>
            </Modal> 
        )
    }

    createDayHourModal() {
        let daysPickers = [];
        for (let i=0; i<this.state.setOfDays.days.length; i++) {
            let day = '' + this.state.setOfDays.days[i][1];
            daysPickers.push(
                <Picker.Item key={'add_picker_change_day_' + i} label={day} value={day} />
            )
        }

        let hoursPickers = [];
        for (let i=0; i<this.state.setOfHours.hours.length; i++) {
            let hour = '' + this.state.setOfHours.hours[i][1];
            hoursPickers.push(
                <Picker.Item key={'add_picker_change_hour_' + i} label={hour} value={hour} />
            )
        }

        return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isHourDayModalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}
                >
                    {console.log('this.state.setOfDays.selected[0]: ' + this.state.setOfDays.selected[0])}
                    {console.log('this.state.setOfDays.selected[1]: ' + this.state.setOfDays.selected[1])}
                    {console.log('this.state.setOfHours.selected[0]: ' + this.state.setOfHours.selected[0])}
                    {console.log('this.state.setOfHours.selected[1]: ' + this.state.setOfHours.selected[1])}
                    { (!this.state.isChangeIsOn)?
                    <View style={{ alignItems: 'center', marginLeft: 0, height: '40%', width: '100%', backgroundColor: GLOBALS.colors.ModalBackGround }}> 
                        <View style={{ width: '60%', alignItems: 'center', borderBottomWidth: 2 }}>
                            <Text> Pick day </Text>
                            <Picker
                                selectedValue={'' + this.state.setOfDays.selected[1]}
                                style={{ width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => { 
                                    let setOfDays = { days: this.state.setOfDays.days, selected: [itemIndex+1, itemValue]};
                                    this.setState({setOfDays: setOfDays })}}
                            >
                                {daysPickers}
                            </Picker>
                        </View>
                        <View style={{ width: '60%', alignItems: 'center' }}>
                            <Text> Pick hour </Text>
                            <Picker
                                selectedValue={'' + this.state.setOfHours.selected[1]}
                                style={{ width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => { 
                                let setOfHours = { hours: this.state.setOfHours.hours, selected: [itemIndex+1, itemValue]};
                                this.setState({setOfHours: setOfHours })}}
                            >
                                {hoursPickers}
                            </Picker>
                        </View>         
                        <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: '#D91D1D', borderRadius: 25, height: '20%', width: '60%' }} onPress={() =>this.confirmOrCancelChange(0)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Change</Text>
                        </TouchableOpacity> 
                    </View>
                        :
                    <View style={{ alignItems: 'center', marginLeft: 0, height: '40%', width: '100%', backgroundColor: GLOBALS.colors.ModalBackGround }}> 
                        <Text style={{ color: '#F81422', fontSize: 20, height: '60%' }}>
                        Warning: There are already teams which play at that time, are you sure you want to change?</Text>
                        <TouchableOpacity style={{ backgroundColor: '#1BA446', borderRadius: 25, height: '20%', width: '60%' }} onPress={() =>this.confirmOrCancelChange(1)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#D91D1D', borderRadius: 25, height: '20%', width: '60%' }} onPress={() =>this.confirmOrCancelChange(2)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>No</Text>
                        </TouchableOpacity>
                    </View>
                    }
            </Modal>
        )
    }

    deleteGame(teamVsTeamId, dayToBeDeleted, hourToBeDeleted) {
        let isDeleteModalVisible = this.state.isDeleteModalVisible;
        this.setState({ isDeleteModalVisible: !isDeleteModalVisible, teamVsTeamId:teamVsTeamId, dayToBeChanged: dayToBeDeleted, hourToBeChanged: hourToBeDeleted });
    }

    createWeekGames() {
        console.log('this.state.currWeek: ' + this.state.currWeek);
        console.log('this.state.schedule[this.currWeek-1]: ' + this.state.schedule[this.state.currWeek-1]);
        let week = this.state.schedule[this.state.currWeek-1];
        console.log('week: ' + week);
        let games = [];
        games.push(
            <View key={'create_modals'}>
                {this.createDayHourModal()}
                {this.createDeleteModal()}
                {this.createAddModal()}
            </View>
        )
        console.log('yyyyyyyy');
        console.log('week length: ' + week.length);
        console.log('this.state.teamsConstraints[1].constraints.length: ' + this.state.teamsConstraints[1].constraints.length);
        console.log('this.state.teamsConstraints[1].constraints[0].length: ' + this.state.teamsConstraints[1].constraints[0].length);
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
                            <View style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: GLOBALS.colors.BackGround }}>
                                <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: GLOBALS.colors.Neutral, borderRadius: 25, width: '30%'}} onPress={() => this.changeDayOrHour(week[i][1], dayIndex, hourIndex)}>
                                        <Text style={{textAlign: 'center', color: '#FCFAFA'}}> Change </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: GLOBALS.colors.Negative, borderRadius: 25, width: '30%'}} onPress={() => this.deleteGame(week[i][j], dayIndex, hourIndex)}>
                                        <Text style={{textAlign: 'center', color: '#FCFAFA'}}> Delete </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            }
        }

        return games;
    }

    addGame() {
        this.setState({ isAddModalVisible: true })
    }

    confirmOrCancelAdd(mode) {
        let newDay = this.state.setOfDays.selected[0];
        let newHour = this.state.setOfHours.selected[0];
        let newTime = ((newDay-1)*this.state.teamsConstraints[1].constraints.length)+(newHour-1);

        console.log('newDay: ' + newDay);
        console.log('newHour: ' + newHour);
        console.log('newTime: ' + newTime);
        console.log('newDay: ' + this.state.setOfDays.selected[1]);
        console.log('newHour: ' + this.state.setOfHours.selected[1]);

        if (mode === 1) {
            // Do some add work here
            let matchToAdd = (this.state.gameToBeAdded === '')? this.state.gamesToBeCompleted[0] : this.state.gameToBeAdded[1];
            if (this.state.schedule[this.state.currWeek-1][newTime][0] === 0)
                this.setState({ isChangeIsOn: true });
            else {
                let schedule = this.state.schedule;
                schedule[this.state.currWeek-1][newTime] = [0, matchToAdd];
                this.state.gamesToBeCompleted.splice(0, 1);
                let changeDetails = {
                    change: 'AddGame',
                    matchId: matchToAdd,
                    week: this.state.currWeek,
                    day: this.state.setOfDays.selected[1], 
                    hour: this.state.setOfHours.selected[1],
                }
                //updating the server
                this.sendChangeToServer(schedule, changeDetails);
                this.setState({ isAddModalVisible: false, isChangeIsOn: false, gameToBeAdded: [0, 0] })
            }
        }
        else if (mode === 2)
            this.setState({ isAddModalVisible: false, gameToBeAdded: [0, 0] })
        else if (mode === 3) { // To add
            let schedule = this.state.schedule;
            schedule[this.state.currWeek-1][newTime].push(this.state.gameToBeAdded[1]);
            this.state.gamesToBeCompleted.splice(0, 1);
            let changeDetails = {
                change: 'AddGame',
                matchId: this.state.gameToBeAdded[1],
                week: this.state.currWeek,
                day: this.state.setOfDays.selected[1], 
                hour: this.state.setOfHours.selected[1],
            }
            //updating the server
            this.sendChangeToServer(schedule, changeDetails);
            this.setState({ isAddModalVisible: false, isChangeIsOn: false, gameToBeAdded: [0, 0] })
        }
        else if (mode === 4) // Not to add
            this.setState({ isAddModalVisible: true, isChangeIsOn: false })
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
                  'Authorization': await AsyncStorage.getItem('token'),
                },
                body: JSON.stringify({ 
                    schedule: newSchedule, 
                    gamesToBeCompleted: this.state.gamesToBeCompleted, 
                    teamsNumbers: this.state.teamsNumbers, 
                    teamsConstraints: this.state.teamsConstraints,
                    changeDetails: changeDetails,
                }),
              },
            );
            const json = await response.json();
            if (json.success) {
                console.log('action: ' + changeDetails.change + ' was updated in the server');
                alert('action: ' + changeDetails.change + ' was updated in the server')
            }
            else
                alert(json.error.msg)
          } catch (err) {
            console.error(err);
          }
    }

    createAddModal() {
        console.log('ooooooo1');
        let games = []
        for (let i=0; i<this.state.gamesToBeCompleted.length; i++) {
            let teamANumber = this.state.teamsNumbers[this.state.gamesToBeCompleted[i]][0];
            let teamBNumber = this.state.teamsNumbers[this.state.gamesToBeCompleted[i]][1];
            let currGame = '' + this.state.teamsConstraints[teamANumber].teamName + ' vs ' + this.state.teamsConstraints[teamBNumber].teamName;
            games.push(
                <Picker.Item key={'add_picker_game_' + i} label={currGame} value={currGame} />
            )
        }
        console.log('ooooooo123');

        let daysPickers = [];
        for (let i=0; i<this.state.setOfDays.days.length; i++) {
            let day = '' + this.state.setOfDays.days[i][1];
            daysPickers.push(
                <Picker.Item key={'add_picker_day_' + i} label={day} value={day} />
            )
        }

        let hoursPickers = [];
        for (let i=0; i<this.state.setOfHours.hours.length; i++) {
            let hour = '' + this.state.setOfHours.hours[i][1];
            hoursPickers.push(
                <Picker.Item key={'add_picker_hour_' + i} label={hour} value={hour} />
            )
        }

        let gameToBeAdded = [...this.state.gameToBeAdded];

        if (this.state.gameToBeAdded[0] === 0 && this.state.gamesToBeCompleted.length !== 0) {
            let teamA = this.state.teamsNumbers[this.state.gamesToBeCompleted[0]][0];
            let teamB = this.state.teamsNumbers[this.state.gamesToBeCompleted[0]][1];
            let match = '' + teamA + ' vs ' + teamB;
            this.state.gameToBeAdded = [match, this.state.gamesToBeCompleted[0]];
            gameToBeAdded = [match, this.state.gamesToBeCompleted[0]];
            console.log('this.state.gameToBeAdded: ' + this.state.gameToBeAdded);
            console.log('gameToBeAdded: ' + gameToBeAdded);
        }

        let hourSelectedValue = '' + this.state.setOfHours.selected[1];
        console.log('ooooooo2');

        return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isAddModalVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            }}
            >
                <View style={{ height: '50%', width: '100%', backgroundColor: '#14B1F8' }}>
                    { (!this.state.isChangeIsOn)? 
                        (this.state.gamesToBeCompleted.length !== 0)? 
                        <View style={{ flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', flex: 2, width: '60%', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
                                <Text style={{ flex: 1 }}>Pick game</Text>
                                <Picker
                                    selectedValue={gameToBeAdded[0]}
                                    style={{ width: '100%' }}
                                    onValueChange={(itemValue, itemIndex) => { 
                                        this.setState({gameToBeAdded: [itemValue, this.state.gamesToBeCompleted[itemIndex]] })}}
                                    style={{ flex: 1, width: '100%'}}
                                >
                                    {games}
                                </Picker>
                            </View>
                            <View style={{ alignItems: 'center', flex: 2, width: '60%', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
                                <Text style={{ flex: 1 }}>Pick day</Text>
                                <Picker
                                    selectedValue={'' + this.state.setOfDays.selected[1]}
                                    onValueChange={(itemValue, itemIndex) => { 
                                        let setOfDays = { days: this.state.setOfDays.days, selected: [itemIndex+1, itemValue]};
                                        this.setState({setOfDays: setOfDays })}}
                                    style={{ flex: 1, width: '100%'}}
                                >
                                    {daysPickers}
                                </Picker>
                            </View>
                            <View style={{ alignItems: 'center', flex: 2, width: '60%', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
                                <Text style={{ flex: 1 }}>Pick hour</Text>
                                <Picker
                                    selectedValue={hourSelectedValue}
                                    onValueChange={(itemValue, itemIndex) => { 
                                        let setOfHours = { hours: this.state.setOfHours.hours, selected: [itemIndex+1, itemValue]};
                                        this.setState({setOfHours: setOfHours })}}
                                    style={{ flex: 1, width: '100%' }}
                                >
                                    {hoursPickers}
                                </Picker>
                            </View>
                            <View style={{ flex: 2 }}></View>
                            <TouchableOpacity style={{ justifyContent: 'center', flex: 1, width: '60%', flex: 1, backgroundColor: '#11B23C', borderRadius: 25}} onPress={() =>this.confirmOrCancelAdd(1)}>
                                    <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ justifyContent: 'center', flex: 1, width: '60%', flex: 1, backgroundColor: '#D91D1D', borderRadius: 25}} onPress={() =>this.confirmOrCancelAdd(2)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Close</Text>
                            </TouchableOpacity>

                        </View>
                            :
                        <View style={{ flexDirection: 'column', height: '100%', width: '100%'}}>
                            <Text style= {{ flex: 3 }}>All the games are already been shecduled</Text>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#D91D1D', borderRadius: 25}} onPress={() =>this.confirmOrCancelAdd(2)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        :
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={{ color: '#F81422', fontSize: 20, height: '70%' }}>Warning: There are already teams which play at that time, are you sure you want to change?</Text>
                        <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: '#1BA446', borderRadius: 25, height: '15%', width: '60%' }} onPress={() =>this.confirmOrCancelAdd(3)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: '#D91D1D', borderRadius: 25, height: '15%', width: '60%' }} onPress={() =>this.confirmOrCancelAdd(4)}>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}>No</Text>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
            </Modal> 
        )
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

    createTeamsConstraintsView() {
        console.log('uuuuuuuuuuuuuuuu');
        const teamsCViews = [];
        const teamsConstraints = this.state.teamsConstraints;
        for (let teamNum in teamsConstraints) {
            console.log('teamNum: ' + teamNum);
            let teamView = [];
            let teamName = this.state.teamsConstraints[teamNum].teamName;
            teamView.push(
                <View key={teamNum + '_tableTitle'} style={{ width: '100%', flex: 1, flexDirection: 'column', backgroundColor: GLOBALS.colors.BackGround, alignItems: 'center'}}>
                    <View style={{flex: 1, width: '100%'}}>
                        <Text style={{color: '#AED6F1', height: '100%', width: '100%', textAlign: 'center'}}>{teamName}</Text>
                    </View>
                    <Table borderStyle={{borderWidth: 1}} style={{ width: '100%', paddingTop: 10, flex: 1 }}>
                        <Row
                        data={this.state.tableHead}
                        flexArr={[30, 30, 30, 30, 30, 30]}
                        style={styles.head}
                        textStyle={styles.textHead}
                        />
                    </Table>
                </View>
            )
            for (let j=0; j<this.state.hours.length; j++) {
                console.log('this.state.hours['+j+'][0]: ' + this.state.hours[j][0]);
                teamView.push(
                    <View key={j + '_hour'} style={styles.TeamViewContainer}>
                        <View style={styles.TeamsTytle}>
                            <Text style={{color: '#AED6F1', height: '100%', width: '100%', textAlign: 'center'}}>{this.state.hours[j][0]}</Text>
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][0]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
                            <TouchableOpacity>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][1]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
                            <TouchableOpacity>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
                            </TouchableOpacity>                      
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][2]? GLOBALS.colors.Positive: GLOBALS.colors.Negative }}>
                            <TouchableOpacity>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
                            </TouchableOpacity>                     
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][3]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
                            <TouchableOpacity>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
                            </TouchableOpacity>
                       </View>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000000', backgroundColor: teamsConstraints[teamNum].constraints[j][4]? GLOBALS.colors.Positive : GLOBALS.colors.Negative }}>
                            <TouchableOpacity>
                                <Text style={{textAlign: 'center', color: '#FCFAFA'}}></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
            console.log('aaaa');
            teamsCViews.push(teamView);
        }
        console.log('teamsCViews: ' + teamsCViews);
        return teamsCViews
    }

    render() {
        console.log('GLOBALS.windowHeightSize: ' + GLOBALS.windowHeightSize);
        if (this.state.isScheduleSet === 'notSet') {
            return (
                <View style={{ backgroundColor: GLOBALS.colors.BackGround, height: GLOBALS.windowHeightSize, width: '100%', alignItems: 'center', justifyContent: 'center' }}> 
                    <TouchableOpacity style={ GLOBALS.styles.touchAble } 
                                    onPress={() => { 
                                        alert('The server is now processing and computing the schedule, its might take a while...');
                                        this.scheduling()
                                        this.setState({isScheduleSet: 'inProcess'});
                                        }}>
                        <Text style={{ textAlign: 'center', color: GLOBALS.colors.ButtonText }}> Start Scheduling </Text>
                    </TouchableOpacity>           
                    <TouchableOpacity style={ GLOBALS.styles.touchAble }
                                        onPress={() => { 
                                            console.log('this.state.showTeamsConstraints before: ' + this.state.showTeamsConstraints);
                                            this.setState({ showTeamsConstraints: !this.state.showTeamsConstraints });
                                            }}>
                            <Text style={{ textAlign: 'center', color: GLOBALS.colors.ButtonText }}> {this.state.showTeamsConstraints? 'Hide' : 'Show'} teams constraints </Text>
                    </TouchableOpacity> 
                    <ScrollView style={{ width: '80%', height: ((this.state.showTeamsConstraints)? GLOBALS.windowHeightSize*(4/10) : 0) ,flexDirection: 'column' }}>
                        {(this.state.showTeamsConstraints)? this.createTeamsConstraintsView() : null}
                    </ScrollView>
                </View>
            );
        } 
        else if (this.state.isScheduleSet === 'inProcess') {
            return (
                <View>
                    <Text>Server is still scheduling...:</Text>
                </View>
            );
        }
        // else 'set'
        // Should get now the constraints
        console.log('render in Scheduling.js');
        const weekTitles = this.getWeeksTitles();
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbb111111');
        const weekGames = this.createWeekGames();
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbb222222');
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
                    {/* <View style={{ flex: 4}}>
                        <Text></Text>
                    </View> */}
                </View>
                <ScrollView style={{ height: Math.floor(GLOBALS.windowHeightSize*(6/10)), flexDirection: 'column' }}>
                    {weekGames}
                </ScrollView>
                <View style={{ height: Math.floor(GLOBALS.windowHeightSize/10), width: '100%', alignItems: 'center',  }}>
                    <TouchableOpacity style={{ 
                        justifyContent: 'center', 
                        borderRadius: 25, 
                        height: '90%',
                        width: '40%',
                        backgroundColor: GLOBALS.colors.Positive }} onPress={() => this.addGame()}>
                        <Text style={{ textAlign: 'center', color: '#FFFFFF' }}> Add Game </Text>
                    </TouchableOpacity>           
                </View>
                <View style={{ height: Math.floor(GLOBALS.windowHeightSize/10), width: '100%', alignItems: 'center' }}>
                    <TouchableOpacity style={{ 
                        justifyContent: 'center', 
                        backgroundColor: '#2C3E50', 
                        borderRadius: 25, 
                        height: '90%',
                        paddingVertical: 5 }} onPress={() => { 
                                            console.log('this.state.showTeamsConstraints before: ' + this.state.showTeamsConstraints);
                                            this.setState({ showTeamsConstraints: !this.state.showTeamsConstraints });
                                            }}>
                            <Text style={{ textAlign: 'center', color: '#FCFAFA', backgroundColor: GLOBALS.ButtonTextColor }}> {this.state.showTeamsConstraints? 'Hide' : 'Show'} teams constraints </Text>
                    </TouchableOpacity> 
                </View>
                {(this.state.showTeamsConstraints)? 
                    <ScrollView style={{ marginLeft: GLOBALS.windowWidthSize/10, backgroundColor: '#000000', width: '80%', height: ((this.state.showTeamsConstraints)? GLOBALS.windowHeightSize*(4/10) : 0) ,flexDirection: 'column' }}>
                        {this.createTeamsConstraintsView()}
                    </ScrollView> 
                    : 
                    null
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    TeamViewContainer: {
        flex: 9,
        flexDirection: 'row',
        width: '100%',
        borderColor: '#000000',
        //alignItems: 'center',
    },
    TeamsTytle: {
        flex: 1,
        borderColor: '#000000',
        backgroundColor: '#5D6D7E',
        borderWidth: 1,
    },
    TeamsDayContainer: {

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
    textHead: {
        textAlign: 'center',
        fontFamily: 'Times',
        color: '#AED6F1',
    },
    head: {
        height: 28,
        backgroundColor: '#5D6D7E',
    },
});


