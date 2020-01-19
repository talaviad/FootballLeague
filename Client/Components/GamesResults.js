import React from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

export default class GamesResults extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      tableHead: ['Team1', 'Result', 'Team2'],
      tableData: null,
      numberOfWeeks: [],
      selectedWeek: '',
      isLoading: true
    }
  }

  componentDidMount() {
    this.getNumberOfWeeks();
  }

  async getNumberOfWeeks() {
    let response;
    try {
      response = await fetch('http://' + this.props.navigation.getParam('IP') + ':3000/?data=NumberOfWeeks', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'NumberOfWeeks',
        }
      })
      const json = await response.json()
      this.state.numberOfWeeks = json.numberOfWeeks
       this.setState({ numberOfWeeks:json.numberOfWeeks })
       var isLoading = false
       //this.setState({ isLoading })
    } catch (err) {
      console.error(err);
    }
  }

  async fetchData(name) {
    let response;
    try {
      response = await fetch('http://' + this.props.navigation.getParam('IP') + ':3000/?data=' + name, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': name.substring(0,9),
        }
      })
      const json = await response.json()
      this.setState({ tableData: json.tableData })
      let isLoading = false
      this.setState({ isLoading })
    } catch (err) {
      console.error(err)
    }
  }
  weeksList = () => {
    return (this.state.numberOfWeeks.map((x, i) => {
      return (<Picker.Item label={'Week'+x.toString()} key={i} value={x.toString()} />)
    }));
  }
  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.selectedWeek}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ selectedWeek: itemValue })
            this.state.isLoading = true;
            this.fetchData('GamesWeek'+itemValue)
          }
          }>
          { this.weeksList()}
        </Picker>
        <Table borderStyle={{ borderWidth: 1 }} style={styles.tableStyle}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={this.state.isLoading ? null : this.state.tableData} style={styles.row} textStyle={styles.textLines} />
        </Table>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#5499C7',
  },
  itemStyle: {
    fontSize: 45,
    height: 278,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  tableStyle: {
    height: '30%',
    marginTop: 32,
  },
  picker: {
    height: '10%',
    width: '100%',
    textAlign: 'center'
  },
  pickerItem: {
    textAlign: 'center'
  },
  head: {
    height: '20%',
    backgroundColor: '#5D6D7E'
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1'
  },
  row: {
    height: '50%',
    backgroundColor: '#D6EAF8'
  },
  textLines: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#2C3E50'
  }
});

