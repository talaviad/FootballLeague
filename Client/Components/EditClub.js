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
import TeamSelector from './TeamSelector';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Select2 from 'react-native-select-two'; // tal's old state

export default class EditClub extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      selectedClubInRemove: '',
      successRemovingPlayer: false,
      confirmRemovingPlayer: false,
      jerseyToAdd: '',
      firstNameToAdd: '',
      lastNameToAdd: '',
      playerJerseyNumToRemove: '',
      playersListInRemove: [],
    };
  }
  async getPlayersList(clubName) {
    try {
      let response = fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/?data=' +
          clubName,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'PlayersList',
          },
        },
      )
        .then(response => response.json())
        .then(async resJson => {
          if (resJson.success) {
            this.arrangePlayersList(resJson.players);
          } else {
            alert('Error');
          }
        })
        .catch(err => alert(err));
    } catch (err) {
      alert(err);
    }
  }

  arrangePlayersList = playersList => {
    const data = [];
    for (var i = 0; i < playersList.length; i++) {
      data.push({
        id: i + 1,
        name:
          '#' +
          playersList[i].jerseyNumber.toString() +
          ' ' +
          playersList[i].firstName.toString() +
          ' ' +
          playersList[i].lastName.toString(),
      });
    }
    this.setState({
      playersListInRemove: data,
    });
  };

  async removePlayer(playerJerseyNumToRemove, clubName) {
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
          'Football-Request': 'removePlayer',
        },
        body: JSON.stringify({
          clubName: clubName,
          playerJerseyNumber: playerJerseyNumToRemove,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        this.setState({isLoading: false});
        if (resJson.success) {
          this.setState({successRemovingPlayer: true});
        } else {
          alert(resJson.error.msg);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        alert(err);
      });
  }

  async addPlayer(jerseyToAdd, firstNameToAdd, lastNameToAdd, clubName) {
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
          'Football-Request': 'addPlayer',
        },
        body: JSON.stringify({
          clubName: clubName,
          jerseyToAdd: jerseyToAdd,
          firstNameToAdd: firstNameToAdd,
          lastNameToAdd: lastNameToAdd,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        this.setState({isLoading: false});
        if (resJson.success) {
          this.setState({successAddingPlayer: true});
        } else {
          alert(resJson.error.msg);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        alert(err);
      });
  }
  isNumeric = value => {
    return /^\d+$/.test(value);
  };

  isLegalName = value => {
    var reg = new RegExp('^[a-zA-Z]+$');
    return reg.test(value);
  };
  render() {
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        imageStyle={{opacity: 0.7}}>
        <View style={styles.container}>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              width: '90%',
              marginTop: '5%',
            }}>
            <Text style={styles.guidanceText}>Remove Player</Text>

            <View
              style={{
                width: '70%',
                alignItems: 'center',
                marginLeft: '15%',
                marginTop: '5%',
              }}>
              <TeamSelector
                selectedTitleStyle={{
                  //the style of select team text
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '60',
                }}
                style={{
                  backgroundColor: '#0c4271',
                }}
                teamList={this.props.navigation.getParam('teamList')}
                onSelect={text => {
                  this.setState({selectedClubInRemove: text});
                  this.getPlayersList(text);
                }}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
                flexDirection: 'row',
                paddingBottom: '5%',
              }}>
              <View
                style={{width: '70%', alignItems: 'center', marginLeft: '15%'}}>
                <Select2
                  modalStyle={{color: 'red'}}
                  isSelectSingle
                  selectButtonText={'OK'}
                  cancelButtonText={'Cancel'}
                  searchPlaceHolderText={'Search Player Name'}
                  style={[
                    {
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: 'black',
                      backgroundColor: '#0c4271',
                    },
                    this.props.style,
                  ]}
                  colorTheme={'blue'}
                  popupTitle="Player To Remove"
                  title="Player To Remove"
                  selectedTitleStyle={{
                    color: 'white',
                    fontSize: 18,
                    textAlign: 'center',
                    fontFamily: 'sans-serif-condensed',
                    fontWeight: '60',
                  }}
                  data={this.state.playersListInRemove}
                  onSelect={id => {
                    if (id.length < 1) {
                      return;
                    }
                    var arr = this.state.playersListInRemove[id - 1].name.split(
                      ' ',
                    );
                    this.setState({
                      playerJerseyNumToRemove: arr[0].substring(1),
                    });
                  }}
                />
              </View>
              <Icon
                name="delete"
                backgroundColor="" //this line is important, it's canceling the deafult color
                color={'red'}
                size={38}
                onPress={() => {
                  if (this.state.playerJerseyNumToRemove !== '') {
                    this.setState({confirmRemovingPlayer: true});
                  } else {
                    alert('Please select a player to delete');
                  }
                }}
              />
            </View>
          </View>

          <View style={styles.loadingStyle}>
            {this.state.isLoading && (
              <ActivityIndicator color={'#fff'} size={80} />
            )}
          </View>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              width: '90%',
              marginTop: '10%',
            }}>
            <Text style={styles.guidanceText}>Add Player</Text>

            <View
              style={{
                width: '70%',
                alignItems: 'center',
                marginLeft: '15%',
                marginTop: '5%',
              }}>
              <TeamSelector
                selectedTitleStyle={{
                  //the style of select team text
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '60',
                }}
                style={{
                  backgroundColor: '#0c4271',
                }}
                teamList={this.props.navigation.getParam('teamList')}
                onSelect={text => {
                  this.setState({selectedClubInAdd: text});
                }}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                marginTop: 10,
                paddingBottom: '5%',
                marginLeft: '5%',
              }}>
              <View style={styles.row}>
                <TextInput
                  style={styles.inputBox2}
                  placeholder="#Jersey"
                  placeholderTextColor="#F8F9F9"
                  underlineColorAndroid="#2C3E50"
                  onChangeText={jerseyNumber =>
                    this.setState({jerseyToAdd: jerseyNumber})
                  }
                />
                <TextInput
                  style={styles.inputBox3}
                  placeholder="First Name"
                  placeholderTextColor="#F8F9F9"
                  underlineColorAndroid="#2C3E50"
                  onChangeText={firstName =>
                    this.setState({firstNameToAdd: firstName})
                  }
                />
                <TextInput
                  style={styles.inputBox3}
                  placeholder="Last Name"
                  placeholderTextColor="#F8F9F9"
                  underlineColorAndroid="#2C3E50"
                  onChangeText={lastName =>
                    this.setState({lastNameToAdd: lastName})
                  }
                />
              </View>
              <Icon
                name="plus-circle"
                color={'black'}
                size={38}
                onPress={() => {
                  if (
                    this.state.jerseyToAdd !== '' &&
                    this.state.firstNameToAdd !== '' &&
                    this.state.lastNameToAdd !== ''
                  ) {
                    this.setState({confirmAddingPlayer: true});
                  } else {
                    alert('Please Fill all the fields');
                  }
                }}
              />
            </View>
          </View>
          <AwesomeAlert
            show={this.state.confirmRemovingPlayer}
            showProgress={false}
            title="Confirmation"
            message={'Are you sure you want to remove the player?'}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            showCancelButton={true}
            cancelText="No"
            confirmText="Yes, delete"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.removePlayer(
                this.state.playerJerseyNumToRemove,
                this.state.selectedClubInRemove,
              );
              this.setState({confirmRemovingPlayer: false});
            }}
            onCancelPressed={() => {
              this.setState({confirmRemovingPlayer: false});
            }}
          />
          <AwesomeAlert
            show={this.state.confirmAddingPlayer}
            showProgress={false}
            title="Confirmation"
            message={'Are you sure you want to add the player?'}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            showCancelButton={true}
            cancelText="No"
            confirmText="Yes, add"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              if (!this.isNumeric(this.state.jerseyToAdd)) {
                alert('Illegal jersy number ');
                this.setState({confirmAddingPlayer: false});
                return;
              }
              if (
                !this.isLegalName(this.state.firstNameToAdd) ||
                !this.isLegalName(this.state.lastNameToAdd)
              ) {
                alert('Illegal name');
                this.setState({confirmAddingPlayer: false});

                return;
              }

              this.addPlayer(
                this.state.jerseyToAdd,
                this.state.firstNameToAdd.charAt(0).toUpperCase() +
                  this.state.firstNameToAdd.substring(1).toLowerCase(),
                this.state.lastNameToAdd.charAt(0).toUpperCase() +
                  this.state.lastNameToAdd.substring(1).toLowerCase(),
                this.state.selectedClubInAdd,
              );
              this.setState({confirmAddingPlayer: false});
            }}
            onCancelPressed={() => {
              this.setState({confirmAddingPlayer: false});
            }}
          />

          <AwesomeAlert
            show={this.state.successRemovingPlayer}
            showProgress={false}
            title="Success"
            message={'The player has been removed'}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({successRemovingPlayer: false});
            }}
          />
          <AwesomeAlert
            show={this.state.successAddingPlayer}
            showProgress={false}
            title="Success"
            message={'The player has been added'}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({successAddingPlayer: false});
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
    textAlign: 'left',
    fontFamily: 'sans-serif-medium',
    // width: '80%',
    paddingHorizontal: 12,
    fontSize: 22,
    //marginVertical: 10,
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
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'flex-start',
    justifyContent: 'space-around',
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
});
