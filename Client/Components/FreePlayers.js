import React from 'react';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';
import {View, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class FreePlayers extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      tableHead: ['Full Name', 'Contact Details', 'Free Text'],
      tableData: [],
      successAddingPlayer: false,
      isLoading: false,
      freePlayersData: [],
      fullName: 'Ron Pizanti',
      contactDetails: 'ronPiz@gmail.com',
      freeText:
        "I'm a defnser player, that can also score goals when I get the chances",
    };
    this.getFreePlayers();
  }
  async addFreePlayer(fullName, contactDetails, freeText) {
    this.setState({isLoading: true});
    let response = fetch(
      'http://' +
        this.props.navigation.getParam('IP') +
        ':' +
        this.props.navigation.getParam('PORT') +
        '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Football-Request': 'addFreePlayer',
        },
        body: JSON.stringify({
          fullName: fullName,
          contactDetails: contactDetails,
          freeText: freeText,
        }),
      },
    )
      .then(response => response.json())
      .then(async resJson => {
        this.setState({isLoading: false});
        if (resJson.success) {
          this.setState({successAddingPlayer: true});
        } else {
          alert(resJson.error.msg);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        alert(err);
      });
  }

  async getFreePlayers() {
    let response;

    try {
      response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/?data=FreePlayers',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'FreePlayers',
          },
        },
      );
      const json = await response.json();
      this.setState({freePlayersData: json.freePlayersArray});
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const state = this.state;
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={[styles.image, styles.container, {opacity: 0.8}]}>
        <Row
          data={state.tableHead}
          flexArr={[40, 40, 60]}
          style={styles.head}
          textStyle={styles.textHead}
        />
        <ScrollView style={styles.container}>
          <Table style={{flex: 1}}>
            <TableWrapper style={styles.wrapper}>
              <Rows
                data={this.state.freePlayersData}
                flexArr={[40, 40, 60]}
                style={styles.row}
                textStyle={styles.textLines}
              />
            </TableWrapper>
          </Table>
        </ScrollView>
        <Icon
          style={{alignSelf: 'flex-end'}}
          name="plus-circle"
          size={100}
          onPress={() => {
            if (
              this.state.fullName === '' ||
              this.state.contactDetails === '' ||
              this.state.freeText === ''
            ) {
              alert('Please fill all the fields');

              return;
            } else {
              this.setState({confirmAddingPlayer: true});
            }
          }}
        />
        <AwesomeAlert
          show={this.state.confirmAddingPlayer}
          showProgress={false}
          title="Confirmation"
          message={'Are you sure you want to submit?'}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          showCancelButton={true}
          cancelText="No"
          confirmText="Yes, submit"
          confirmButtonColor="#8fbc8f"
          onConfirmPressed={() => {
            this.addFreePlayer(
              this.state.fullName,
              this.state.contactDetails,
              this.state.freeText,
            );
            this.setState({confirmAddingPlayer: false});
          }}
          onCancelPressed={() => {
            this.setState({confirmAddingPlayer: false});
          }}
        />

        <AwesomeAlert
          show={this.state.successAddingPlayer}
          showProgress={false}
          title="Success"
          message={'The player has been added'}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#8fbc8f"
          onConfirmPressed={() => {
            this.setState({successAddingPlayer: false});
          }}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#DEF2F1',
  },
  head: {
    height: 36,
    backgroundColor: '#123c69',
  },
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  row: {
    height: 55,
    borderBottomWidth: 0.6,
    borderTopWidth: 0.6,
  },
  textHead: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    color: 'white',
    fontSize: 17,
  },
  textLines: {
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed',
    color: 'black',
    fontSize: 17,
  },
});
