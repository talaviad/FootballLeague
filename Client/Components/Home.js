import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LeagueTable from './LeagueTable';
import GamesResults from './GamesResults';
import GameMode from './GameMode';
import Register from './Register';
import {Table, Row, Rows} from 'react-native-table-component';

var IP = '132.72.23.63';
var port = '3079';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      isLoggedIn: false,
      role: null,
      token: null,
      teamsNames: [],
      isLoading: false,
      alon: true,
    };
    this.handleSendRequestToServer = this.handleSendRequestToServer.bind(this);
    this.load = this.load.bind(this);
    this.getTeamsNames();
  }

  handleSendRequestToServer = async param => {
    let token = await AsyncStorage.getItem('token');
    this.setState({isLoading: true});
    let response = fetch('http://' + IP + ':3079/?data=' + param, {
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
        this.setState({isLoading: false});

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
              callHome: this.handleBack.bind(this),
            });
            break;
          case 'register':
            this.props.navigation.navigate('Register');
            break;
          case 'insertGameResult':
            this.props.navigation.navigate('Home');
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
      response = await fetch(
        'http://' + IP + ':' + port + '/?data=TeamsNames',
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
    } catch (err) {
      console.error(err);
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
    let currRole;

    try {
      token = await AsyncStorage.getItem('token');
      currRole = await AsyncStorage.getItem('role');
    } catch (err) {
      throw err;
    }

    this.setState({
      isLoggedIn: token !== 'none',
      token: token,
      role: currRole,
    });
  }

  render() {
    return (
      <View style={styles.body}>
        <View style={styles.sectionTwoBtnContainer}>
          {!this.state.isLoggedIn ? (
            <TouchableOpacity
              style={styles.divided}
              onPress={() =>
                this.props.navigation.navigate('Register', {IP: IP, port: port})
              }>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.divided}
            onPress={() =>
              this.props.navigation.navigate('Login', {IP: IP, port: port})
            }>
            <Text style={styles.buttonText}>
              {this.state.isLoggedIn ? 'Logout' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => this.handleSendRequestToServer('leagueTable')}>
          <Text style={styles.buttonText}>League Table</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchAble}
          onPress={() =>
            this.props.navigation.navigate('GamesResults', {IP: IP, port: port})
          }>
          <Text style={styles.buttonText}>Games Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => {
            this.handleSendRequestToServer('scorerTable');
          }}>
          <Text style={styles.buttonText}>Scorer Table</Text>
        </TouchableOpacity>
        {this.state.isLoggedIn &&
        (this.state.role === 'referee' || this.state.role === 'manager') ? (
          <TouchableOpacity
            style={styles.touchAble}
            onPress={() =>
              this.props.navigation.navigate('InsertGame', {
                IP: IP,
                port: port,
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
                port: port,
                teamList: this.state.teamsNames,
              })
            }>
            <Text style={styles.buttonText}>Enter game mode</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.loadingStyle}>
          {this.state.isLoading && (
            <ActivityIndicator color={'#fff'} size={80} />
          )}
        </View>
      </View>
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
