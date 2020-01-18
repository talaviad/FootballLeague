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
      isLoading: true
    }
  }

  componentDidMount() {
    this.fetchData('GamesWeek1');
  }

  async fetchData(name) {
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
      this.setState({ tableData: json.tableData })
      let isLoading = false
      this.setState({ isLoading })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.language}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => {
            switch (itemIndex) {
              case 0:
                this.state.isLoading = true;
                this.fetchData('GamesWeek1')
                break;
              case 1:
                this.state.isLoading = true;
                this.fetchData('GamesWeek2')
                break;
            }
            ; this.setState({ language: itemValue })
          }
          }>
          <Picker.Item style={styles.pickerItem} label="week1" value="Week 1" />
          <Picker.Item style={styles.pickerItem} label="week2" value="Week 2" />
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

