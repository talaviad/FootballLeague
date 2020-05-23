import React from 'react';

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {CustomPicker} from 'react-native-custom-picker';
import {List, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Squads extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      isLoading: false,
      selectedClub: 'newClub3', //this.props.navigation.getParam('tableData')[0]
      clubsArrDict: this.props.navigation.getParam('tableData'),
      players: [],
      colorOfSelectedClub: null,
    };
    this.updatePlayerList();
  }

  updatePlayerList = () => {
    for (var i = 0; i < this.state.clubsArrDict.length; i++) {
      if (this.state.clubsArrDict[i].clubName === this.state.selectedClub) {
        this.state.players = this.state.clubsArrDict[i].players;
        this.state.colorOfSelectedClub = this.state.clubsArrDict[i].color;
        return;
      }
    }
  };

  render() {
    const state = this.state;
    return (
      <View style={styles.body}>
        <Image
          source={require('../Images/image2.jpg')}
          style={{width: '100%', height: '25%'}}
        />
        <View
          style={{
            flexDirection: 'row',
            flex: 0.5,
            backgroundColor: '#659DBD',
            width: '100%',
            height: '10%',
            //paddingTop: 15,
            //paddingBottom: 15,
          }}>
          <Icon
            name="tshirt"
            size={40}
            style={{
              marginTop: 15,
              marginLeft: 10,
              color: state.colorOfSelectedClub,
            }}
          />
          {/* <Text
            style={{
              color: 'white',
              fontSize: 30,
              paddingTop: 8,
              paddingLeft: 5,
            }}>
            {this.state.selectedClub}
          </Text> */}
          <View
            style={{
              flex: 1,
            }}>
            <CustomPicker
              style={{
                //alignSelf: 'center',
                textAlign: 'center',
                // backgroundColor: '#DBD9D2',
                //marginBottom: 10,
                fontSize: 30,
                // paddingTop: 8,
                paddingLeft: 5,
                marginLeft: -5,
              }}
              backdropStyle={{borderWidth: 3}}
              //modalStyle={{borderWidth: 3}}
              //containerStyle={{borderWidth: 3}}
              value={this.state.selectedClub}
              options={this.props.navigation.getParam('teamList')}
              fieldTemplate={this.renderField}
              optionTemplate={this.renderOption}
              // headerTemplate={this.renderHeader}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({selectedClub: itemValue});
                this.updatePlayerList();
              }}
            />
          </View>
        </View>

        <ScrollView>
          <View style={{flex: 1, backgroundColor: 'green'}}>
            {this.state.players.map((l, i) => (
              <ListItem
                key={i}
                leftIcon={<Text>{'#' + l.jerseyNumber}</Text>}
                //leftAvatar={{source: {uri: l.avatar_url}}}
                title={l.firstName + ' ' + l.lastName}
                bottomDivider
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // renderHeader() {
  //   return (
  //     <View style={styles.headerFooterContainer}>
  //       <Text>Clubs</Text>
  //     </View>
  //   );
  // }

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
              {/* <TouchableOpacity style={styles.clearButton} onPress={clear}>
                <Text style={{color: '#fff'}}>Clear</Text>
              </TouchableOpacity> */}
              <Text style={[styles.text]}>{getLabel(selectedItem)}</Text>
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

  renderOption(settings) {
    const {item, getLabel} = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, {backgroundColor: item.color}]} />
          <Text style={{color: item.color, alignSelf: 'flex-start'}}>
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
    backgroundColor: 'white',
  },
  head: {
    height: 28,
    backgroundColor: '#5D6D7E',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: '#F8F9F9',
  },
  row: {
    height: 55,
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
  },
  textLines: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#2C3E50',
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
  headerFooterContainer: {
    padding: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: 'grey',
    borderRadius: 5,
    marginRight: 10,
    padding: 5,
  },
  optionContainer: {
    padding: 10,
    borderBottomColor: 'grey',
    //borderBottomWidth: 1,
  },
  optionInnerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  box: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
