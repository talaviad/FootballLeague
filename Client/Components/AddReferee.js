import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class AddReferee extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = this.initialState;
  }

  get initialState() {
    return {
      username: '',
      password: '',
      email: '',
      IllegalUserName: false,
      isLoading: false,
    };
  }
  IsUsernameLegal = () => {
    var username = this.state.username;
    if (username.length > 3) {
      var reg = new RegExp('^[a-zA-Z0-9]+$');
      return reg.test(username);
    } else {
      return false;
    }
  };
  createUser = () => {
    if (!this.IsUsernameLegal()) {
      this.setState({IllegalUserName: true});
      return;
    }
    var randomstring = Math.random()
      .toString(36)
      .slice(-6);
    this.state.password = randomstring;
    this.registerReferee();
  };

  async registerReferee() {
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
          'Football-Request': 'AddReferee',
          Authorization: await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify({
          user: this.state.username,
          pass: this.state.password,
          email: this.state.username + '@gmail.com',
          requestedRole: 'referee',
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        this.setState({isLoading: false});
        //this.setState(this.initialState);
        if (resJson.success) {
          alert('The referee has been registered successfully');
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
        imageStyle={{opacity: 0.85}}>
        <View style={styles.container}>
          {/* <Image
            source={require('../Images/z.jpg')}
            imageStyle={{backgroundColor: 'red'}}
            background="transparent"
            style={{
              // position: 'absolute',
              width: '100%',
              height: '25%',
            }}
          /> */}
          <Text style={styles.guidanceText}>
            Choose username for the referee
          </Text>
          <Text style={styles.recommendationText}>
            It is recommended to choose username that related to the referee
            name
          </Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Username"
            placeholderTextColor="#F8F9F9"
            underlineColorAndroid="#2C3E50"
            onChangeText={username => this.setState({username})}
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
              onPress={this.createUser}>
              <Text style={styles.buttonText}>Create User</Text>
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
          <View style={styles.loadingStyle}>
            {this.state.isLoading && (
              <ActivityIndicator color={'#fff'} size={80} />
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    // backgroundColor: '#5499C7',
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
    fontFamily: 'sans-serif-normal',
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 20,
    //marginVertical: 10,
    marginTop: 40,
    fontWeight: '600',
  },
  recommendationText: {
    fontStyle: 'italic',
    marginTop: '1%',
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 18,
    //marginVertical: 10,
    //marginTop: 20,
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
    marginTop: 32,
    marginHorizontal: 40,
    paddingHorizontal: 24,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 5,
    width: '50%',
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
