import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';
import {TriangleColorPicker} from 'react-native-color-picker';

export default class AddClubStep1 extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = this.initialState;
  }
  get initialState() {
    return {
      clubName:
        this.props.getState()['clubName'] === undefined
          ? ''
          : this.props.getState()['clubName'],
      captainUsername:
        this.props.getState()['captainUsername'] === undefined
          ? ''
          : this.props.getState()['captainUsername'],
      teamColor:
        this.props.getState()['teamColor'] === undefined
          ? null
          : this.props.getState()['teamColor'],
      IllegalUserName: false,
      IllegalClubName: false,
      IllegalColor: false,
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

  nextStep = () => {
    if (this.state.clubName === '') {
      this.setState({IllegalClubName: true});
      return;
    }
    if (!this.IsUsernameLegal()) {
      this.setState({IllegalUserName: true});
      return;
    }

    if (this.state.teamColor === null) {
      this.setState({IllegalColor: true});
      return;
    }

    const {next, saveState} = this.props;

    // Save state for use in other steps
    saveState({
      clubName: this.state.clubName,
      captainUsername: this.state.captainUsername,
      teamColor: this.state.teamColor,
    });

    // Go to next step
    next();
  };

  render() {
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        imageStyle={{opacity: 0.6}}>
        <View style={styles.container}>
          <View style={{alignItems: 'center', marginTop: 30}}>
            <TextInput
              value={this.state.clubName}
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
              It is recommended to choose username that related to the captain
              name
            </Text>
            <TextInput
              style={styles.inputBox}
              value={this.state.captainUsername}
              placeholder="Captain Username"
              placeholderTextColor="#F8F9F9"
              underlineColorAndroid="#2C3E50"
              onChangeText={captainUsername => this.setState({captainUsername})}
            />
          </View>
          <Text style={{alignSelf: 'center', fontSize: 18}}>Team's color:</Text>
          <TriangleColorPicker
            defaultColor={this.state.teamColor}
            onColorSelected={teamColor => {
              this.setState({teamColor});
            }}
            style={{flex: 0.7}}
          />

          <TouchableOpacity style={styles.touchAble} onPress={this.nextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <AwesomeAlert
            show={this.state.IllegalUserName}
            showProgress={false}
            title="Error"
            message={
              'Illegal Username' +
              '\n' +
              'Username must be at least 4 characters long\nOnly english letters and digits'
            }
            messageStyle={{textAlign: 'center'}}
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
            show={this.state.IllegalClubName}
            showProgress={false}
            title="Error"
            message={'Please choose the Club Name'}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Yes"
            confirmText="ok"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({IllegalClubName: false});
            }}
          />
          <AwesomeAlert
            show={this.state.IllegalColor}
            showProgress={false}
            title="Error"
            message={
              "Please choose the team's color\nThe need to click the long stripe"
            }
            messageStyle={{textAlign: 'center'}}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Yes"
            confirmText="ok"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({IllegalColor: false});
            }}
          />
          <AwesomeAlert
            show={this.state.successAlertFromServer}
            showProgress={false}
            title="Confirmation"
            message={'The club and the captain username has been created'}
            closeOnTouchOutside={true}
            messageStyle={{textAlign: 'center'}}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Yes"
            confirmText="ok"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({successAlertFromServer: false});
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#5499C7',
    //paddingTop: 5,
    //paddingHorizontal: 25,
    //alignItems: 'center',
    //flexGrow: 1,
    // alignItems: 'center',
    // backgroundColor: '#5499C7',
  },
  inputBox: {
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 18,
    //marginVertical: 10,
    //marginTop: 20,
  },
  inputBox2: {
    width: '25%',
    paddingHorizontal: 16,
    fontSize: 14,
    //marginVertical: 10,
    //marginTop: 20,
  },
  inputBox3: {
    width: '35%',
    paddingHorizontal: 16,
    fontSize: 14,
    //marginVertical: 10,
    //marginTop: 20,
  },
  guidanceText: {
    fontFamily: 'sans-serif-normal',
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 20,
    //marginVertical: 10,
    marginTop: 20,
    fontWeight: '600',
  },
  recommendationText: {
    fontStyle: 'italic',
    marginTop: '1%',
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 18,
  },
  passwordText: {
    //width: '80%',
    //paddingHorizontal: 16,
    fontSize: 23,
    //marginVertical: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  touchAble: {
    marginTop: 40,
    width: '50%',
    //marginHorizontal: 5,
    paddingHorizontal: 15,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 5,
    alignSelf: 'center',
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
  picker: {
    width: '80%',
    borderRadius: 25,
    paddingHorizontal: 80,
    fontSize: 20,
    borderColor: '#2C3E50',
    borderWidth: 10,
    marginTop: 20,
    color: '#F8F9F9',
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
