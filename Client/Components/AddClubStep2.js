import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import {Picker} from '@react-native-community/picker';
import {CustomPicker} from 'react-native-custom-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class AddClubStep2 extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = this.initialState;
  }
  get initialState() {
    return {
      password: '',
      email: '',
      players:
        this.props.getState()['players'] === undefined
          ? []
          : this.props.getState()['players'],
      isLoading: false,
      successAlertFromServer: false,
      numOfPlayers:
        this.props.getState()['numOfPlayers'] === undefined
          ? 0
          : this.props.getState()['numOfPlayers'],
    };
  }

  onPressButton = () => {
    for (var i = 0; i < this.state.players.length; i++) {
      if (!this.isNumeric(this.state.players[i].jerseyNumber)) {
        alert('Illegal scorer jersy number details');
        return;
      }
      if (
        !this.isLegalName(this.state.players[i].firstName) ||
        !this.isLegalName(this.state.players[i].lastName)
      ) {
        alert('Illegal scorer name details');
        return;
      }
      this.state.players[i].firstName =
        this.state.players[i].firstName.charAt(0).toUpperCase() +
        this.state.players[i].firstName.substring(1).toLowerCase();
      this.state.players[i].lastName =
        this.state.players[i].lastName.charAt(0).toUpperCase() +
        this.state.players[i].lastName.substring(1).toLowerCase();
    }
    this.addClub();
  };

  isNumeric = value => {
    return /^\d+$/.test(value);
  };

  isLegalName = value => {
    var reg = new RegExp('^[a-zA-Z]+$');
    return reg.test(value);
  };

  //part of the picker, the views of the selected field.
  renderField(settings) {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={{borderColor: 'grey', padding: 15}}>
        <View>
          {!selectedItem && (
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text style={[styles.customPickerText, {color: 'black'}]}>
                {'Number Of Players'}
              </Text>
              <Icon name="chevron-down" size={25} style={{marginLeft: '5%'}} />
            </View>
          )}
          {selectedItem && (
            <View style={styles.innerContainer}>
              <Text
                style={[
                  styles.customPickerText,
                  {color: '#FEFFFF', fontFamily: 'sans-serif-medium'},
                ]}>
                {getLabel(selectedItem)}
              </Text>
              <Icon
                name="chevron-down"
                size={30}
                style={{marginLeft: 10, marginTop: 10}}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
  //part of the picker, the views of the options
  renderOption(settings) {
    const {item, getLabel} = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, {backgroundColor: item.color}]} />
          <Text style={styles.customPickerText}>{getLabel(item)}</Text>
        </View>
      </View>
    );
  }

  async addClub() {
    this.setState({isLoading: true});
    let randomstring = Math.random()
      .toString(36)
      .slice(-6);
    this.setState({password: randomstring});
    try {
      let response = fetch('http://' + '132.72.23.63' + ':' + '3079' + '/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'AddNewClub',
          Authorization: await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify({
          clubName: this.props.getState()['clubName'],
          players: this.state.players,
          user: this.props.getState()['captainUsername'],
          pass: randomstring,
          email: this.props.getState()['captainUsername'] + '@gmail.com',
          color: this.props.getState()['teamColor'],
          requestedRole: 'captain',
        }),
      })
        .then(response => response.json())
        .then(async resJson => {
          if (resJson.success) {
            if (resJson.success) {
              this.setState({isLoading: false, successAlertFromServer: true});
            } else {
              alert(resJson.error.msg);
            }
          } else {
            this.setState({isLoading: false});
            console.log('error: ' + resJson.error.msg);
          }
        })
        .catch(err => {
          this.setState({isLoading: false});
          alert(err);
        });
    } catch (err) {
      console.log('error: ' + err);
      alert('error: ' + err);
    }
  }
  displayPlayers = () => {
    return this.state.players.map((x, i) => {
      return (
        <View>
          <View style={styles.columns}>
            <Text
              style={{fontWeight: 'bold', fontSize: 15}}
              borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              {i + 1 + '. '}
            </Text>
            <TextInput
              style={styles.inputBox2}
              placeholder="#Jersey"
              placeholderTextColor="#F8F9F9"
              underlineColorAndroid="#2C3E50"
              onChangeText={jerseyNumber =>
                (this.state.players[i].jerseyNumber = jerseyNumber)
              }
            />
            <TextInput
              style={styles.inputBox3}
              placeholder="First Name"
              placeholderTextColor="#F8F9F9"
              underlineColorAndroid="#2C3E50"
              onChangeText={firstName =>
                (this.state.players[i].firstName = firstName)
              }
            />
            <TextInput
              style={styles.inputBox3}
              placeholder="Last Name"
              placeholderTextColor="#F8F9F9"
              underlineColorAndroid="#2C3E50"
              onChangeText={lastName =>
                (this.state.players[i].lastName = lastName)
              }
            />
          </View>
        </View>
      );
    });
  };

  goBack = () => {
    this.props.saveState({
      numOfPlayers: this.state.numOfPlayers,
      players: this.state.players,
    });
    this.props.back();
  };

  render() {
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        imageStyle={{opacity: 0.85}}>
        {/* <View style={styles.container}> */}
        <ScrollView style={styles.container}>
          {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}> */}
          {/* <Text style={styles.text}>Number Of Players:</Text> */}
          <CustomPicker
            // selectedItem={this.state.numOfPlayers}
            style={styles.picker}
            // backdropStyle={{borderWidth: 3}}
            // value={this.state.numOfPlayers}
            options={[5, 6, 7, 8, 9, 10]}
            fieldTemplate={this.renderField}
            optionTemplate={this.renderOption}
            onValueChange={(itemValue, itemIndex) => {
              if (itemValue < this.state.numOfPlayers) {
                for (var i = 0; i > itemValue - this.state.numOfPlayers; i--) {
                  this.state.players.pop();
                }
              } else {
                for (var i = 0; i < itemValue - this.state.numOfPlayers; i++) {
                  this.state.players.push({
                    jerseyNumber: '',
                    firstName: '',
                    lastName: '',
                    goals: 0,
                  });
                }
              }
              this.setState({numOfPlayers: itemValue});
            }}
          />
          {/* <Picker
                selectedValue={this.state.numOfPlayers}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue < this.state.numOfPlayers) {
                    this.state.players.splice(
                      -1,
                      this.state.numOfPlayers - itemValue,
                    );
                  } else {
                    for (
                      var i = 0;
                      i < itemValue - this.state.numOfPlayers;
                      i++
                    ) {
                      this.state.players.push({
                        jerseyNumber: '',
                        firstName: '',
                        lastName: '',
                        goals: 0,
                      });
                    }
                  }
                  this.setState({numOfPlayers: itemValue});
                }}>
                <Picker.Item label="" value={0} />
                <Picker.Item label="5" value={5} />
                <Picker.Item label="6" value={6} />
                <Picker.Item label="7" value={7} />
                <Picker.Item label="8" value={8} />
                <Picker.Item label="9" value={9} />
                <Picker.Item label="10" value={10} />
              </Picker> */}
          {/* </View> */}

          {this.state.players.length > 0 && this.displayPlayers()}
        </ScrollView>

        {this.state.password !== '' && (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.passwordText}>
              The genereated password is: {this.state.password}
            </Text>
            <Text style={styles.recommendationText}>
              {
                'Give the captain the username and the password\n and ask him to change the password'
              }
            </Text>
          </View>
        )}
        {this.state.password === '' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity style={styles.touchAble} onPress={this.goBack}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchAble}
              onPress={this.onPressButton}>
              <Text style={styles.buttonText}>Add Club</Text>
            </TouchableOpacity>
          </View>
        )}
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
        {/* </View> */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#5499C7',
    // paddingTop: 30,
    paddingHorizontal: 30,
    // flexGrow: 1,
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
    fontSize: 23,
    //marginVertical: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  touchAble: {
    marginTop: '10%',
    // marginHorizontal: 40,
    paddingHorizontal: '10%',
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 5,
  },
  box: {
    width: '5%',
    height: '20%',
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
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  optionContainer: {
    padding: 10,
    borderBottomColor: 'grey',
  },
  picker: {
    flex: 1,
    width: '100%',
    borderRadius: 25,
    // paddingHorizontal: 80,
    fontSize: 20,
    borderColor: '#2C3E50',
    borderWidth: 2,
    marginTop: 20,
    color: '#F8F9F9',
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    fontFamily: 'sans-serif-normal',
    width: '80%',
    paddingHorizontal: 16,
    fontSize: 20,
    //marginVertical: 10,
    marginTop: 40,
    fontWeight: '600',
  },
  customPickerText: {
    color: 'white',
    fontSize: 23,
    textAlign: 'center',
    color: 'grey',
    fontFamily: 'sans-serif-meduim',
    fontStyle: 'italic',
  },
});
