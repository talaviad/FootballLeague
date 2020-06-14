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

export default class ManagerTools extends React.Component {
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
                  this.props.navigation.navigate('ManageSchedule', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
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
                      source={require('../Images/manageSched.png')}
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
                {'Manage\nSchedule'}
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('Add Club', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
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
                      source={require('../Images/addClub.png')}
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
                Add Club
              </Text>
            </View>
          </View>
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('Add Referee', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
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
                      source={require('../Images/addReferee.png')}
                      style={{
                        width: 230,
                        height: 230,
                        marginRight: '5%',
                        marginTop: '5%',
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
                Add Referee
              </Text>
            </View>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('PitchConstraints', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
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
                      /*source={require('../Images/club.png')}*/
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
                {'Set Pitch\nConstraints'}
              </Text>
            </View>
          </View>
          <View style={styles.rowOfTwoButton}>
            <View>
              <AwesomeButtonCartman
                onPress={() =>
                  this.props.navigation.navigate('Edit Club', {
                    IP: this.props.navigation.getParam('IP'),
                    PORT: this.props.navigation.getParam('PORT'),
                    teamList: this.props.navigation.getParam('teamsNames'),
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
                      source={require('../Images/edit.png')}
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
                Edit Club
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
