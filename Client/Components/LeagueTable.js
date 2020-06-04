import React from 'react';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import GLOBALS from '../Globals';

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
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        imageStyle={{opacity: 0.8}}>
        <ScrollView style={styles.container}>
          <Table>
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
              <Text style={{alignSelf: 'flex-start'}}>
                GD - Goal Difference
              </Text>
              <Text style={{alignSelf: 'flex-start'}}>Pts - points</Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: GLOBALS.colors.BackGround,
  },
  head: {
    height: 28,
    backgroundColor: '#123c69',
  },
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  title: {
    flex: 1,
    backgroundColor: '#F8F9F9',
  },
  row: {
    height: 55,
    borderBottomWidth: 0.4,
    borderTopWidth: 0.4,
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    color: 'white',
    fontSize: 17,
  },
  textLines: {
    // textAlign: 'center',
    // fontFamily: 'Times',
    // color: '#2C3E50',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontSize: 16,
    color: 'black',
  },
  decleration: {
    borderWidth: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  declerationLine: {
    justifyContent: 'space-around',
  },
});
