import React from 'react';
import {
  StyleSheet,
  View,
  Picker,
  TextInput,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';

export default class InsertGame extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      teamsNames: [],
      scoreTeam1: '',
      scoreTeam2: '',
      week: '',
      selectedTeam1: null,
      selectedTeam2: null,
      isLoading: true
    }
    this.fetch = this.props.fetch ? this.props.fetch : fetch;
  }

  componentDidMount() {
    this.getTeamsNames('TeamsNames');
  }

  async getTeamsNames(name) {
    let response;
    try {
      response = await this.fetch('http://' + this.props.navigation.getParam('IP') + ':3000/?data=' + name, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': name,
        }
      })
      const json = await response.json()
      this.state.teamsNames = json.teamsNames
      var isLoading = false
      this.setState({ isLoading })
    } catch (err) {
      console.error(err);
    }
  }

  async sendResultToServer() {
    if (this.state.selectedTeam1 === this.state.selectedTeam2 || (isNaN(parseInt(this.state.scoreTeam1))) || (isNaN(parseInt(this.state.scoreTeam2))) || (parseInt(this.state.scoreTeam1) < 0)
      | (parseInt(this.state.scoreTeam1) > 30) || (parseInt(this.state.scoreTeam2) < 0) || (parseInt(this.state.scoreTeam2) > 30) || (isNaN(parseInt(this.state.week))) || (parseInt(this.state.week) < 0) || (parseInt(this.state.week) > 30)) {
      alert('Invalid Input');
      return;
    }
    try {
      const response = await fetch('http://' + this.props.navigation.getParam('IP') + ':3000/?data=' + 'Result,' + this.state.selectedTeam1 +
        ',' + this.state.selectedTeam2 + ',' + this.state.scoreTeam1 + ',' + this.state.scoreTeam2 + ',' + this.state.week,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'Result',
          }
        })
      const resJson = await response.json()
      if (!resJson.success) {
        alert('error: ' + resJson.error.msg);
        return;
      }
      else {
        alert('The game updated successfully');
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  teamList = () => {
    return (this.state.teamsNames.map((x, i) => {
      return (<Picker.Item label={x} key={i} value={x} />)
    }));
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.wrapper}>
        <View style={styles.firstView}>
          <Text style={{ textAlignVertical: 'center', textAlign: 'right', flex: 2, fontWeight: 'bold' }} borderStyle={{ borderWidth: 1 }}>Week:</Text>
          <View style={{ flex: 2, alignItems: 'flex-start' }}>
            <TextInput
              style={{ height: '80%', width: '50%', borderColor: '#5499C7' }} //borderWidth: 10,
              underlineColorAndroid='#2C3E50'
              onChangeText={(week) => this.setState({ week })}
              value={this.state.week}
            />
          </View>
        </View>

        <View style={styles.secondView}>

          <View style={styles.secondView_1}>
            <Text style={{ width: '100%', textAlign: 'center', textAlignVertical: 'bottom', flex: 1, fontWeight: 'bold', fontSize: 15 }}>
              Team1:</Text>
            <Picker style={{ width: '100%', flex: 1 }}
              selectedValue={this.state.selectedTeam1}
              onValueChange={(value) => (this.setState({ selectedTeam1: value }))}>
              {this.teamList()}
            </Picker>
            <Text style={{ width: '100%', textAlign: 'center', textAlignVertical: 'bottom', flex: 1, fontWeight: 'bold', fontSize: 15 }}>
              Score:</Text>
            <View style={{ alignItems: 'center', width: '100%', flex: 1.2 }}>
              <TextInput
                style={{ height: '50%', width: '50%' }}
                underlineColorAndroid='#2C3E50'
                onChangeText={(scoreTeam1) => this.setState({ scoreTeam1 })}
                value={this.state.scoreTeam1}
              />
            </View>
          </View>

          <View style={styles.secondView_2}>
            <Text style={{ width: '100%', textAlign: 'center', textAlignVertical: 'bottom', flex: 1, fontWeight: 'bold', fontSize: 15 }}>
              Team2:</Text>
            <Picker style={{ width: '100%', flex: 1 }}
              selectedValue={this.state.selectedTeam2}
              onValueChange={(value) => (this.setState({ selectedTeam2: value }))}>
              {this.teamList()}
            </Picker>
            <Text style={{ width: '100%', textAlign: 'center', textAlignVertical: 'bottom', flex: 1, fontWeight: 'bold', fontSize: 15 }}>
              Score:</Text>
            <View style={{ alignItems: 'center', width: '100%', flex: 1.2 }}>
              <TextInput
                style={{ height: '50%', width: '50%' }}
                underlineColorAndroid='#2C3E50'
                onChangeText={(scoreTeam2) =>this.setState({ scoreTeam2 })}
                value={this.state.scoreTeam2}
              />
            </View>
          </View>
        </View>

        <View style={{ alignItems: 'center', flex: 2 }}>
          <TouchableOpacity style={styles.button} onPress={() => this.sendResultToServer()}>
            <Text style={styles.buttonText}>Insert Game Result</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    //height: '100%',
    flex: 1,
    //flexWrap: 'wrap',
    //flexGrow: 1,
    //flexDirection: 'row',
    backgroundColor: '#5499C7',
  },
  firstView: {
    //width: '100%',
    //height: 20,
    flex: 1,
    flexDirection: 'row',
  },
  secondView: {
    width: '100%',
    //height: 40,
    flex: 3,
    flexDirection: 'row',
  },
  secondView_1: {
    //width: '100%',
    //height: 40,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#154360'
    //flexDirection: 'row',
  },
  secondView_2: {
    //width: '100%',
    //height: 40,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#154360'
    //flexDirection: 'row',
  },
  rowButton: {
    flex: 0.2,
    justifyContent: 'center', //replace with flex-end or center
    borderBottomWidth: 0,
  },
  inputWrap: {
    flex: 1,
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    marginBottom: 10
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    //marginHorizontal: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#AED6F1',
    textAlign: 'center',
  },
});