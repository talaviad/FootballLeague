import React from 'react';
import {StyleSheet, View, Picker, ScrollView} from 'react-native';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';
import GLOBALS from '../Globals';
export default class GamesResults extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    var TodayDate = new Date();
    var month = GLOBALS.monthList[TodayDate.getMonth()];
    this.fetchData(month);
    this.state = {
      tableHead: ['Team1', 'Result', 'Team2', 'Date'],
      firstTableData: [],
      secondTableData: [],
      thirdTableData: [],
      fourthTableData: [],
      tableData: null,
      selectedMonth: month,
      isLoading: true,
    };
  }

  componentDidMount() {
    //this.getNumberOfWeeks();
  }

  async fetchData(monthName) {
    let response;
    try {
      response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':3000/?data=' +
          monthName,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'MonthlyGames',
          },
        },
      );

      const json = await response.json();
      var sortedTableData = json.tableData.sort(
        (a, b) =>
          parseInt(a[3].substring(0, 2)) - parseInt(b[3].substring(0, 2)),
      );
      sortedTableData.map(this.sortToTablesByDate);
      this.setState({
        tableData: sortedTableData,
      });

      let isLoading = false;
      this.setState({isLoading});
    } catch (err) {
      console.error(err);
    }
  }
  getMonthListInItems = () => {
    return GLOBALS.monthList.map((x, i) => {
      return <Picker.Item label={x.toString()} key={i} value={x.toString()} />;
    });
  };
  render() {
    const state = this.state;
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            borderColor: 'black',
            backgroundColor: '#5499C7',
            borderWidth: 0.8,
          }}>
          <Picker
            selectedValue={this.state.selectedMonth}
            onValueChange={(itemValue, itemIndex) => {
              this.state.firstTableData = [];
              this.state.secondTableData = [];
              this.state.thirdTableData = [];
              this.state.fourthTableData = [];
              this.setState({selectedMonth: itemValue});
              this.state.isLoading = true;
              this.fetchData(itemValue);
            }}>
            {this.getMonthListInItems()}
          </Picker>
        </View>
        <View style={{paddingTop: 20}}>
          <Table borderStyle={{borderWidth: 1}}>
            <Row
              data={[['1-7 In ' + this.state.selectedMonth]]}
              style={styles.headDate}
              textStyle={styles.textHeadDate}
            />

            <Row
              data={state.tableHead}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.head}
              textStyle={styles.textHead}
            />
            <TableWrapper style={styles.wrapper}>
              <Rows
                data={
                  this.state.isLoading
                    ? null
                    : this.state.firstTableData.length === 0
                    ? [['No Games']]
                    : this.state.firstTableData
                }
                flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
                style={styles.row}
                textStyle={styles.textLines}
              />
            </TableWrapper>
          </Table>
        </View>
        <View style={{paddingTop: 20}}>
          <Table borderStyle={{borderWidth: 1}}>
            <Row
              data={[['8-14 In ' + this.state.selectedMonth]]}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.headDate}
              textStyle={styles.textHeadDate}
            />
            <Row
              data={state.tableHead}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.head}
              textStyle={styles.textHead}
            />
            <TableWrapper style={styles.wrapper}>
              <Rows
                data={
                  this.state.isLoading
                    ? null
                    : this.state.secondTableData.length === 0
                    ? [['No Games']]
                    : this.state.secondTableData
                }
                flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
                style={styles.row}
                textStyle={styles.textLines}
              />
            </TableWrapper>
          </Table>
        </View>
        <View style={{paddingTop: 20}}>
          <Table borderStyle={{borderWidth: 1}}>
            <Row
              data={[['15-21 In ' + this.state.selectedMonth]]}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.headDate}
              textStyle={styles.textHeadDate}
            />
            <Row
              data={state.tableHead}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.head}
              textStyle={styles.textHead}
            />
            <TableWrapper style={styles.wrapper}>
              <Rows
                data={
                  this.state.isLoading
                    ? null
                    : this.state.thirdTableData.length === 0
                    ? [['No Games']]
                    : this.state.thirdTableData
                }
                flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
                style={styles.row}
                textStyle={styles.textLines}
              />
            </TableWrapper>
          </Table>
        </View>
        <View style={{paddingTop: 20}}>
          <Table borderStyle={{borderWidth: 1}}>
            <Row
              data={[['22-31 In ' + this.state.selectedMonth]]}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.headDate}
              textStyle={styles.textHeadDate}
            />
            <Row
              data={state.tableHead}
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.head}
              textStyle={styles.textHead}
            />
            <TableWrapper style={styles.wrapper}>
              <Rows
                data={
                  this.state.isLoading
                    ? null
                    : this.state.fourthTableData.length === 0
                    ? [['No Games']]
                    : this.state.fourthTableData
                }
                flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
                style={styles.row}
                textStyle={styles.textLines}
              />
            </TableWrapper>
          </Table>
        </View>
      </ScrollView>
    );
  }

  sortToTablesByDate = (line) => {
    if (parseInt(line[3].substring(0, 2)) < 8) {
      this.state.firstTableData.push(line);
    } else if (parseInt(line[3].substring(0, 2)) < 15) {
      this.state.secondTableData.push(line);
    } else if (parseInt(line[3].substring(0, 2)) < 22) {
      this.state.thirdTableData.push(line);
    } else {
      this.state.fourthTableData.push(line);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 16,
    //paddingTop: 30,
    backgroundColor: '#5499C7',

    //justifyContent: 'space-between',

    // justifyContent: 'space-between',
  },
  itemStyle: {
    fontSize: 45,
    height: 278,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableStyle: {
    height: '30%',
    marginTop: 32,
  },
  picker: {
    height: '10%',
    width: '100%',
    textAlign: 'center',
  },
  pickerItem: {
    textAlign: 'center',
  },

  head: {
    height: 28,
    backgroundColor: '#5D6D7E',
  },
  headDate: {
    height: 18,
    backgroundColor: '#4682b4',
  },
  wrapper: {
    flexDirection: 'row',
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
  },
  textHeadDate: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: 'black',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
  },
  // row: {
  //   height: '50%',
  //   backgroundColor: '#D6EAF8',
  // },
  row: {
    height: 55,
  },
  textLines: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#2C3E50',
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  picker: {
    width: 200,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 5,
  }, // textLines: {
  //   textAlign: 'center',
  //   fontFamily: 'Times',
  //   color: '#2C3E50',
  // },
});
