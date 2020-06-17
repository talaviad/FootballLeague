import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Text,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-community/picker';
import {CustomPicker} from 'react-native-custom-picker';

import GLOBALS from '../Globals';

export default class GamesResults extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    var TodayDate = new Date();
    var month = GLOBALS.monthList[TodayDate.getMonth()];
    month = 'January'; //delete this line!
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
          this.props.navigation.getParam('PORT') +
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
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        imageStyle={{opacity: 0.7}}>
        <View style={styles.container}>
          <View
            style={{
              borderColor: 'black',
              borderWidth: 0.8,
            }}>
            {/* <Picker
              style={{
                marginLeft: '40%',
              }}
              selectedValue={this.state.selectedMonth}
              onValueChange={(itemValue, itemIndex) => {
                this.state.firstTableData = [];
                this.state.secondTableData = [];
                this.state.thirdTableData = [];
                this.state.fourthTableData = [];
                this.state.firstScorersDictList = []; //each item is an array(of size 2) that includes the string of the scorrers
                this.state.secondScorersDictList = [];
                this.state.thirdScorersDictList = [];
                this.state.fourthScorersDictList = [];
                this.state.firstTableColorRows = []; //includes all the indexes of the games that their button is pressed
                this.state.secondTableColorRows = [];
                this.state.thirdTableColorRows = [];
                this.state.fourthTableColorRows = [];
                this.state.firstMaxScorrersOfMatch = []; //each item is the maximum scorers of a match(just for the height of the cell of the scorers)
                this.state.secondMaxScorrersOfMatch = [];
                this.state.thirdMaxScorrersOfMatch = [];
                this.state.fourthMaxScorrersOfMatch = [];
                this.setState({selectedMonth: itemValue});
                this.state.isLoading = true;
                this.fetchData(itemValue);
              }}>
              {this.getMonthListInItems()}
            </Picker> */}
            <CustomPicker
              style={{
                textAlign: 'center',
                fontSize: 30,
                paddingLeft: 5,
                marginLeft: -5,
              }}
              backdropStyle={{borderWidth: 3}}
              value={this.state.selectedMonth}
              options={GLOBALS.monthList}
              fieldTemplate={this.renderField}
              optionTemplate={this.renderOption}
              onValueChange={(itemValue, itemIndex) => {
                this.state.firstTableData = [];
                this.state.secondTableData = [];
                this.state.thirdTableData = [];
                this.state.fourthTableData = [];
                this.state.firstScorersDictList = []; //each item is an array(of size 2) that includes the string of the scorrers
                this.state.secondScorersDictList = [];
                this.state.thirdScorersDictList = [];
                this.state.fourthScorersDictList = [];
                this.state.firstTableColorRows = []; //includes all the indexes of the games that their button is pressed
                this.state.secondTableColorRows = [];
                this.state.thirdTableColorRows = [];
                this.state.fourthTableColorRows = [];
                this.state.firstMaxScorrersOfMatch = []; //each item is the maximum scorers of a match(just for the height of the cell of the scorers)
                this.state.secondMaxScorrersOfMatch = [];
                this.state.thirdMaxScorrersOfMatch = [];
                this.state.fourthMaxScorrersOfMatch = [];
                this.setState({selectedMonth: itemValue});
                this.state.isLoading = true;
                this.fetchData(itemValue);
              }}
            />
          </View>
          <ScrollView>
            <View style={{paddingTop: 20}}>
              <Table>
                <Row
                  data={[['1-7 In ' + this.state.selectedMonth]]}
                  style={styles.headDate}
                  textStyle={styles.textHeadDate}
                />
                {/* <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 22]}
                style={styles.head}
                textStyle={styles.textHead}
              /> */}
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
                        flexArr={[30, 30, 30, 30, 15]}
                      />,
                      this.state.firstTableColorRows.includes(index) ? (
                        <Row
                          borderStyle={{borderWidth: 0.5}}
                          style={[
                            styles.row,
                            {
                              backgroundColor: '#5596d8',
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
              <Table>
                <Row
                  data={[['8-14 In ' + this.state.selectedMonth]]}
                  style={styles.headDate}
                  textStyle={styles.textHeadDate}
                />

                {/* <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 22]}
                style={styles.head}
                textStyle={styles.textHead}
              /> */}
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
                        flexArr={[30, 30, 30, 30, 15]}
                      />,
                      this.state.secondTableColorRows.includes(index) ? (
                        <Row
                          borderStyle={{borderWidth: 0.5}}
                          style={[
                            styles.row,
                            {
                              backgroundColor: '#5596d8',
                              alignSelf: 'flex-start',
                              height:
                                40 +
                                14 * this.state.secondMaxScorrersOfMatch[index],
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
              <Table>
                <Row
                  data={[['15-21 In ' + this.state.selectedMonth]]}
                  style={styles.headDate}
                  textStyle={styles.textHeadDate}
                />

                {/* <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 22]}
                style={styles.head}
                textStyle={styles.textHead}
              /> */}
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
                        flexArr={[30, 30, 30, 30, 15]}
                      />,
                      this.state.thirdTableColorRows.includes(index) ? (
                        <Row
                          borderStyle={{borderWidth: 0.5}}
                          style={[
                            styles.row,
                            {
                              backgroundColor: '#5596d8',
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
              <Table>
                <Row
                  data={[['22-31 In ' + this.state.selectedMonth]]}
                  style={styles.headDate}
                  textStyle={styles.textHeadDate}
                />

                {/* <Row
                data={['Team1', 'Result', 'Team2', 'Date', '']}
                flexArr={[60, 30, 60, 40, 22]}
                style={styles.head}
                textStyle={styles.textHead}
              /> */}
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
                        flexArr={[30, 30, 30, 30, 15]}
                      />,
                      this.state.fourthTableColorRows.includes(index) ? (
                        <Row
                          borderStyle={{borderWidth: 0.5}}
                          style={[
                            styles.row,
                            {
                              backgroundColor: '#5596d8',
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
      </ImageBackground>
    );
  }

  createButton = (index, arr) => (
    <Icon
      name={arr.includes(index) ? 'angle-up' : 'angle-down'}
      backgroundColor="#336da8" //this line is important, it's canceling the deafult color
      color={'black'}
      style={{marginLeft: '7.5%'}}
      size={20}
      onPress={() => {
        if (arr.includes(index)) {
          var position = arr.indexOf(index);
          arr.splice(position, 1);
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
      strTeam1 = strTeam1 + '#' + x.Number + ' ' + x.Name + '\n';
    });
    var strTeam2 = '\n' + team2Name + ':\n';
    team2Dic.map(x => {
      strTeam2 = strTeam2 + '#' + x.Number + ' ' + x.Name + '\n';
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

  //part of the picker, the views of the selected field.
  renderField(settings) {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={styles.container2}>
        <View>
          {!selectedItem && (
            <Text style={[styles.text2, {color: 'black'}]}>{defaultText}</Text>
          )}
          {selectedItem && (
            <View style={styles.innerContainer}>
              <Text
                style={[
                  styles.text2,
                  {
                    color: 'black',
                    fontFamily: 'sans-serif-medium',
                  },
                ]}>
                {getLabel(selectedItem)}
              </Text>
              <Icon
                name="chevron-down"
                size={20}
                style={{marginLeft: 10, marginTop: 13}}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
  //part of the picker, the views of the options
  renderOption(settings) {
    const {item, getLabel} = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, {backgroundColor: item.color}]} />
          <Text
            style={{
              fontFamily: 'sans-serif-condensed',
              fontSize: 17,
              color: item.color,
              alignSelf: 'flex-start',
            }}>
            {getLabel(item)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#DEF2F1',
  },
  container2: {
    borderColor: 'grey',
    padding: 5,
    alignItems: 'center',
  },
  optionContainer: {
    padding: 10,
    borderBottomColor: 'grey',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  box: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  picker: {
    height: '10%',
    width: '100%',
    textAlign: 'center',
  },
  head: {
    height: 28,
    borderWidth: 1,
  },
  headDate: {
    height: 24,
    backgroundColor: '#123C69',
    borderRadius: 5,
    borderWidth: 0,
  },
  wrapper: {
    flexDirection: 'row',
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    fontSize: 17,
    color: 'black',
  },
  textHeadDate: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    fontSize: 17,
    color: 'white',
  },
  textLines: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    color: 'black',
  },
  textLinesScorers: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    color: 'black',
    // fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Times',
    // color: '#AED6F1',
  },
  text2: {
    color: 'black',
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 8,
    fontFamily: 'sans-serif-condensed',
  },
  row: {
    height: 55,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    //paddingHorizontal: 5,
  },

  picker: {
    width: 200,
    // backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 5,
  },
});
