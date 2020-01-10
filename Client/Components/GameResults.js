import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

export default class ExampleOne extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      tableHead: ['Game', 'Score', 'Date'],
      tableData: navigation.getParam('tableData')/*[
        ['Team A\nTeam B', '3\n0', '1.1.20'],
        ['Team C\nTeam D', '1\n1', '1.1.20'],
        ['Team E\nTeam F', '3\n2', '1.1.20'],
        ['Team G\nTeam H', '1\n4', '2.1.20']
      ]*/
    }
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={state.tableData} style={styles.row} textStyle={styles.text} />
        </Table>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});