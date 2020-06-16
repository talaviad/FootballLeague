import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/blue';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      isLoading: false,
      user: '',
      password: '',
      alerts: {
        fieldsNotFull: {
          toShow: false,
          msg: '',
        },
        requestFailed: {
          toShow: false,
          msg: '',
        },
        serverError: {
          toShow: false,
          msg: '',
        },
      },
    };
    this.load = this.load.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
    this.createAllAlerts = this.createAllAlerts.bind(this);
    this.setAlertsState = this.setAlertsState.bind(this);
    this.addAlertToarray = this.addAlertToarray.bind(this);
  }

  createAllAlerts() {
    const alerts = [];
    this.addAlertToarray(alerts, 'fieldsNotFull', 'Error');
    this.addAlertToarray(alerts, 'requestFailed', 'Error');
    this.addAlertToarray(alerts, 'serverError', 'Error');
    return alerts;
  }

  setAlertsState(field, toShow, msg) {
    this.setState(prevState => {
      let alerts = Object.assign({}, prevState.alerts);
      alerts[field] = {toShow: toShow, msg: msg};
      return {alerts};
    });
  }

  addAlertToarray(alerts, field, title) {
    alerts.push(
      <AwesomeAlert
        show={this.state.alerts[field].toShow}
        showProgress={false}
        title={title}
        message={this.state.alerts[field].msg}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Yes"
        confirmText="ok"
        confirmButtonColor="#8fbc8f"
        onConfirmPressed={() => {
          this.setAlertsState(field, false, '');
        }}
      />,
    );

    return alerts;
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
    let token;

    try {
      token = await AsyncStorage.getItem('token');
    } catch (err) {
      throw err;
    }
    console.log('token: ' + token);
    if (token !== 'none') {
      try {
        await AsyncStorage.setItem('token', 'none');
      } catch (err) {
        console.error(err);
        throw err;
      }

      this.props.navigation.navigate('Home');
    }
  }

  async onButtonPress() {
    if (this.state.user === '' || this.state.password === '') {
      this.setAlertsState(
        'fieldsNotFull',
        true,
        'You did not fill all the fields',
      );
      //alert('you did not fill all the fields');
      return;
    }
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
          'Football-Request': 'login',
        },
        body: JSON.stringify({
          user: this.state.user,
          pass: this.state.password,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        this.setState({isLoading: false});

        if (resJson.success) {
          console.log('resJson.jwt: ' + resJson.jwt);
          await AsyncStorage.setItem('role', resJson.role);
          await AsyncStorage.setItem('token', resJson.jwt);
          await AsyncStorage.setItem('username', resJson.username);

          this.props.navigation.navigate('Home');
        } else {
          this.setAlertsState('requestFailed', true, '' + resJson.error.msg);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        this.setAlertsState('serverError', true, '' + err);
      });
  }
  render() {
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        imageStyle={{opacity: 0.8}}>
        <View style={styles.container}>
          <TextInput
            style={styles.inputBox}
            placeholder="Username"
            placeholderTextColor="#F8F9F9"
            underlineColorAndroid="#2C3E50"
            onChangeText={user => this.setState({user})}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#F8F9F9"
            underlineColorAndroid="#2C3E50"
            onChangeText={password => this.setState({password})}
          />
          <AwesomeButtonCartman
            onPress={() => this.onButtonPress()}
            type="anchor"
            stretch={true}
            textSize={18}
            backgroundColor="#123c69"
            style={{width: '50%'}}
            borderWidth={0.5}
            borderRadius={10}
            raiseLevel={4}>
            Login
          </AwesomeButtonCartman>
          {this.createAllAlerts()}
          {/* <TouchableOpacity style={styles.button} onPress={this.onButtonPress}>
            <Text style={styles.buttonText}>login</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.loadingStyle}>
          {this.state.isLoading && (
            <ActivityIndicator color={'#fff'} size={80} />
          )}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inputBox: {
    width: 300,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 10,
    marginTop: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    marginTop: 60,
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
