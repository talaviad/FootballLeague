import React, { Component } from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class GameResults extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      tableHead: ['Team1', 'Result', 'Team2'],
      tableData: null,
      isLoading : true
    }
  }

  componentWillMount() {
    this.fetchData('GamesWeek1');
}
   async fetchData(name) {
    var IP = '192.168.1.124'
    const response = await fetch('http://' + IP + ':3000/?data=' + name, {
      method: "GET"
  })
    const json = await response.json()
    this.state.tableData = json.tableData 
    var isLoading=false
    this.setState({isLoading})
  }


  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Picker  
          selectedValue={this.state.language}
          //style={{ left: 0,height: 50, width: 110, backgroundColor: '#f1f8ff' }}
          style={styles.head} 
          //style={{ backgroundColor: '#fafafa', position: 'absolute', bottom: 0, left: 0, right: 0 }}
          onValueChange={(itemValue, itemIndex) =>
            {
              switch(itemIndex){
                case 0:
                  this.state.isLoading = true;
                  this.fetchData('GamesWeek1')
                  break;
                case 1:
                  this.state.isLoading = true;
                  this.fetchData('GamesWeek2')
                  break;
              }
      ;this.setState({ language: itemValue })}
          }>
          <Picker.Item  label="week1" value="Week 1"  />
          <Picker.Item  label="week2" value="Week 2" />
        </Picker>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={this.state.isLoading ? null : this.state.tableData } style={styles.row} textStyle={styles.text} />
        </Table>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff'},
  text: {  textAlign: 'center', margin: 6 }
  
});

