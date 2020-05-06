import React from 'react';
import {StyleSheet, View, Button, Text, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Table, Row, Rows } from 'react-native-table-component';

var IP = '10.0.0.33';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('in constructor of Home.js');
    const {navigation} = this.props;
    this.state = {
      isLoggedIn: false,
      role: null,
      token: null,
      teamsNames: [],
      inbox: {
        counter: 0,
        messages: [],
      }
    };
    this.handleSendRequestToServer = this.handleSendRequestToServer.bind(this);
    this.load = this.load.bind(this);
    this.getTeamsNames();
  }

  handleSendRequestToServer = async param => {
    let token = await AsyncStorage.getItem('token');
    let response = fetch('http://' + IP + ':3000/?data=' + param, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Football-Request': param,
        Authorization: this.state.token,
      },
    })
      .then(response => {
        return response.json();
      })
      .then(resJson => {
        if (!resJson.success) {
          alert(resJson.error.msg);
          return;
        }
        switch (param) {
          case 'leagueTable':
            this.props.navigation.navigate('LeagueTable', {
              tableData: resJson.tableData,
            });
            break;
          case 'GamesWeek1':
            return resJson.tableData;
            break;
          case 'scorerTable':
            this.props.navigation.navigate('ScorerTable', {
              tableData: resJson.tableData,
            });
            break;
          case 'register':
            this.props.navigation.navigate('Register');
            break;
          case 'insertGameResult':
            this.props.navigation.navigate('Home');
            break;
          case 'GetConstraints':
            this.props.navigation.navigate('Constraints',{
              IP: IP,
            });
            break;
          default:
            break;
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  async getTeamsNames() {
    let response;

    try {
      response = await fetch('http://' + IP + ':3000/?data=TeamsNames', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'TeamsNames',
        },
      });
      const json = await response.json();
      this.state.teamsNames = json.teamsNames;
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount() {
    console.log('in Home.js - componentDidMount() ')
    this.load();
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      this.load,
    );
  }

  componentWillUnmount() {
    console.log('in Home.js - componentWillUnmount() ')
    this.focusListener.remove();
  }

  async load() {
    console.log('this.state.isLoggedIn: ' + this.state.isLoggedIn);
    let token;
    let currRole;
    let inbox = {
      messages: [],
      newMessages: 0,
    };

    try {
      token = await AsyncStorage.getItem('token');
      currRole = await AsyncStorage.getItem('role');
      console.log('load(): currRole - '+currRole);
      console.log('load(): token - '+token);
      // If connected, bring new messages
      if (token !== 'none') {
        let response = await fetch('http://' + IP + ':3000/?data=GetInbox', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'GetInbox',
            Authorization: token,
          },
        });
        let json = await response.json();
        console.log('In Home.js, load() - json.success: ' + json.success);
        if (json.success) {
          console.log('json.inbox: ' + json.inbox);
          inbox = json.inbox;
          let newMessages = 0;
          for (let i=0; i<json.inbox.messages.length; i++) {
            if (!json.inbox.messages[i].read)
              newMessages++;
          }
          inbox.newMessages = newMessages;
        }
        else
          console.log('Error message: ' + json.error.msg);
      }
    } catch (err) {
      throw err;
    }

    this.setState({isLoggedIn: token !== 'none', token: token, role: currRole, inbox: inbox});
  }

  render() {
    return (
      <ScrollView style={styles.body}>
        <View style={styles.sectionTwoBtnContainer}>
          {!this.state.isLoggedIn ? (
            <TouchableOpacity
              style={styles.divided}
              onPress={() =>
                this.props.navigation.navigate('Register', {IP: IP})
              }>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.divided}
            onPress={() => this.props.navigation.navigate('Login', {IP: IP})}>
            <Text style={styles.buttonText}>
              {this.state.isLoggedIn ? 'Logout' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.isLoggedIn ?
                <TouchableOpacity
                style={styles.touchAble}
                onPress={() =>
                  this.props.navigation.navigate('Inbox', {
                    inbox: this.state.inbox,
                    IP: IP,
                  })
                }>
                {console.log('this.state.inbox.messages.length: ' + this.state.inbox.messages.length)}
                <Text style={{ fontSize: 20, fontWeight: '500', color: (this.state.inbox.newMessages !== 0)? '#BD1128' : '#AED6F1', textAlign: 'center',}}>
                    Inbox - {(this.state.inbox.newMessages !== 0)? '' +this.state.inbox.newMessages+ ' new messages' : 'no new messages'}
                </Text>
              </TouchableOpacity> : null
        }
        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => this.handleSendRequestToServer('leagueTable')}>
          <Text style={styles.buttonText}>League Table</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchAble}
          onPress={() =>
            this.props.navigation.navigate('GamesResults', {IP: IP})
          }>
          <Text style={styles.buttonText}>Games Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => this.handleSendRequestToServer('scorerTable')}>
          <Text style={styles.buttonText}>Scorer Table</Text>
        </TouchableOpacity>
        {this.state.isLoggedIn &&
        (this.state.role === 'referee' || this.state.role === 'manager') ? (
          <TouchableOpacity
            style={styles.touchAble}
            onPress={() =>
              this.props.navigation.navigate('InsertGame', {
                IP: IP,
                teamList: this.state.teamsNames,
              })
            }>
            <Text style={styles.buttonText}>Insert a game resultt</Text>
          </TouchableOpacity>
        ) : null}
        {this.state.isLoggedIn &&
        (this.state.role === 'referee' || this.state.role === 'manager') ? (
          <TouchableOpacity
            style={styles.touchAble}
            onPress={() =>
              this.props.navigation.navigate('GameMode', {
                IP: IP,
                teamList: this.state.teamsNames,
              })
            }>
            <Text style={styles.buttonText}>Enter game mode</Text>
          </TouchableOpacity>
        ) : null}
          <TouchableOpacity
          style={styles.touchAble}
          onPress={() => this.handleSendRequestToServer('GetConstraints')}>
          <Text style={styles.buttonText}>Constraints</Text>
        </TouchableOpacity>
        {(this.state.isLoggedIn && this.state.role === 'manager')? (
          <TouchableOpacity
            style={styles.touchAble}
            onPress={() => this.props.navigation.navigate('Scheduling', {IP: IP})}>
            <Text style={styles.buttonText}>Scheduling</Text>
          </TouchableOpacity>
        ) : null}
        {(this.state.isLoggedIn && this.state.role === 'manager')? (
          <TouchableOpacity
            style={styles.touchAble}
            onPress={() => this.props.navigation.navigate('PitchConstraints', {IP: IP})}>
            <Text style={styles.buttonText}>Set Pitch Constraints</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: '#5499C7',
  },
  sectionTwoBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: '#5DADE2',
  },
  divided: {
    flex: 1,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  touchAble: {
    marginTop: 32,
    marginHorizontal: 40,
    paddingHorizontal: 24,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#AED6F1',
    textAlign: 'center',
  },
});