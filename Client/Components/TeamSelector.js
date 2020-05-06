import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Select2 from 'react-native-select-two'; // tal's old state

buildData = teamList => {
  const data = [];
  for (var i = 0; i < teamList.length; i++) {
    data.push({id: i + 1, name: teamList[i]});
  }
  return data;
};

export default class TeamSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamsNames: [],
    };
  }
  teamsData = buildData(this.props.teamList);

  render() {
    return (
      <View>
        <Select2
          isSelectSingle
          style={{borderRadius: 5}}
          colorTheme={'blue'}
          popupTitle="Select item"
          title="Select item"
          data={this.teamsData}
          onSelect={data => {
            this.setState({data});
            this.props.onSelect(this.teamsData[data - 1].name);
          }}
          onRemoveItem={data => {
            this.setState({data});
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: '#5499C7',
  },
  sectionTwoBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
