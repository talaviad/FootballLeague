import React from 'react';
import {Table, Row, Rows} from 'react-native-table-component';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Text,
  TouchableOpacity,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      user: '',
      password: '',
      email: '',
      role: 'regular',
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
    let currRole;

    try {
      currRole = await AsyncStorage.getItem('role');
    } catch (err) {
      throw err;
    }

    if (currRole !== 'none') {
      try {
        await AsyncStorage.setItem('role', 'none');
      } catch (err) {
        console.error(err);
        throw err;
      }

      this.props.navigation.navigate('Home');
    }
  }

  async onButtonPress() {
    if (
      this.state.user.length < 4 ||
      this.state.password.length < 6 ||
      this.state.email === '' ||
      this.state.role === ''
    ) {
      alert('you did not fill all the fields');
      return;
    }
    let response = fetch(
      'http://' +
        this.props.navigation.getParam('IP') +
        ':' +
        this.props.navigation.getParam('port') +
        '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'register',
        },
        body: JSON.stringify({
          user: this.state.user,
          pass: this.state.password,
          email: this.state.email,
          requestedRole: this.state.role,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        if (resJson.success) {
          alert('you registered successfully');
          this.props.navigation.navigate('Home');
        } else {
          alert(resJson.error.msg);
        }
      })
      .catch(err => alert(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter a username"
          placeholderTextColor="#F8F9F9"
          selectionColor="#F8F9F9"
          underlineColorAndroid="#2C3E50"
          onChangeText={user => this.setState({user})}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter a password"
          secureTextEntry={true}
          placeholderTextColor="#F8F9F9"
          underlineColorAndroid="#2C3E50"
          onChangeText={password => this.setState({password})}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter an email"
          placeholderTextColor="#F8F9F9"
          underlineColorAndroid="#2C3E50"
          onChangeText={email => this.setState({email})}
        />
        <Picker
          selectedValue={this.state.role !== '' ? this.state.role : 'regular'}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({role: itemValue})
          }>
          <Picker.Item label="regular" value="regular" />
          <Picker.Item label="captain" value="captain" />
          <Picker.Item label="referee" value="referee" />
          <Picker.Item label="manager" value="manager" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={this.onButtonPress}>
          <Text style={styles.buttonText}>register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#5499C7',
    paddingVertical: 0,
  },
  inputBox: {
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 10,
    marginTop: 20,
  },
  button: {
    width: 300,
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
});
