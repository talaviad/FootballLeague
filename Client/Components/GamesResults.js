import React from 'react';
import {StyleSheet, View, Picker} from 'react-native';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';

export default class GamesResults extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      tableHead: ['Team1', 'Result', 'Team2'],
      tableData: null,
      numberOfWeeks: [],
      selectedWeek: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getNumberOfWeeks();
  }

  async getNumberOfWeeks() {
    let response;
    try {
      response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':3000/?data=NumberOfWeeks',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'NumberOfWeeks',
          },
        },
      );
      const json = await response.json();
      this.state.numberOfWeeks = json.numberOfWeeks;
      this.setState({numberOfWeeks: json.numberOfWeeks});
      var isLoading = false;
      //this.setState({ isLoading })
    } catch (err) {
      console.error(err);
    }
  }

  async fetchData(name) {
    let response;
    try {
      response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':3000/?data=' +
          name,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': name.substring(0, 9),
          },
        },
      );
      const json = await response.json();
      this.setState({tableData: json.tableData});

      let isLoading = false;
      this.setState({isLoading});
    } catch (err) {
      console.error(err);
    }
  }
  weeksList = () => {
    return this.state.numberOfWeeks.map((x, i) => {
      return (
        <Picker.Item
          label={'Week' + x.toString()}
          key={i}
          value={x.toString()}
        />
      );
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
            selectedValue={this.state.selectedWeek}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({selectedWeek: itemValue});
              this.state.isLoading = true;
              this.fetchData('GamesWeek' + itemValue);
            }}>
            {this.weeksList()}
          </Picker>
        </View>
        <Table borderStyle={{borderWidth: 1}}>
          <Row
            data={state.tableHead}
            flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
            style={styles.head}
            textStyle={styles.textHead}
          />
          <TableWrapper style={styles.wrapper}>
            <Rows
              // data={this.state.isLoading ? null : this.state.tableData}
              data={
                this.state.isLoading
                  ? null
                  : this.state.tableData.length === 0
                  ? [['No Games']]
                  : this.state.tableData
              }
              flexArr={[80, 30, 30, 30, 30, 30, 30, 30, 30]}
              style={styles.row}
              textStyle={styles.textLines}
            />
          </TableWrapper>
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
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
  // head: {
  //   height: '20%',
  //   backgroundColor: '#5D6D7E',
  // },
  head: {
    height: 28,
    backgroundColor: '#5D6D7E',
  },
  wrapper: {
    flexDirection: 'row',
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'Times',
    color: '#AED6F1',
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
