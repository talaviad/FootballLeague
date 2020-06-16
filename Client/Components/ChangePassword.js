import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      username: 'g',
      oldPassword: '',
      newPassword: '',
      newPasswordVerified: '',
      confirmationAlert: false,
      IllegalOldPassword: false,
      IllegalPassword: false,
      differentPasswords: false,
      isLoading: false,
    };
    this.getUserName();
  }

  async getUserName() {
    let username;
    try {
      username = await AsyncStorage.getItem('username');
      this.setState({username: username});
    } catch (err) {
      alert(err);
    }
  }

  onPressButton = () => {
    if (this.state.oldPassword.length < 6) {
      this.setState({IllegalOldPassword: true});
      return;
    }

    if (this.state.newPassword.length < 6) {
      this.setState({IllegalPassword: true});
      return;
    }

    if (this.state.newPassword !== this.state.newPasswordVerified) {
      this.setState({differentPasswords: true});
      return;
    }

    this.sendChangePasswordToServer();
  };

  async sendChangePasswordToServer() {
    this.setState({isLoading: true});
    let response = fetch(
      'http://' +
        this.props.navigation.getParam('IP') +
        ':' +
        this.props.navigation.getParam('PORT') +
        '/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'changePassword',
        },
        body: JSON.stringify({
          username: this.state.username,
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        if (resJson.success) {
          this.setState({isLoading: false});
          this.setState({confirmationAlert: true});
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
  render() {
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        imageStyle={{opacity: 0.7}}>
        <View style={styles.container}>
          <TextInput
            style={styles.inputBox}
            placeholder={this.state.username}
            placeholderTextColor="black"
            underlineColorAndroid="#2C3E50"
            editable={false}
            //onChangeText={username => this.setState({username})}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Old Password"
            placeholderTextColor="#F8F9F9"
            underlineColorAndroid="#2C3E50"
            onChangeText={oldPassword => this.setState({oldPassword})}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="New Password"
            secureTextEntry={true}
            placeholderTextColor="#F8F9F9"
            underlineColorAndroid="#2C3E50"
            onChangeText={newPassword => this.setState({newPassword})}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Confirm New Password"
            secureTextEntry={true}
            placeholderTextColor="#F8F9F9"
            underlineColorAndroid="#2C3E50"
            onChangeText={newPasswordVerified =>
              this.setState({newPasswordVerified})
            }
          />

          <TouchableOpacity
            style={styles.touchAble}
            onPress={this.onPressButton}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <AwesomeAlert
            show={this.state.confirmationAlert}
            showProgress={false}
            title="Confirmation"
            message={'The password has been changed'}
            messageStyle={{textAlign: 'center'}}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Yes"
            confirmText="OK"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({confirmationAlert: false});
              this.props.navigation.navigate('Home');
            }}
          />
          <AwesomeAlert
            show={this.state.IllegalOldPassword}
            showProgress={false}
            title="Error"
            message={
              'Illegal password' +
              '\n' +
              'Passwords must be at least 6 characters long'
            }
            messageStyle={{textAlign: 'center'}}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Yes"
            confirmText="OK"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({IllegalOldPassword: false});
            }}
          />
          <AwesomeAlert
            show={this.state.IllegalPassword}
            showProgress={false}
            title="Error"
            message={
              'Illegal password' +
              '\n' +
              'Passwords must be at least 6 characters long'
            }
            messageStyle={{textAlign: 'center'}}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Yes"
            confirmText="OK"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({IllegalPassword: false});
            }}
          />
          <AwesomeAlert
            show={this.state.differentPasswords}
            showProgress={false}
            title="Error"
            message={'Password and confirm password does not match'}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Yes"
            confirmText="OK"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({differentPasswords: false});
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
    paddingTop: 30,
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
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 15,
    //marginVertical: 10,
    marginTop: 40,
  },
  recommendationText: {
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 13,
    marginVertical: 10,
    //marginTop: 20,
  },
  passwordText: {
    //width: '80%',
    //paddingHorizontal: 16,
    fontSize: 15,
    //marginVertical: 10,
    //marginTop: 20,
    fontWeight: 'bold',
  },

  touchAble: {
    marginTop: 32,
    marginHorizontal: 40,
    paddingHorizontal: 24,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 12.5,
    paddingHorizontal: 25,
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
