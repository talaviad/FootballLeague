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

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Header} from 'react-navigation-stack';
import GLOBALS from '../Globals';

// var IP = '132.72.23.63';
// var PORT = '3079';

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
export default class RefereeTools extends React.Component {
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
    };
    this.handleSendRequestToServer = this.handleSendRequestToServer.bind(this);
    this.load = this.load.bind(this);
    this.getTeamsNames();
  }

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

  componentDidMount() {
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

  render() {
    return (
      <ImageBackground
        source={require('../Images/wall.jpg')}
        style={[styles.image, {flex: 1}, {opacity: 1}]}>
        <View style={{marginTop: 5, flex: 1}}>
          {/* <ScrollView style={styles.body}> */}
          {/* <View style={styles.sectionTwoBtnContainer}>
            {!this.state.isLoggedIn ? (
              <TouchableOpacity
                style={styles.divided}
                onPress={() =>
                  this.props.navigation.navigate('Register', {
                    IP: IP,
                    PORT: PORT,
                  })
                }>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={styles.divided}
              onPress={() =>
                this.props.navigation.navigate('Login', {IP: IP, PORT: PORT})
              }>
              <Text style={styles.buttonText}>
                {this.state.isLoggedIn ? 'Logout' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View> */}
          {/* {this.state.isLoggedIn ? (
            <TouchableOpacity
              style={styles.touchAble}
              onPress={() =>
                this.props.navigation.navigate('Inbox', {
                  inbox: this.state.inbox,
                  IP: IP,
                  PORT: PORT,
                })
              }>
              {console.log(
                'this.state.inbox.messages.length: ' +
                  this.state.inbox.messages.length,
              )}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  color:
                    this.state.inbox.newMessages !== 0 ? '#BD1128' : '#AED6F1',
                  textAlign: 'center',
                }}>
                Inbox -{' '}
                {this.state.inbox.newMessages !== 0
                  ? '' + this.state.inbox.newMessages + ' new messages'
                  : 'no new messages'}
              </Text>
            </TouchableOpacity>
          ) : null} */}
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={
                  this.state.isLoggedIn
                    ? null
                    : () =>
                        this.props.navigation.navigate('Login', {
                          IP: IP,
                          PORT: PORT,
                        })
                }
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                height={80}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/login5.png')}
                      style={{
                        width: 80,
                        height: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                {this.state.isLoggedIn ? 'Personl Area' : 'Login'}
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() => {}}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                height={80}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/result3.png')}
                      style={{
                        width: 120,
                        height: 110,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                NOTHING
              </Text>
            </View>
          </View>
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() => this.handleSendRequestToServer('leagueTable')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                height={80}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/table2.png')}
                      style={{
                        width: 120,
                        height: 110,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                Table
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('GamesResults', {
                    IP: IP,
                    PORT: PORT,
                  })
                }
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../Images/result3.png')}
                      style={{
                        width: 120,
                        height: 110,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
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
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                height={80}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
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
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                Scorer Table
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() => {
                  this.handleSendRequestToServer('clubs');
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                height={80}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
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
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
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
                  this.handleSendRequestToServer('scorerTable');
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                height={80}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
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
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                Referee Tools
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() => {}}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                backgroundColor="#3f7ec1"
                backgroundActive="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundDarker="#b3cce7"
                backgroundPlaceholder="#b3cce7"
                borderColor="#b3cce7"
                type="primary"
                textColor="#FFF"
                textSize={18}
                height={80}
                raiseLevel={4}
                height={100}
                width={100}
                borderRadius={50}>
                <ImageBackground
                  source={require('../Images/star.png')}
                  style={{height: 100, width: 100}}>
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
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                </ImageBackground>
              </AwesomeButtonCartman>
              <Text
                style={{
                  fontSize: 20,
                  color: '#edf3f9',
                  fontFamily: 'sans-serif-medium',
                  textAlign: 'center',
                }}>
                NOTHING
              </Text>
            </View>
          </View>
          {this.state.isLoggedIn &&
          (this.state.role === 'referee' || this.state.role === 'manager') ? (
            <View style={styles.rowOfTwoButton}>
              <View>
                <AwesomeButtonCartman
                  onPress={() =>
                    this.props.navigation.navigate('InsertGame', {
                      IP: IP,
                      PORT: PORT,
                      teamList: this.state.teamsNames,
                    })
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  backgroundColor="#3f7ec1"
                  backgroundActive="#b3cce7"
                  backgroundDarker="#b3cce7"
                  backgroundDarker="#b3cce7"
                  backgroundPlaceholder="#b3cce7"
                  borderColor="#b3cce7"
                  type="primary"
                  textColor="#FFF"
                  textSize={18}
                  height={80}
                  raiseLevel={4}
                  height={100}
                  width={100}
                  borderRadius={50}>
                  <ImageBackground
                    source={require('../Images/star.png')}
                    style={{height: 100, width: 100}}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../Images/table2.png')}
                        style={{
                          width: 120,
                          height: 110,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      />
                    </View>
                  </ImageBackground>
                </AwesomeButtonCartman>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#edf3f9',
                    fontFamily: 'sans-serif-medium',
                    textAlign: 'center',
                  }}>
                  Insert Result
                </Text>
              </View>
              <View>
                <AwesomeButtonCartman
                  onPress={() =>
                    this.props.navigation.navigate('GameMode', {
                      IP: IP,
                      PORT: PORT,
                      teamList: this.state.teamsNames,
                    })
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  backgroundColor="#3f7ec1"
                  backgroundActive="#b3cce7"
                  backgroundDarker="#b3cce7"
                  backgroundDarker="#b3cce7"
                  backgroundPlaceholder="#b3cce7"
                  borderColor="#b3cce7"
                  type="primary"
                  textColor="#FFF"
                  textSize={18}
                  height={80}
                  raiseLevel={4}
                  height={100}
                  width={100}
                  borderRadius={50}>
                  <ImageBackground
                    source={require('../Images/star.png')}
                    style={{height: 100, width: 100}}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../Images/gameMode6.png')}
                        style={{
                          width: 120,
                          height: 110,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      />
                    </View>
                  </ImageBackground>
                </AwesomeButtonCartman>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#edf3f9',
                    fontFamily: 'sans-serif-medium',
                    textAlign: 'center',
                  }}>
                  Game Mode
                </Text>
              </View>
            </View>
          ) : // <TouchableOpacity
          //   style={styles.touchAble}
          //   onPress={() =>
          //     this.props.navigation.navigate('InsertGame', {
          //       IP: IP,
          //       PORT: PORT,
          //       teamList: this.state.teamsNames,
          //     })
          //   }>
          //   <Text style={styles.buttonText}>Insert a game result</Text>
          // </TouchableOpacity>
          null}

          {/* {this.state.isLoggedIn &&
          (this.state.role === 'referee' || this.state.role === 'manager') ? (
            <TouchableOpacity
              style={styles.touchAble}e
              onPress={() =>
                this.props.navigation.navigate('GameMode', {
                  IP: IP,
                  PORT: PORT,
                  teamList: this.state.teamsNames,
                })
              }>
              <Text style={styles.buttonText}>Enter game mode</Text>
            </TouchableOpacity>
          ) : null} */}
          {/* {(this.state.isLoggedIn && this.state.role === 'captain') ||
          this.state.role === 'referee' ? (
            <TouchableOpacity
              style={styles.touchAble}
              onPress={() => this.handleSendRequestToServer('GetConstraints')}>
              <Text style={styles.buttonText}>
                {this.state.role === 'captain'
                  ? 'My Team Constraints'
                  : 'My Referee Constraints'}
              </Text>
            </TouchableOpacity>
          ) : null} */}
          {this.state.isLoggedIn && this.state.role === 'manager' ? (
            <TouchableOpacity
              style={styles.touchAble}
              onPress={() =>
                this.props.navigation.navigate('ManageSchedule', {
                  IP: IP,
                  PORT: PORT,
                })
              }>
              <Text style={styles.buttonText}>Manage Schedule</Text>
            </TouchableOpacity>
          ) : null}
          {this.state.isLoggedIn &&
          (this.state.role === 'captain' || this.state.role === 'referee') ? (
            <TouchableOpacity
              style={styles.touchAble}
              onPress={() =>
                this.props.navigation.navigate('LeagueSchedule', {
                  IP: IP,
                  PORT: PORT,
                })
              }>
              <Text style={styles.buttonText}>League Schedule</Text>
            </TouchableOpacity>
          ) : null}
          {this.state.isLoggedIn && this.state.role === 'manager' ? (
            <TouchableOpacity
              style={styles.touchAble}
              onPress={() =>
                this.props.navigation.navigate('PitchConstraints', {
                  IP: IP,
                  PORT: PORT,
                })
              }>
              <Text style={styles.buttonText}>Set Pitch Constraints</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.loadingStyle}>
            {this.state.isLoading && (
              <ActivityIndicator color={'#fff'} size={80} />
            )}
          </View>
          {/* </ScrollView> */}
          <View style={{height: GLOBALS.windowHeightSize / 10}}>
            {this.state.role === 'manager' && (
              <ButtonsRow>
                <RoundButton
                  title="Add New Referee"
                  color="#5f9ea0"
                  background="#3D3D3D"
                  onPress={() => {
                    this.props.navigation.navigate('AddReferee', {
                      IP: IP,
                      PORT: PORT,
                    });
                  }}
                />
                <RoundButton
                  title="Add New Club"
                  color="#5f9ea0"
                  background="#3D3D3D"
                  onPress={() => {
                    this.props.navigation.navigate('AddClub', {
                      IP: IP,
                      PORT: PORT,
                    });
                  }}
                />
                <RoundButton
                  title="Change Password"
                  color="#5f9ea0"
                  background="#3D3D3D"
                  onPress={() => {
                    this.props.navigation.navigate('ChangePassword', {
                      IP: IP,
                      PORT: PORT,
                      username: this.state.username,
                    });
                  }}
                />
              </ButtonsRow>
            )}
          </View>
          <View style={{height: GLOBALS.windowHeightSize / 10}}>
            {this.state.isLoggedIn && this.state.role === 'referee' && (
              <ButtonsRow>
                <RoundButton
                  title="Change Password"
                  color="#5f9ea0"
                  background="#3D3D3D"
                  onPress={() => {
                    this.props.navigation.navigate('ChangePassword', {
                      IP: IP,
                      PORT: PORT,
                      username: this.state.username,
                    });
                  }}
                />
              </ButtonsRow>
            )}
          </View>

          {/* <View
            style={{
              height: '10%',
              width: '100%',
              position: 'absolute',
              borderWidth: 1,
              bottom: 0,
            }}>
            <ImageBackground
              source={require('../Images/star.png')}
              style={{flex: 1}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Login', {
                      IP: IP,
                      PORT: PORT,
                    })
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '20%',
                    marginLeft: 150,
                  }}
                  backgroundColor="#3f7ec1"
                  backgroundActive="#b3cce7"
                  backgroundDarker="#b3cce7"
                  backgroundDarker="#b3cce7"
                  borderWidth={1}
                  backgroundPlaceholder="#b3cce7"
                  borderColor="black"
                  type="primary"
                  textColor="#FFF"
                  textSize={18}
                  height={80}
                  raiseLevel={4}
                  height={60}
                  width={60}
                  borderRadius={50}>
                  <Icon2 name="user-circle" size={40} />

                  <Text style={{fontFamily: 'sans-serif-medium', fontSize: 20}}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View> */}
          <View style={{height: GLOBALS.windowHeightSize / 10}}>
            {this.state.role === 'captain' && (
              <ButtonsRow>
                <RoundButton
                  title="Change Password"
                  color="#5f9ea0"
                  background="#3D3D3D"
                  onPress={() => {
                    this.props.navigation.navigate('ChangePassword', {
                      IP: IP,
                      PORT: PORT,
                      username: this.state.username,
                    });
                  }}
                />
              </ButtonsRow>
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
    paddingVertical: '5%',
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
});
