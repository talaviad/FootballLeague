import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Picker,
  ScrollView,
  Text,
} from 'react-native';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';
import GLOBALS from '../Globals';
export default class GamesResults extends React.Component {
  constructor(props) {
    super(props);

    const {navigation} = this.props;

    var TodayDate = new Date();
    var month = GLOBALS.monthList[TodayDate.getMonth()];
    month = 'May'; //to delete
    this.fetchData(month);
    this.state = {
      tableHead: ['Team1', 'Result', 'Team2', 'Date'],
      firstTableData: [],
      secondTableData: [],
      thirdTableData: [],
      fourthTableData: [],
      firstTableColorRows: [],
      secondTableColorRows: [],
      thirdTableColorRows: [],
      fourthTableColorRows: [],
      tableData: null,
      selectedMonth: month,
      isLoading: true,
    };
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
      <View style={styles.container}>
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
        <ScrollView>
          <View style={{paddingTop: 20}}>
            <Table borderStyle={{borderWidth: 0.5}}>
              <Row
                data={[['1-7 In ' + this.state.selectedMonth]]}
                style={styles.headDate}
                textStyle={styles.textHeadDate}
              />

              <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 20]}
                style={styles.head}
                textStyle={styles.textHead}
              />
              <Table style={{borderColor: '#C1C0B9'}}>
                {this.state.isLoading ? null : this.state.firstTableData
                    .length === 0 ? (
                  <Row
                    style={styles.row}
                    textStyle={styles.textLines}
                    data={['No Games']}
                  />
                ) : (
                  this.state.firstTableData.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      style={
                        this.state.firstTableColorRows.includes(index)
                          ? [
                              styles.row,
                              {
                                backgroundColor: '#b0c4de',
                                alignSelf: 'flex-start',
                                height:
                                  40 +
                                  5 * (dataRow[0].match(/\n/g) || '').length,
                              },
                            ]
                          : styles.row
                      }
                      // flexArr={[60, 30, 60, 40, 20]}
                      textStyle={
                        this.state.firstTableColorRows.includes(index)
                          ? [
                              styles.textLines,
                              {
                                //textAlign: 'left',
                              },
                            ]
                          : styles.textLines
                      }
                      flexArr={
                        this.state.firstTableColorRows.includes(index)
                          ? [50, 50]
                          : [60, 30, 60, 40, 20]
                      }
                    />
                  ))
                )}
              </Table>
            </Table>
          </View>

          <View style={{paddingTop: 20}}>
            <Table borderStyle={{borderWidth: 0.5}}>
              <Row
                data={[['8-14 In ' + this.state.selectedMonth]]}
                style={styles.headDate}
                textStyle={styles.textHeadDate}
              />

              <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 20]}
                style={styles.head}
                textStyle={styles.textHead}
              />
              <Table style={{borderColor: '#C1C0B9'}}>
                {this.state.isLoading ? null : this.state.secondTableData
                    .length === 0 ? (
                  <Row
                    style={styles.row}
                    textStyle={styles.textLines}
                    data={['No Games']}
                  />
                ) : (
                  this.state.secondTableData.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      style={
                        this.state.secondTableColorRows.includes(index)
                          ? [
                              styles.row,
                              {
                                backgroundColor: '#b0c4de',
                                alignSelf: 'flex-start',
                                height:
                                  55 +
                                  5 * (dataRow[0].match(/\n/g) || '').length,
                              },
                            ]
                          : styles.row
                      }
                      // flexArr={[60, 30, 60, 40, 20]}
                      textStyle={
                        this.state.secondTableColorRows.includes(index)
                          ? [
                              styles.textLines,
                              {
                                //textAlign: 'center',
                              },
                            ]
                          : styles.textLines
                      }
                      flexArr={
                        this.state.secondTableColorRows.includes(index)
                          ? [50, 50]
                          : [60, 30, 60, 40, 20]
                      }
                    />
                  ))
                )}
              </Table>
            </Table>
          </View>
          <View style={{paddingTop: 20}}>
            <Table borderStyle={{borderWidth: 0.5}}>
              <Row
                data={[['15-21 In ' + this.state.selectedMonth]]}
                style={styles.headDate}
                textStyle={styles.textHeadDate}
              />

              <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 20]}
                style={styles.head}
                textStyle={styles.textHead}
              />
              <Table style={{borderColor: '#C1C0B9'}}>
                {this.state.isLoading ? null : this.state.thirdTableData
                    .length === 0 ? (
                  <Row
                    style={styles.row}
                    textStyle={styles.textLines}
                    data={['No Games']}
                  />
                ) : (
                  this.state.thirdTableData.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      style={
                        this.state.thirdTableColorRows.includes(index)
                          ? [
                              styles.row,
                              {
                                backgroundColor: '#b0c4de',
                                alignSelf: 'flex-start',
                                height:
                                  55 +
                                  5 * (dataRow[0].match(/\n/g) || '').length,
                              },
                            ]
                          : styles.row
                      }
                      // flexArr={[60, 30, 60, 40, 20]}
                      textStyle={
                        this.state.thirdTableColorRows.includes(index)
                          ? [
                              styles.textLines,
                              {
                                //textAlign: 'center',
                              },
                            ]
                          : styles.textLines
                      }
                      flexArr={
                        this.state.secondTableColorRows.includes(index)
                          ? [50, 50]
                          : [60, 30, 60, 40, 20]
                      }
                    />
                  ))
                )}
              </Table>
            </Table>
          </View>
          <View style={{paddingTop: 20}}>
            <Table borderStyle={{borderWidth: 0.5}}>
              <Row
                data={[['22-31 In ' + this.state.selectedMonth]]}
                style={styles.headDate}
                textStyle={styles.textHeadDate}
              />

              <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 20]}
                style={styles.head}
                textStyle={styles.textHead}
              />
              <Table style={{borderColor: '#C1C0B9'}}>
                {this.state.isLoading ? null : this.state.fourthTableData
                    .length === 0 ? (
                  <Row
                    style={styles.row}
                    textStyle={styles.textLines}
                    data={['No Games']}
                  />
                ) : (
                  this.state.fourthTableData.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      style={
                        this.state.fourthTableColorRows.includes(index)
                          ? [
                              styles.row,
                              {
                                backgroundColor: '#b0c4de',
                                alignSelf: 'flex-start',
                                height:
                                  55 +
                                  5 * (dataRow[0].match(/\n/g) || '').length,
                              },
                            ]
                          : styles.row
                      }
                      // flexArr={[60, 30, 60, 40, 20]}
                      textStyle={
                        this.state.fourthTableColorRows.includes(index)
                          ? [
                              styles.textLines,
                              {
                                //textAlign: 'center',
                              },
                            ]
                          : styles.textLines
                      }
                      flexArr={
                        this.state.fourthTableColorRows.includes(index)
                          ? [50, 50]
                          : [60, 30, 60, 40, 20]
                      }
                    />
                  ))
                )}
              </Table>
            </Table>
          </View>
        </ScrollView>
      </View>
    );
  }
  createButton = (
    team1Dic,
    team2Dic,
    indexToInsert,
    team1Name,
    team2Name,
    tableData,
    tableColorData,
  ) => (
    <TouchableOpacity
      onPress={() => {
        if (tableColorData.includes(indexToInsert)) {
          tableData.splice(indexToInsert, 1);
          const index = tableColorData.indexOf(indexToInsert);
          if (index > -1) {
            tableColorData.splice(index, 1);
          }

          this.setState({
            tableData: tableData,
            tableColorData: tableColorData,
          });
          return;
        }
        tableColorData.push(indexToInsert);
        var strTeam1 = '\n' + team1Name + ':\n';
        team1Dic.map(x => {
          strTeam1 = strTeam1 + '#' + x.Number + ' ' + x.Name[0] + '\n';
        });
        var strTeam2 = '\n' + team2Name + ':\n';
        team2Dic.map(x => {
          strTeam2 = strTeam2 + '#' + x.Number + ' ' + x.Name[0] + '\n';
        });
        tableData.splice(indexToInsert, 0, [strTeam1, strTeam2]);
        this.setState({
          tableData: tableData,
          tableColorData: tableColorData,
        });
      }}>
      <View>
        <Text style={{textAlign: 'center'}}>+</Text>
      </View>
    </TouchableOpacity>
  );

  sortToTablesByDate = line => {
    if (parseInt(line[3].substring(0, 2)) < 8) {
      this.state.firstTableData.push(
        [].concat([
          line[0],
          line[1],
          line[2],
          line[3],
          this.createButton(
            line[4],
            line[5],
            this.state.firstTableData.length + 1,
            line[0],
            line[2],
            this.state.firstTableData,
            this.state.firstTableColorRows,
          ),
        ]),
      );
    } else if (parseInt(line[3].substring(0, 2)) < 15) {
      this.state.secondTableData.push(
        [].concat([
          line[0],
          line[1],
          line[2],
          line[3],
          this.createButton(
            line[4],
            line[5],
            this.state.secondTableData.length + 1,
            line[0],
            line[2],
            this.state.secondTableData,
            this.state.secondTableColorRows,
          ),
        ]),
      );
    } else if (parseInt(line[3].substring(0, 2)) < 22) {
      this.state.thirdTableData.push(
        [].concat([
          line[0],
          line[1],
          line[2],
          line[3],
          this.createButton(
            line[4],
            line[5],
            this.state.thirdTableData.length + 1,
            line[0],
            line[2],
            this.state.thirdTableData,
            this.state.thirdTableColorRows,
          ),
        ]),
      );
    } else {
      this.state.fourthTableData.push(
        [].concat([
          line[0],
          line[1],
          line[2],
          line[3],
          this.createButton(
            line[4],
            line[5],
            this.state.fourthTableData.length + 1,
            line[0],
            line[2],
            this.state.fourthTableData,
            this.state.fourthTableColorRows,
          ),
        ]),
      );
    }
  };
}

// buttonCreator = () => {
//   <Button
//     onPress={() => {
//       this.submitGame();
//     }}
//     title="Submit"
//     color="#841584"
//   />;
// };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5499C7',
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
    borderWidth: 1,
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
  textLines: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#2C3E50',
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
    // backgroundColor: 'brown',
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
