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
      tableHead: ['Name', 'Team', 'Number', 'Goals'],
      tableTitle: ['a', 'a', 'a', 'a'],
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
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={this.state.search}
        />

        {/* {this.state.found && this.getFoundList()} */}
        <Table borderStyle={{borderWidth: 1}}>
          <Row
            data={state.tableHead}
            flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
            style={styles.head}
            textStyle={styles.textHead}
          />
          <TableWrapper style={styles.wrapper}>
            <Rows
              data={this.state.found ? this.state.foundList : state.tableData}
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
