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

export default class RefereeTools extends React.Component {
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
        <View style={{marginTop: 5, flex: 1}}>
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('Game Mode', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
                    teamList: this.props.navigation.getParam('teamsNames'),
                  })
                }
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={Dimensions.get('window').height / 7}
                width={Dimensions.get('window').height / 7}
                borderRadius={Dimensions.get('window').height / 14}>
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
                      source={require('../Images/gameMode6.png')}
                      style={{
                        width: 110,
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
                Game Mode
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('Insert Result', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
                    teamList: this.props.navigation.getParam('teamsNames'),
                  })
                }
                style={{
                  marginLeft: 6,
                }}
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={Dimensions.get('window').height / 7}
                width={Dimensions.get('window').height / 7}
                borderRadius={Dimensions.get('window').height / 14}>
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
                {'Insert Result'}
              </Text>
            </View>
          </View>
          <View style={styles.rowOfOneButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('Constraints', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
                  })
                }
                backgroundDarker="#b3cce7"
                borderColor="#b3cce7"
                raiseLevel={4}
                height={Dimensions.get('window').height / 7}
                width={Dimensions.get('window').height / 7}
                borderRadius={Dimensions.get('window').height / 14}>
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
                      source={require('../Images/constraints.png')}
                      style={{
                        width: 95,
                        height: 95,
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
                Constraints
              </Text>
            </View>
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
  rowOfOneButton: {
    paddingVertical: '5%',
    flexDirection: 'row',
    marginLeft: '12.5%',
    //justifyContent: '',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
