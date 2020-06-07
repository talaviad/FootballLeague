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

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      user: '',
      password: '',
      isLoading: false,
    };
    this.load = this.load.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);
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
      alert('you did not fill all the fields');
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
          <TouchableOpacity style={styles.button} onPress={this.onButtonPress}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
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
    marginTop: 15,
    flexGrow: 1,
    alignItems: 'center',
  },
  inputBox: {
    width: 300,
    paddingHorizontal: 16,
    fontSize: 18,
    marginVertical: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 12.5,
    width: '50%',
    marginTop: 30,
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
