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
      selectedClub: '',
      confirmRemovingPlayer: false,
      playerJerseyNumToRemove: '',
      playersList: [],
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
      playersList: data,
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
          playerJerseyNUmber: playerJerseyNumToRemove,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        this.setState({isLoading: false});
        if (resJson.success) {
          this.setState({confirmRemovingPlayer: true});
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
                  this.setState({selectedClub: text});
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
                  data={this.state.playersList}
                  onSelect={id => {
                    var arr = this.state.playersList[id - 1].name.split(' ');
                    this.setState({
                      playerJerseyNumToRemove: arr[0].substring(1),
                    });
                  }}
                />
              </View>
              <Icon.Button
                name="delete"
                backgroundColor="" //this line is important, it's canceling the deafult color
                color={'red'}
                size={38}
                onPress={() => {
                  if (this.state.playerJerseyNumToRemove !== '') {
                    this.removePlayer(
                      this.state.playerJerseyNumToRemove,
                      this.state.selectedClub,
                    );
                  }
                }}
              />
            </View>
          </View>

          <AwesomeAlert
            show={this.state.confirmRemovingPlayer}
            showProgress={false}
            title="Confirmation"
            message={'The Club has been removed'}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor="#8fbc8f"
            onConfirmPressed={() => {
              this.setState({confirmRemovingPlayer: false});
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
});
