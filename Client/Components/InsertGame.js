import React, { Component } from 'react';
import { StyleSheet, View, Picker, TextInput, Text, Button } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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

  componentWillMount() {
    this.getTeamsNames('TeamsNames');

  }
  async getTeamsNames(name) {
    var IP = '192.168.1.124'
    const response = await fetch('http://' + IP + ':3000/?data=' + name, {
      method: "GET"
    })
    const json = await response.json()
    this.state.teamsNames = json.teamsNames
    var isLoading = false
    this.setState({ isLoading })
  }

  async sendResultToServer() {
    if (this.state.selectedTeam1 === this.state.selectedTeam2 | (isNaN(parseInt(this.state.scoreTeam1))) | (isNaN(parseInt(this.state.scoreTeam2)))| (parseInt(this.state.scoreTeam1)<0) 
    | (parseInt(this.state.scoreTeam1)>30) | (parseInt(this.state.scoreTeam2)<0) | (parseInt(this.state.scoreTeam2)>30) | (isNaN(parseInt(this.state.week)))|  (parseInt(this.state.week)<0)| (parseInt(this.state.week)>30))
     {       
      alert('Invalid Input');
      return; 
       }

    var IP = '192.168.1.124'
    console.log('vvvvv')
    const response = await fetch('http://' + IP + ':3000/?data=' + 'Result,' + this.state.selectedTeam1 +
      ',' + this.state.selectedTeam2 + ',' + this.state.scoreTeam1 + ',' + this.state.scoreteam2 + ','+ this.state.week,
      {
        method: "GET"
      }).then((response) => { return response.json() })
      .then((resJson) => {
        if (!resJson.success) {
          alert('An error with the server');
          return;
        }
        else {
          alert('The game updated successfully');
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    //var isLoading = false
    //this.setState({ isLoading })
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
                <Text style={{ marginLeft: 5, marginTop: 16 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            Week</Text>
                <TextInput
            style={{ marginLeft: 20,marginTop: 10, width: 50, height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(week) => this.setState({ week })}
            value={this.state.week}
          />
        </View>
        <View style={styles.rowTeam1}>
          <Text style={{ marginLeft: 5, marginTop: 16 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            Team1</Text>
          <Picker style={{ height: 50, width: 190 }}
            selectedValue={this.state.selectedTeam1}
            onValueChange={(value) => (this.setState({ selectedTeam1: value }))}>
            {this.teamList()}
          </Picker>
          <Text style={{ marginTop: 15 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            score:</Text>
          <TextInput
            style={{ marginLeft: 20, width: 50, height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(scoreTeam1) => this.setState({ scoreTeam1 })}
            value={this.state.scoreTeam1}
          />
        </View>
        <View style={styles.rowTeam2}>
          <Text style={{ marginLeft: 5, marginTop: 16 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            Team2</Text>
          <Picker style={{ height: 50, width: 190 }}
            selectedValue={this.state.selectedTeam2}
            onValueChange={(value) => (this.setState({ selectedTeam2: value }))}>
            {this.teamList()}
          </Picker>
          <Text style={{ marginTop: 15 }} borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
            score:</Text>
          <TextInput
            style={{ marginLeft: 20, width: 50, height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(scoreTeam2) => this.setState({ scoreTeam2 })}
            value={this.state.scoreTeam2}
          />
        </View>

        <View style={styles.rowButton}>
          <Button title='Insert Game Result' onPress={() => this.sendResultToServer()}> </Button>
        </View>
      </View>
    )
  }

}



// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 2,
//     marginTop: 15,
    
//   },
//   rowTeam1: {
//     flex: 2,
//     flexDirection: 'row',
//     justifyContent: 'flex-start', //replace with flex-end or center
//     borderBottomWidth: 0
//   },
//   rowTeam2: {
//     flex: 2,
//     flexDirection: 'row',
//     justifyContent: 'flex-start', //replace with flex-end or center
//     borderBottomWidth: 0,
//     marginBottom: 400
//   },
//   rowTeam3: {
//     flex: 1,
//     flexDirection: 'row',
//     //justifyContent: 'flex-start', //replace with flex-end or center
//    // borderBottomWidth: 0,
//     marginBottom: 100
//   },
//   rowButton: {
//     flex: 2,
//     flexDirection: 'row',
//     justifyContent: 'center', //replace with flex-end or center
//     borderBottomWidth: 0,
//   },
//   inputWrap: {
//     flex: 1,
//     borderColor: "#cccccc",
//     borderBottomWidth: 1,
//     marginBottom: 10
//   }
// });


const styles = StyleSheet.create({
  wrapper: {
    flex: 2,
    flexDirection: 'column',
    marginTop: 15,
    
  },
  rowTeam1: {
    flex: 0.9,
    flexDirection: 'row',
    //justifyContent: 'flex-start', //replace with flex-end or center
    //borderBottomWidth: 0
  },
  rowTeam2: {
    flex: 0.9,
    flexDirection: 'row',
    //justifyContent: 'flex-start', //replace with flex-end or center
    //borderBottomWidth: 0,
    marginTop: -250
  },
  rowTeam3: {
    flex: 0.2,
    flexDirection: 'row',
    //justifyContent: 'flex-start', //replace with flex-end or center
   // borderBottomWidth: 0,

  },
  rowButton: {
    flex: 0.2,
    //flexDirection: 'row',
    justifyContent: 'center', //replace with flex-end or center
    borderBottomWidth: 0,

  },
  inputWrap: {
    flex: 1,
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    marginBottom: 10
  }
});