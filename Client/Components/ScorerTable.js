import React from 'react';
import {
  Table,
  Row,
  Rows,
  Col,
  TableWrapper,
} from 'react-native-table-component';
import {View, StyleSheet, ScrollView} from 'react-native';

export default class ScorerTable extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    let sortedTableData = navigation
      .getParam('tableData')
      .sort(function (a, b) {
        if (parseInt(a[8]) == parseInt(b[8])) {
          return parseInt(b[2]) - parseInt(a[2]);
        }
        return parseInt(b[3]) - parseInt(a[3]);
      });

    this.state = {
      tableHead: ['Name', 'Team', 'Number', 'Goals'],
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
