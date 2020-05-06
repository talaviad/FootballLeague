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
import { Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import LeagueTable from './LeagueTable';
import GamesResults from './GamesResults';
import AddReferee from './AddReferee';
import AddClub from './AddClub';
import ChangePassword from './ChangePassword';
import GameMode from './GameMode';
import Register from './Register';
import { Table, Row, Rows } from 'react-native-table-component';
import {
  StyleSheet,
  View,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

var IP = '10.0.0.33'; 
var PORT = '3000';

function RoundButton({title, color, background, onPress, disabled}) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      isLoggedIn: false,
      role: null,
      token: null,
      username: null,
      teamsNames: [],
      isLoading: false,
    };
    this.handleSendRequestToServer = this.handleSendRequestToServer.bind(this);
    this.load = this.load.bind(this);
    this.getTeamsNames();
  }

  handleSendRequestToServer = async param => {
    let token = await AsyncStorage.getItem('token');
    this.setState({isLoading: true});
    let response = fetch('http://' + IP + ':' +PORT +'/?data=' + param, {
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
        'http://' + IP + ':' + PORT + '/?data=TeamsNames',
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
      username = await AsyncStorage.getItem('username');
    } catch (err) {
      throw err;
    }

    this.setState({
      isLoggedIn: token !== 'none',
      token: token,
      role: currRole,
      username: username,
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
                this.props.navigation.navigate('Register', {IP: IP, PORT: PORT})
              }>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.divided}
            onPress={() =>
              this.props.navigation.navigate('Login', {IP: IP, PORT: PORT})
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
            this.props.navigation.navigate('GamesResults', {IP: IP, PORT: PORT})
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
                PORT: PORT,
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
                PORT: PORT,
                teamList: this.state.teamsNames,
              })
            }>
            <Text style={styles.buttonText}>Enter game mode</Text>
          </TouchableOpacity>
        ) : null}
        {/* {this.state.role === 'referee' && (
          <TouchableOpacity
            style={styles.touchAble}
            onPress={() =>
              this.props.navigation.navigate('ManagementOptions', {
                IP: IP,
                PORT: PORT,
              })
            }>
            <Text style={styles.buttonText}>Management Options</Text>
          </TouchableOpacity>
        )} */}
        <ButtonsRow>
          <RoundButton
            title="Add New Referee"
            color="#5f9ea0"
            background="#3D3D3D"
            onPress={() => {
              this.props.navigation.navigate('AddReferee', {
                IP: IP,
                PORT: PORT,
              });
            }}
          />
          <RoundButton
            title="Add New Club"
            color="#5f9ea0"
            background="#3D3D3D"
            onPress={() => {
              this.props.navigation.navigate('AddClub', {
                IP: IP,
                PORT: PORT,
              });
            }}
          />
          <RoundButton
            title="Change Password"
            color="#5f9ea0"
            background="#3D3D3D"
            onPress={() => {
              this.props.navigation.navigate('ChangePassword', {
                IP: IP,
                PORT: PORT,
                username: this.state.username,
              });
            }}
          />
        </ButtonsRow>
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
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    textAlign: 'center',
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
    backgroundColor: '#4682b4',
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    //marginTop: 80,
    //marginBottom: 30,
    borderWidth: 0.8,
    //marginBottom: 0,
    position: 'absolute',
    alignSelf: 'center',
    //flex: 1,
    width: '100%',

    bottom: 0,
    flex: 1,
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
