import React from 'react';

import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {CustomPicker} from 'react-native-custom-picker';
import {List, ListItem} from 'react-native-elements';

export default class Squads extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      isLoading: false,
      selectedClub: 'newClub3', //this.props.navigation.getParam('tableData')[0]
      clubsArrDict: this.props.navigation.getParam('tableData'),
      players: [],
    };
    alert('a: ' + JSON.stringify(this.props.navigation.getParam('teamList')));
    this.updatePlayerList();
  }

  updatePlayerList = () => {
    for (var i = 0; i < this.state.clubsArrDict.length; i++) {
      if (this.state.clubsArrDict[i].clubName === this.state.selectedClub) {
        this.state.players = this.state.clubsArrDict[i].players;
        alert(this.state.clubsArrDict[i].color);
        return;
      }
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>{this.state.c}</Text>
        <View
          style={{
            borderColor: 'black',
            backgroundColor: '#5499C7',
            borderWidth: 0.8,
          }}>
          {/* <CustomPicker
            options={this.props.navigation.getParam('teamList')}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({selectedClub: itemValue});
              this.updatePlayerList();
            }}
          /> */}
        </View>
        <View>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5499C7',
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
});
