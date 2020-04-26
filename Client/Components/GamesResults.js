import React from 'react';
import {StyleSheet, View, Picker, ScrollView} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/FontAwesome';
import GLOBALS from '../Globals';

export default class GamesResults extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    var TodayDate = new Date();
    var month = GLOBALS.monthList[TodayDate.getMonth()];
    month = 'June';
    this.fetchData(month);
    this.state = {
      tableHead: ['Team1', 'Result', 'Team2', 'Date'],
      firstTableData: [], //each item is an array(in size 4) that includes the details of one match.
      secondTableData: [],
      thirdTableData: [],
      fourthTableData: [],
      firstScorersDictList: [], //each item is an array(of size 2) that includes the string of the scorrers
      secondScorersDictList: [],
      thirdScorersDictList: [],
      fourthScorersDictList: [],
      firstTableColorRows: [], //includes all the indexes of the games that their button is pressed
      secondTableColorRows: [],
      thirdTableColorRows: [],
      fourthTableColorRows: [],
      firstMaxScorrersOfMatch: [], //each item is the maximum scorers of a match(just for the height of the cell of the scorers)
      secondMaxScorrersOfMatch: [],
      thirdMaxScorrersOfMatch: [],
      fourthMaxScorrersOfMatch: [],

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
          ':' +
          this.props.navigation.getParam('port') +
          '/?data=' +
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
                flexArr={[60, 30, 60, 40, 22]}
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
                  this.state.firstTableData.map((dataRow, index) => [
                    <Row
                      key={index}
                      data={dataRow.concat(
                        this.createButton(
                          index,
                          this.state.firstTableColorRows,
                        ),
                      )}
                      style={styles.row}
                      textStyle={styles.textLines}
                      flexArr={[60, 30, 60, 40, 22]}
                    />,
                    this.state.firstTableColorRows.includes(index) ? (
                      <Row
                        style={[
                          styles.row,
                          {
                            backgroundColor: '#b0c4de',
                            alignSelf: 'flex-start',
                            height:
                              40 +
                              12 * this.state.firstMaxScorrersOfMatch[index],
                          },
                        ]}
                        flexArr={[50, 50]}
                        textStyle={styles.textLinesScorers}
                        data={this.state.firstScorersDictList[index]}
                      />
                    ) : (
                      <Row />
                    ),
                  ])
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
                flexArr={[60, 30, 60, 40, 22]}
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
                  this.state.secondTableData.map((dataRow, index) => [
                    <Row
                      key={index}
                      data={dataRow.concat(
                        this.createButton(
                          index,
                          this.state.secondTableColorRows,
                        ),
                      )}
                      style={styles.row}
                      textStyle={styles.textLines}
                      flexArr={[60, 30, 60, 40, 22]}
                    />,
                    this.state.secondTableColorRows.includes(index) ? (
                      <Row
                        style={[
                          styles.row,
                          {
                            backgroundColor: '#b0c4de',
                            alignSelf: 'flex-start',
                            height:
                              40 +
                              12 * this.state.secondMaxScorrersOfMatch[index],
                          },
                        ]}
                        flexArr={[50, 50]}
                        textStyle={styles.textLinesScorers}
                        data={this.state.secondScorersDictList[index]}
                      />
                    ) : (
                      <Row />
                    ),
                  ])
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
                flexArr={[60, 30, 60, 40, 22]}
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
                  this.state.thirdTableData.map((dataRow, index) => [
                    <Row
                      key={index}
                      data={dataRow.concat(
                        this.createButton(
                          index,
                          this.state.thirdTableColorRows,
                        ),
                      )}
                      style={styles.row}
                      textStyle={styles.textLines}
                      flexArr={[60, 30, 60, 40, 22]}
                    />,
                    this.state.thirdTableColorRows.includes(index) ? (
                      <Row
                        style={[
                          styles.row,
                          {
                            backgroundColor: '#b0c4de',
                            alignSelf: 'flex-start',
                            height:
                              40 +
                              12 * this.state.thirdMaxScorrersOfMatch[index],
                          },
                        ]}
                        flexArr={[50, 50]}
                        textStyle={styles.textLinesScorers}
                        data={this.state.thirdScorersDictList[index]}
                      />
                    ) : (
                      <Row />
                    ),
                  ])
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
                flexArr={[60, 30, 60, 40, 22]}
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
                  this.state.fourthTableData.map((dataRow, index) => [
                    <Row
                      key={index}
                      data={dataRow.concat(
                        this.createButton(
                          index,
                          this.state.fourthTableColorRows,
                        ),
                      )}
                      style={styles.row}
                      textStyle={styles.textLines}
                      flexArr={[60, 30, 60, 40, 22]}
                    />,
                    this.state.fourthTableColorRows.includes(index) ? (
                      <Row
                        style={[
                          styles.row,
                          {
                            backgroundColor: '#b0c4de',
                            alignSelf: 'flex-start',
                            height:
                              40 +
                              12 * this.state.fourthMaxScorrersOfMatch[index],
                          },
                        ]}
                        flexArr={[50, 50]}
                        textStyle={styles.textLinesScorers}
                        data={this.state.fourthScorersDictList[index]}
                      />
                    ) : (
                      <Row />
                    ),
                  ])
                )}
              </Table>
            </Table>
          </View>
        </ScrollView>
      </View>
    );
  }

  createButton = (index, arr) => (
    <Icon.Button
      name={arr.includes(index) ? 'angle-up' : 'angle-down'}
      style={{backgroundColor: '#5499C7'}}
      color={'black'}
      size={22}
      onPress={() => {
        if (arr.includes(index)) {
          arr.splice(index, 1);
          this.setState({
            arr: arr,
          });
          return;
        }
        arr.push(index);
        this.setState({
          arr: arr,
        });
      }}
    />
  );

  buildScorresData = (arr, team1Dic, team2Dic, team1Name, team2Name) => {
    var strTeam1 = '\n' + team1Name + ':\n';
    team1Dic.map(x => {
      strTeam1 = strTeam1 + '#' + x.Number + ' ' + x.Name[0] + '\n';
    });
    var strTeam2 = '\n' + team2Name + ':\n';
    team2Dic.map(x => {
      strTeam2 = strTeam2 + '#' + x.Number + ' ' + x.Name[0] + '\n';
    });
    arr.push([strTeam1, strTeam2]);
  };

  sortToTablesByDate = line => {
    if (parseInt(line[3].substring(0, 2)) < 8) {
      this.state.firstTableData.push(
        [].concat([line[0], line[1], line[2], line[3]]),
      );
      this.buildScorresData(
        this.state.firstScorersDictList,
        line[4],
        line[5],
        line[0],
        line[2],
      );
      this.state.firstMaxScorrersOfMatch.push(
        Math.max(line[4].length, line[5].length),
      );
    } else if (parseInt(line[3].substring(0, 2)) < 15) {
      this.state.secondTableData.push(
        [].concat([line[0], line[1], line[2], line[3]]),
      );
      this.buildScorresData(
        this.state.secondScorersDictList,
        line[4],
        line[5],
        line[0],
        line[2],
      );
      this.state.secondMaxScorrersOfMatch.push(
        Math.max(line[4].length, line[5].length),
      );
    } else if (parseInt(line[3].substring(0, 2)) < 22) {
      this.state.thirdTableData.push(
        [].concat([line[0], line[1], line[2], line[3]]),
      );
      this.buildScorresData(
        this.state.thirdScorersDictList,
        line[4],
        line[5],
        line[0],
        line[2],
      );
      this.state.thirdMaxScorrersOfMatch.push(
        Math.max(line[4].length, line[5].length),
      );
    } else {
      this.state.fourthTableData.push(
        [].concat([line[0], line[1], line[2], line[3]]),
      );
      this.buildScorresData(
        this.state.fourthScorersDictList,
        line[4],
        line[5],
        line[0],
        line[2],
      );
      this.state.fourthMaxScorrersOfMatch.push(
        Math.max(line[4].length, line[5].length),
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5499C7',
  },
  picker: {
    height: '10%',
    width: '100%',
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
  textLinesScorers: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
  },
  row: {
    height: 55,
  },

  picker: {
    width: 200,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 5,
  },
});
