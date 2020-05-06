import React from 'react';
import {
  Table,
  Row,
  Rows,
  Col,
  TableWrapper,
} from 'react-native-table-component';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

export default class LeagueTable extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    let sortedTableData = navigation.getParam('tableData').sort(function(a, b) {
      if (parseInt(a[8]) == parseInt(b[8])) {
        return parseInt(b[7]) - parseInt(a[7]);
      }
      return parseInt(b[8]) - parseInt(a[8]);
    });

    this.state = {
      tableHead: ['Club', 'MP', 'W', 'D', 'L', 'GS', 'GA', 'GD', 'Pts'],
      tableTitle: ['a', 'a', 'a', 'a'],
      tableData: sortedTableData,
    };
  }

  render() {
    const state = this.state;
    return (
      <ScrollView style={styles.container}>
        <Table borderStyle={{borderWidth: 1}}>
          <Row
            data={state.tableHead}
            flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
            style={styles.head}
            textStyle={styles.textHead}
          />
          <TableWrapper style={styles.wrapper}>
            <Rows
              data={state.tableData}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.row}
              textStyle={styles.textLines}
            />
          </TableWrapper>
        </Table>
        <View style={styles.decleration}>
          <View style={styles.declerationLine}>
            <Text style={{alignSelf: 'flex-start'}}>MP - Matches Played</Text>
            <Text style={{alignSelf: 'flex-start'}}>W - Won</Text>
            <Text style={{alignSelf: 'flex-start'}}>D - Draw</Text>
            <Text style={{alignSelf: 'flex-start'}}>L - Loss</Text>
          </View>
          <View style={styles.declerationLine}>
            <Text style={{alignSelf: 'flex-start'}}>GS - Goals Scored</Text>
            <Text style={{alignSelf: 'flex-start'}}>GA - Goals Against</Text>
            <Text style={{alignSelf: 'flex-start'}}>GD - Goal Difference</Text>
            <Text style={{alignSelf: 'flex-start'}}>Pts - points</Text>
          </View>
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
  decleration: {
    borderWidth: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  declerationLine: {
    //flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
