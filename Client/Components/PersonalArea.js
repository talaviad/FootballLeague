import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';

import {Header} from 'react-navigation-stack';
import GLOBALS from '../Globals';

export default class PersonalArea extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      isLoading: false,
      inbox: {
        newMessages: [],
      },
    };

    this.load = this.load.bind(this);
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
          'http://' +
            this.props.navigation.getParam('IP') +
            ':' +
            this.props.navigation.getParam('PORT') +
            '/?data=GetInbox',
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
        console.log(
          'In PersonalArea.js, load() - json.success: ' + json.success,
        );
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

    this.setState({inbox: inbox});
  }

  render() {
    return (
      <ImageBackground
        source={require('../Images/wall.jpg')}
        style={[styles.image, {flex: 1}, {opacity: 1}]}>
        <View
          style={{
            marginTop: 50,
            flex: 1,
            alignItems: 'center',
          }}>
          <View style={{justifyContent: 'space-evenly'}}>
            <AwesomeButtonCartman
              onPress={() =>
                this.props.navigation.navigate('Login', {
                  IP: this.props.navigation.getParam('IP'),
                  PORT: this.props.navigation.getParam('PORT'),
                })
              }
              style={{}}
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
              raiseLevel={2}
              height={50}
              width={300}
              borderRadius={10}>
              <ImageBackground
                source={require('../Images/star.png')}
                style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flex: 1,
                  }}>
                  {/* <Image
                    source={require('../Images/mikasa.png')}
                    style={{
                      flex: 0.4,
                      width: 140,
                      height: 140,
                      marginTop: -50,
                      alignSelf: 'flex-start',
                    }}
                  /> */}
                  <Text
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      fontSize: 25,
                      color: '#edf3f9',
                      fontFamily: 'sans-serif',
                      textAlign: 'center',
                    }}>
                    Log Out
                  </Text>
                </View>
              </ImageBackground>
            </AwesomeButtonCartman>
            <AwesomeButtonCartman
              onPress={() =>
                this.props.navigation.navigate('Change Password', {
                  IP: this.props.navigation.getParam('IP'),
                  PORT: this.props.navigation.getParam('PORT'),
                })
              }
              style={{marginTop: 25}}
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
              raiseLevel={2}
              height={50}
              width={300}
              borderRadius={10}>
              <ImageBackground
                source={require('../Images/star.png')}
                style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      fontSize: 25,
                      color: '#edf3f9',
                      fontFamily: 'sans-serif',
                      textAlign: 'center',
                    }}>
                    {'Change Password'}
                  </Text>
                </View>
              </ImageBackground>
            </AwesomeButtonCartman>
            <AwesomeButtonCartman
              onPress={() =>
                this.props.navigation.navigate('Inbox', {
                  inbox: this.state.inbox,
                  IP: this.props.navigation.getParam('IP'),
                  PORT: this.props.navigation.getParam('PORT'),
                })
              }
              style={{marginTop: 25}}
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
              raiseLevel={2}
              height={50}
              width={300}
              borderRadius={10}>
              <ImageBackground
                source={require('../Images/star.png')}
                style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      flex: 1,

                      alignSelf: 'center',
                      fontSize: 25,
                      color:
                        this.state.inbox.newMessages !== 0
                          ? '#BD1128'
                          : '#AED6F1', //'#edf3f9', //
                      fontFamily: 'sans-serif',
                      textAlign: 'center',
                    }}>
                    Inbox -{' '}
                    {this.state.inbox.newMessages !== 0
                      ? '' + this.state.inbox.newMessages + ' new messages'
                      : 'no new messages'}
                  </Text>
                </View>
              </ImageBackground>
            </AwesomeButtonCartman>
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

  rowOfTwoButton: {
    paddingVertical: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },

  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
