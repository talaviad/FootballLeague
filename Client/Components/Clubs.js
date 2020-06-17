import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {CustomPicker} from 'react-native-custom-picker';
import {List, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TabView} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import {Table, Row, TableWrapper} from 'react-native-table-component';

export default class Clubs extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      selectedClub: this.props.navigation.getParam('tableData')[0].clubName,
      clubsArrDict: this.props.navigation.getParam('tableData'),
      currentClubDict: null,
      index: 0,
      routes: [
        {key: 'squad', title: 'Squad'},
        {key: 'teamResults', title: 'Results'},
        {key: 'playersStats', title: 'Players Stats'},
      ],
    };
    //updating the currentClubDict according to this.state.selectedClub
    this.updatePlayerList(this.state.selectedClub);
  }

  _handleIndexChange = index => this.setState({index}); //for the tab view

  squadsRoute = () => (
    <ScrollView>
      {this.state.currentClubDict.players
        .sort((a, b) => a.jerseyNumber - b.jerseyNumber) //sorting the list by the jersey number
        .map((l, i) => (
          <ListItem
            containerStyle={{backgroundColor: ''}} //this line is important, canceling the deafult color
            // key={i}
            leftIcon={
              <Text style={{fontSize: 19, fontFamily: 'serif'}}>
                {l.jerseyNumber}
              </Text>
            }
            title={
              <Text style={{fontSize: 18, fontFamily: 'sans-serif-condensed'}}>
                {l.firstName + ' ' + l.lastName}
              </Text>
            }
            // bottomDivider
          />
        ))}
    </ScrollView>
  );

  teamsResultsRoute = () => (
    <ScrollView>
      <Table>
        <Table>
          {this.state.currentClubDict.results.length === 0 ? (
            <Row
              style={[styles.row, {fontSize: 20}]}
              textStyle={styles.textLines}
              data={['No Games']}
            />
          ) : (
            this.state.currentClubDict.results
              .sort((a, b) => this.dateToNum(a.date) - this.dateToNum(b.date))
              .map((dataRow, index) => [
                <Row
                  key={index}
                  data={[
                    dataRow.team1,
                    dataRow.result,
                    dataRow.team2,
                    dataRow.date,
                  ]}
                  style={styles.row}
                  textStyle={styles.textLines}
                  flexArr={[60, 30, 60, 40]}
                />,
              ])
          )}
        </Table>
      </Table>
    </ScrollView>
  );
  playersStatsRoute = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{alignItems: 'center'}}>
      <Table
        borderStyle={{
          borderBottomWidth: 0,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 28,
            alignSelf: 'flex-start',
            fontFamily: 'sans-serif-light',
          }}>
          Goals
        </Text>
        <TableWrapper
          style={{
            borderWidth: 0.5,
            width: '80%',
            alignItems: 'center',
          }}>
          {this.state.currentClubDict.players
            .sort((a, b) => b.goals - a.goals)
            .map((player, index) => (
              <Row
                key={index}
                data={[
                  index + 1 + '.',
                  player.firstName + ' ' + player.lastName,
                  player.goals,
                ]}
                style={styles.row}
                textStyle={[styles.textLines, {fontSize: 18}]}
                flexArr={[20, 50, 20]}
              />
            ))}
        </TableWrapper>
      </Table>
    </ScrollView>
  );
  dateToNum = d => {
    // Convert date "26/06/2016" to 20160626
    d = d + '';
    d = d.split('/');
    d[2] = '20' + d[2];
    return Number(d[2] + d[1] + d[0]);
  };

  _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const color = Animated.color(
            Animated.round(
              Animated.interpolate(props.position, {
                inputRange,
                outputRange: inputRange.map(inputIndex =>
                  inputIndex === i ? 220 : 0,
                ),
              }),
            ),
            0,
            0,
          );

          return (
            <TouchableOpacity
              style={
                i === this.state.index
                  ? [styles.tabItem, {borderBottomWidth: 2}]
                  : styles.tabItem
              }
              onPress={() => this.setState({index: i})}>
              <Animated.Text style={{color}}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
          f;
        })}
      </View>
    );
  };

  renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'squad':
        return this.squadsRoute();
      case 'teamResults':
        return this.teamsResultsRoute();
      case 'playersStats':
        return this.playersStatsRoute();
    }
  };

  updatePlayerList = clubName => {
    for (var i = 0; i < this.state.clubsArrDict.length; i++) {
      if (this.state.clubsArrDict[i].clubName === clubName) {
        this.state.currentClubDict = this.state.clubsArrDict[i];
        return;
      }
    }
  };

  render() {
    const state = this.state;
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={[styles.image, {flex: 1}]}
        imageStyle={{opacity: 0.7}}>
        <View style={styles.body}>
          <Image
            source={
              this.state.selectedClub === 'Shoer Medume'
                ? require('../Images/shoerMedume.png')
                : require('../Images/image2.jpg')
            }
            style={{width: '100%', height: '30%'}}
          />
          <View
            style={{
              flexDirection: 'row',
              flex: 0.2,
              // backgroundColor: '#3B8EBE',
              width: '100%',
              height: '10%',
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <CustomPicker
                style={{
                  textAlign: 'center',
                  fontSize: 30,
                  paddingLeft: 5,
                  marginLeft: -5,
                }}
                backdropStyle={{borderWidth: 3}}
                value={this.state.selectedClub}
                options={this.props.navigation.getParam('teamList')}
                fieldTemplate={this.renderField}
                optionTemplate={this.renderOption}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedClub: itemValue});
                  this.updatePlayerList(itemValue);
                }}
              />
            </View>
            <Icon
              name="tshirt"
              size={40}
              style={{
                marginTop: 18,
                marginRight: 15,
                color: this.state.currentClubDict.color,
              }}
            />
          </View>
          <TabView
            style={{/*backgroundColor: '#DEF2F1',*/ flex: 1}}
            navigationState={this.state}
            renderScene={this.renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
          />
        </View>
      </ImageBackground>
    );
  }

  //part of the picker, the views of the selected field.
  renderField(settings) {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={styles.container}>
        <View>
          {!selectedItem && (
            <Text style={[styles.text, {color: 'grey'}]}>{defaultText}</Text>
          )}
          {selectedItem && (
            <View style={styles.innerContainer}>
              <Text
                style={[
                  styles.text,
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
          <Text
            style={{
              fontFamily: 'sans-serif-condensed',
              fontSize: 17,
              color: item.color,
              alignSelf: 'flex-start',
            }}>
            {getLabel(item)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  head: {
    height: 28,
    // backgroundColor: '#5D6D7E',
  },

  row: {
    height: 55,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
  },
  textLines: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    // color: '#2C3E50',
    fontSize: 16,
  },
  container: {
    borderColor: 'grey',
    padding: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  text: {
    color: 'white',
    fontSize: 30,
    paddingTop: 8,
    paddingLeft: 5,
  },

  optionContainer: {
    padding: 10,
    borderBottomColor: 'grey',
  },

  box: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  tabBar: {
    flexDirection: 'row',
    borderWidth: 0.8,
  },
  tabItem: {
    backgroundColor: '#ECECEC', //color of the tabs
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 0.5,
    padding: 16,
  },
});
