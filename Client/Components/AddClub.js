import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class AddClub extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = this.initialState;
  }

  get initialState() {
    return {
      clubName: '',
      captainUsername: '',
      password: '',
      email: '',
      IllegalUserName: false,
      isLoading: false,
      successAlertFromServer: false,
    };
  }
  IsUsernameLegal = () => {
    var username = this.state.captainUsername;
    if (username.length > 3) {
      var reg = new RegExp('^[a-zA-Z0-9]+$');
      return reg.test(username);
    } else {
      return false;
    }
  };
  onPressButton = () => {
    if (!this.IsUsernameLegal()) {
      this.setState({IllegalUserName: true});
      return;
    }

    this.addClub();
  };

  async addClub() {
    this.setState({isLoading: true});
    let response = fetch(
      'http://' +
        /*this.props.navigation.getParam('IP')*/ '192.168.1.124' +
        ':' +
        /*this.props.navigation.getParam('port')*/ '3000' +
        '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'addNewClub',
        },
        body: JSON.stringify({
          clubName: this.state.clubName,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        if (resJson.success) {
          this.addCaptainUser();
        } else {
          this.setState({isLoading: false});
          alert(resJson.error.msg);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        alert(err);
      });
  }

  async addCaptainUser() {
    var randomstring = Math.random()
      .toString(36)
      .slice(-6);
    this.state.password = randomstring;
    let response = fetch(
      'http://' +
        /*this.props.navigation.getParam('IP')*/ '192.168.1.124' +
        ':' +
        /*this.props.navigation.getParam('port')*/ '3000' +
        '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'register',
        },
        body: JSON.stringify({
          user: this.state.captainUsername,
          pass: this.state.password,
          email: this.state.captainUsername + '@gmail.com',
          requestedRole: 'captain',
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        this.setState({isLoading: false});
        if (resJson.success) {
          this.setState({successAlertFromServer: true});
        } else {
          alert(resJson.error.msg);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        alert(err);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.guidanceText}>Choose the club name</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Club Name"
          placeholderTextColor="#F8F9F9"
          underlineColorAndroid="#2C3E50"
          onChangeText={clubName => this.setState({clubName})}
        />
        <Text style={styles.guidanceText}>
          Choose the username for the club's captain
        </Text>
        <Text style={styles.recommendationText}>
          It is recommended to choose username that related to the captain name
        </Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Captain Username"
          placeholderTextColor="#F8F9F9"
          underlineColorAndroid="#2C3E50"
          onChangeText={captainUsername => this.setState({captainUsername})}
        />
        {this.state.password !== '' && (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.passwordText}>
              The genereated password is: {this.state.password}
            </Text>
            <Text style={styles.recommendationText}>
              {
                'Give the referee the username and the password\n and ask him to change the password'
              }
            </Text>
          </View>
        )}
        {this.state.password === '' && (
          <TouchableOpacity
            style={styles.touchAble}
            onPress={this.onPressButton}>
            <Text style={styles.buttonText}>Add Club</Text>
          </TouchableOpacity>
        )}
        <AwesomeAlert
          show={this.state.IllegalUserName}
          showProgress={false}
          title="Error"
          message={
            '\t\t\t\t\t\t\t\t\tIllegal Username' +
            '\n' +
            '- Should be minimum 4 characters\n- Includes only english letters and digits'
          }
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Yes"
          confirmText="ok"
          confirmButtonColor="#8fbc8f"
          onConfirmPressed={() => {
            this.setState({IllegalUserName: false});
          }}
        />
        <AwesomeAlert
          show={this.state.successAlertFromServer}
          showProgress={false}
          title="Confirmation"
          message={'The club and the captain username has been created'}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Yes"
          confirmText="ok"
          confirmButtonColor="#8fbc8f"
          onConfirmPressed={() => {
            this.setState({successAlertFromServer: false});
          }}
        />
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
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#5499C7',
    //paddingVertical: 0,
  },
  inputBox: {
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 18,
    //marginVertical: 10,
    //marginTop: 20,
  },
  guidanceText: {
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 18,
    //marginVertical: 10,
    marginTop: 40,
  },
  recommendationText: {
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 16,
    //marginVertical: 10,
    //marginTop: 20,
  },
  passwordText: {
    //width: '80%',
    //paddingHorizontal: 16,
    fontSize: 20,
    //marginVertical: 10,
    marginBottom: 10,
    fontWeight: 'bold',
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
