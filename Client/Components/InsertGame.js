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
  }

  componentDidMount() {
    this.getTeamsNames('TeamsNames');
  }

  async getTeamsNames(name) {
    let response;
    try {
      response = await fetch('http://' + this.props.navigation.getParam('IP') + ':3000/?data=' + name, {
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
        ',' + this.state.selectedTeam2 + ',' + this.state.scoreTeam1 + ',' + this.state.scoreteam2 + ',' + this.state.week,
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

  // Our country list generator for picker
  teamList = () => {
    console.log(this.state.teamsNames)
    return (this.state.teamsNames.map((x, i) => {
      return (<Picker.Item label={x} key={i} value={x} />)
    }));
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.wrapper}>
        <View style={styles.rowTeam3}>
          <Text style={{ fontWeight: 'bold', marginLeft: 5, marginTop: 16 }} borderStyle={{ borderWidth: 1, borderColor: '' }}>
            Week:</Text>
          <TextInput
            style={{ textAlign: 'center', marginLeft: 20, marginTop: 10, height: 40, borderColor: '#5499C7', borderWidth: 10, }}
            underlineColorAndroid='#2C3E50'
            onChangeText={(week) => this.setState({ week })}
            value={this.state.week}
          />
        </View>
        <View style={styles.rowTeam1}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5, marginTop: 65 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            Team1:</Text>
          <Picker style={{ height: 50, width: 190, marginTop: 50 }}
            selectedValue={this.state.selectedTeam1}
            onValueChange={(value) => (this.setState({ selectedTeam1: value }))}>
            {this.teamList()}
          </Picker>
          <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 65 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            Score:</Text>
          <TextInput
            style={{ textAlign: 'center', marginLeft: 20, marginTop: 60, height: 40, borderColor: '#5499C7', borderWidth: 10 }}
            underlineColorAndroid='#2C3E50'
            onChangeText={(scoreTeam1) => this.setState({ scoreTeam1 })}
            value={this.state.scoreTeam1}
          />
        </View>
        <View style={styles.rowTeam2}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5, marginTop: 65 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            Team2:</Text>
          <Picker style={{ border: '100px solid red', height: 50, width: 190, marginTop: 50 }}
            selectedValue={this.state.selectedTeam2}
            onValueChange={(value) => (this.setState({ selectedTeam2: value }))}>
            {this.teamList()}
          </Picker>
          <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 65 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            Score:</Text>
          <TextInput
            style={{ textAlign: 'center', marginTop: 60, marginLeft: 20, height: 40, borderColor: '#5499C7', borderWidth: 10 }}
            underlineColorAndroid='#2C3E50'
            onChangeText={(scoreTeam2) => this.setState({ scoreTeam2 })}
            value={this.state.scoreTeam2}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => this.sendResultToServer()}>
          <Text style={styles.buttonText}>Insert Game Result</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    flex: 2,
    flexDirection: 'column',
    backgroundColor: '#5499C7',
  },
  rowTeam1: {
    flex: 0.9,
    flexDirection: 'row',
  },
  rowTeam2: {
    flex: 0.9,
    flexDirection: 'row',
    marginTop: -250
  },
  rowTeam3: {
    flex: 0.2,
    flexDirection: 'row',
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
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    marginHorizontal: '10%',
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#AED6F1',
    textAlign: 'center',
  },
});