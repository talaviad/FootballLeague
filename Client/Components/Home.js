import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import BlinkView from 'react-native-blink-view';
import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Header} from 'react-navigation-stack';
import GLOBALS from '../Globals';

var IP = '132.72.23.63';
var PORT = '3079';

// var IP = '192.168.1.124';
// var PORT = '3000';

function RoundButton({title, color, background, onPress, disabled}) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[styles.button, {backgroundColor: background}]}
      activeOpacity={disabled ? 1.0 : 0.7}>
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, {color}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ButtonsRow({children}) {
  return <View style={styles.buttonsRow}>{children}</View>;
}
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      isLoggedIn: false,
      role: null,
      token: null,
      username: null,
      teamsNames: [],
      isLoading: false,
      liveResult: null,
    };
    this.handleSendRequestToServer = this.handleSendRequestToServer.bind(this);
    this.load = this.load.bind(this);
    this.getTeamsNames();
    this.checkLiveResult();
  }

  handleSendRequestToServer = async param => {
    let token = await AsyncStorage.getItem('token');
    this.setState({isLoading: true});
    let response = fetch('http://' + IP + ':' + PORT + '/?data=' + param, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Football-Request': param,
        Authorization: this.state.token,
      },
    })
      .then(response => {
        return response.json();
      })
      .then(resJson => {
        if (!resJson.success) {
          alert(resJson.error.msg);
          return;
        }
        this.setState({isLoading: false});

        switch (param) {
          case 'leagueTable':
            this.props.navigation.navigate('League Table', {
              tableData: resJson.tableData,
            });
            break;
          case 'scorerTable':
            this.props.navigation.navigate('Scorer Table', {
              tableData: resJson.tableData,
            });
            break;
          case 'clubs':
            this.props.navigation.navigate('Clubs', {
              tableData: resJson.tableData,
              teamList: this.state.teamsNames,
            });
            break;
          case 'register':
            this.props.navigation.navigate('Register');
            break;

          default:
            break;
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  async getTeamsNames() {
    let response;

    try {
      response = await fetch(
        'http://' + IP + ':' + PORT + '/?data=TeamsNames',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'TeamsNames',
          },
        },
      );
      const json = await response.json();
      this.state.teamsNames = json.teamsNames;
    } catch (err) {
      console.error(err);
    }
  }

  async checkLiveResult() {
    let response;
    try {
      response = await fetch(
        'http://' + IP + ':' + PORT + '/?data=getLiveResult',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'getLiveResult',
          },
        },
      );
      const json = await response.json();
      if (json.success) {
        this.setState({
          liveResult: {
            team1: json.team1,
            team2: json.team2,
            scoreTeam1: json.scoreTeam1,
            scoreTeam2: json.scoreTeam2,
          },
        });
      } else {
        this.setState({liveResult: null});
      }
    } catch (err) {
      this.setState({liveResult: null});
      console.error(err);
    }
  }

  componentDidMount() {
    //For live games
    this.timer = setInterval(() => {
      this.checkLiveResult();
    }, 10000);

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
    console.log('this.state.isLoggedIn: ' + this.state.isLoggedIn);
    let token;
    let currRole;
    let inbox = {
      messages: [],
      newMessages: 0,
    };

    try {
      token = await AsyncStorage.getItem('token');
      currRole = await AsyncStorage.getItem('role');
      username = await AsyncStorage.getItem('username');
      console.log('load(): currRole - ' + currRole);
      console.log('load(): token - ' + token);
      // If connected, bring new messages
      if (token !== 'none') {
        let response = await fetch(
          'http://' + IP + ':' + PORT + '/?data=GetInbox',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Football-Request': 'GetInbox',
              Authorization: token,
            },
          },
        );
        let json = await response.json();
        console.log('In Home.js, load() - json.success: ' + json.success);
        if (json.success) {
          console.log('json.inbox: ' + json.inbox);
          inbox = json.inbox;
          let newMessages = 0;
          for (let i = 0; i < json.inbox.messages.length; i++) {
            if (!json.inbox.messages[i].read) newMessages++;
          }
          inbox.newMessages = newMessages;
        } else console.log('Error message: ' + json.error.msg);
      }
    } catch (err) {
      console.log('in catch, err: ' + err);
      throw err;
    }

    console.log('isLoggedIn in end of load(): ' + token !== 'none');
    this.setState({
      isLoggedIn: token !== 'none',
      token: token,
      role: currRole,
      inbox: inbox,
      username: username,
    });
  }

  displayButtonByUser = () => {
    if (this.state.isLoggedIn && this.state.role === 'referee') {
      return (
        <View>
          <AwesomeButtonCartman
            onPress={() => {
              this.props.navigation.navigate('Referee Tools', {
                IP: IP,
                PORT: PORT,
                teamsNames: this.state.teamsNames,
              });
            }}
            backgroundDarker="#b3cce7"
            borderColor="#b3cce7"
            raiseLevel={4}
            height={100}
            width={100}
            borderRadius={50}>
            <ImageBackground
              source={require('../Images/star.png')}
              style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../Images/referee4.png')}
                  style={{
                    width: 200,
                    height: 200,
                  }}
                />
              </View>
            </ImageBackground>
          </AwesomeButtonCartman>
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              fontFamily: 'sans-serif-medium',
              textAlign: 'center',
            }}>
            {'Referee\nTools'}
          </Text>
        </View>
      );
    } else if (this.state.isLoggedIn && this.state.role === 'captain') {
      return (
        <View>
          <AwesomeButtonCartman
            onPress={() => {
              this.props.navigation.navigate('Captain Tools', {
                IP: IP,
                PORT: PORT,
              });
            }}
            backgroundDarker="#b3cce7"
            borderColor="#b3cce7"
            raiseLevel={4}
            height={100}
            width={100}
            borderRadius={50}>
            <ImageBackground
              source={require('../Images/star.png')}
              style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../Images/captain.png')}
                  style={{
                    width: 140,
                    height: 140,
                  }}
                />
              </View>
            </ImageBackground>
          </AwesomeButtonCartman>
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              fontFamily: 'sans-serif-medium',
              textAlign: 'center',
            }}>
            {'Captain\nTools'}
          </Text>
        </View>
      );
    }
    if (this.state.isLoggedIn && this.state.role === 'manager') {
      return (
        <View>
          <AwesomeButtonCartman
            onPress={() => {
              this.props.navigation.navigate('Manager Tools', {
                IP: IP,
                PORT: PORT,
                teamsNames: this.state.teamsNames,
              });
            }}
            backgroundDarker="#b3cce7"
            borderColor="#b3cce7"
            raiseLevel={4}
            height={100}
            width={100}
            borderRadius={50}>
            <ImageBackground
              source={require('../Images/star.png')}
              style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../Images/manager.png')}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
              </View>
            </ImageBackground>
          </AwesomeButtonCartman>
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              fontFamily: 'sans-serif-medium',
              textAlign: 'center',
            }}>
            {'Manager\nTools'}
          </Text>
        </View>
      );
    }
  };

  render() {
    return (
      <ImageBackground
        source={require('../Images/wall.jpg')}
        style={[styles.image, {flex: 1}, {opacity: 1}]}>
        <View style={{flex: 1}}>
          {this.state.liveResult !== null && (
            <View style={styles.liveResult}>
              <View>
                <BlinkView blinking={true} delay={750}>
                  <View
                    style={{
                      borderRadius: 50,
                      marginLeft: '10%',
                      width: 20,
                      height: 20,
                      backgroundColor: 'red',
                    }}
                  />
                </BlinkView>
                <Text style={styles.liveResultText2}>LIVE</Text>
              </View>

              <Text style={styles.liveResultText}>
                {this.state.liveResult.team1 +
                  ' - ' +
                  this.state.liveResult.team2 +
                  '  ' +
                  this.state.liveResult.scoreTeam1 +
                  '-' +
                  this.state.liveResult.scoreTeam2}
              </Text>
            </View>
          )}
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={
                  this.state.isLoggedIn
                    ? () =>
                        this.props.navigation.navigate('Personal Area', {
                          IP: IP,
                          PORT: PORT,
                        })
                    : () =>
                        this.props.navigation.navigate('Login', {
                          IP: IP,
                          PORT: PORT,
                        })
                }
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/user3.png')}
                      style={{
                        width: 100,
                        height: 100,
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                {this.state.isLoggedIn ? 'Personal\nArea' : 'Login'}
              </Text>
            </View>
            {this.displayButtonByUser()}
          </View>
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() => this.handleSendRequestToServer('leagueTable')}
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/excel.png')}
                      style={{
                        width: 60,
                        height: 60,
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                Table
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('Results', {
                    IP: IP,
                    PORT: PORT,
                  })
                }
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/result3.png')}
                      style={{
                        width: 110,
                        height: 110,
                        marginTop: '10%',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                Results
              </Text>
            </View>
          </View>
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() => {
                  this.handleSendRequestToServer('scorerTable');
                }}
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/scorer.png')}
                      style={{
                        width: 120,
                        height: 110,
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                {'Scorer\nTable'}
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() => {
                  this.handleSendRequestToServer('clubs');
                }}
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/club.png')}
                      style={{
                        width: 120,
                        height: 110,
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                Clubs
              </Text>
            </View>
          </View>
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() => {
                  this.props.navigation.navigate('Free Players', {
                    IP: IP,
                    PORT: PORT,
                  });
                }}
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/bench.png')}
                      style={{
                        width: 80,
                        height: 80,
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                {'Free\nPlayers'}
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('League Schedule', {
                    IP: IP,
                    PORT: PORT,
                    teamList: this.state.teamsNames,
                  })
                }
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/schedule3.png')}
                      style={{
                        width: 125,
                        height: 125,
                        marginRight: '8%',
                        marginTop: '7%',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                Schedule
              </Text>
            </View>
          </View>
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
  body: {
    // height: GLOBALS.windowHeightSize * (6 / 10),
    // height: Dimensions.get('window').height,
    // backgroundColor: '#5499C7',
  },
  sectionTwoBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  rowOfTwoButton: {
    paddingTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: '#5DADE2',
  },
  divided: {
    flex: 1,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  touchAble: {
    marginTop: 32,
    marginHorizontal: 40,
    paddingHorizontal: 24,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 5,
  },
  speacialButton: {
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#AED6F1',
    textAlign: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRow: {
    backgroundColor: '#4682b4',
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    //marginTop: 80,
    //marginBottom: 30,
    borderWidth: 0.8,
    //marginBottom: 0,
    position: 'absolute',
    alignSelf: 'center',
    //flex: 1,
    width: '100%',

    bottom: 0,
    flex: 1,
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
  liveResult: {
    borderWidth: 1,
    backgroundColor: '#295786',
    // position: 'absolute',
    // top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    height: '8%',
    width: '100%',
  },
  liveResultText: {
    fontSize: 16,
    fontFamily: 'sans-serif-medium',
  },
  liveResultText2: {
    // marginLeft: '2.5%',
    fontSize: 16,
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
    color: 'white',
  },
});
