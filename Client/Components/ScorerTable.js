import React from 'react';
import {
  Table,
  Row,
  Rows,
  Col,
  TableWrapper,
} from 'react-native-table-component';
import {View, StyleSheet, ScrollView} from 'react-native';
import SearchBar from 'react-native-search-bar';
var timeoutHandle;
export default class ScorerTable extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    let sortedTableData = navigation.getParam('tableData').sort(function(a, b) {
      if (parseInt(a[8]) == parseInt(b[8])) {
        return parseInt(b[2]) - parseInt(a[2]);
      }
      return parseInt(b[3]) - parseInt(a[3]);
    });

    this.state = {
      tableHead: ['Name', 'Jersey Number', 'Team', 'Goals'],
      tableData: sortedTableData,
      search: '',
      found: false,
      foundList: [],
      isLoading: false,
    };
  }

  updateSearch = search => {
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => {
      if (this.state.foundList.length !== 0) {
        this.setState({found: true});
      }
    }, 1000);

    this.setState({found: false, foundList: []});
    if (search.length === 0) return;

    var reg1 = new RegExp('^' + search + '$');
    var reg2 = new RegExp('^' + search + ',');
    var reg3 = new RegExp(',' + search + ',');
    var reg4 = new RegExp(search + '$');
    for (var i = 0; i < this.state.tableData.length; i++) {
      if (
        reg1.test(this.state.tableData[i][0]) ||
        reg2.test(this.state.tableData[i][0]) |
          reg3.test(this.state.tableData[i][0]) ||
        reg4.test(this.state.tableData[i][0])
      ) {
        this.state.foundList.push(this.state.tableData[i]);
        this.setState({foundList: this.state.foundList});
      }
    }
    this.setState({isLoading: false});
  };

  render() {
    const state = this.state;
    return (
      <ScrollView style={styles.container}>
        <SearchBar
          placeholder="Player Name"
          onChangeText={this.updateSearch}
          value={this.state.search}
        />

        <Table>
          <Row
            data={state.tableHead}
            flexArr={[40, 20, 40, 20]}
            style={styles.head}
            textStyle={styles.textHead}
          />
          <TableWrapper style={styles.wrapper}>
            <Rows
              data={this.state.found ? this.state.foundList : state.tableData}
              flexArr={[40, 20, 40, 20]}
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
    backgroundColor: '#DEF2F1',
  },
  head: {
    height: 32,
    backgroundColor: '#123c69',
  },
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  row: {
    height: 55,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    color: 'white',
  },
  textLines: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    color: '#2C3E50',
    fontSize: 16,
  },
});
