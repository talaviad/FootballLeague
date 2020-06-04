import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';

import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';

import {Header} from 'react-navigation-stack';
import GLOBALS from '../Globals';

export default class PersonalArea extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      isLoading: false,
    };
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
              onPress={() => {}}
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
                    {'Inbox Messages'}
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
