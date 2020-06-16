import React from 'react';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Linking,
  Modal,
  Text,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class FreePlayers extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {
      tableHead: ['Full Name', 'Contact Details', ''],
      tableData: [],
      successAddingPlayer: false,
      isLoading: false,
      freePlayersData: [],
      tempFreeText: '',
      showInfoModal: false,
      showAddModal: false,
      fullName: '',
      contactDetails: '',
      freeText: '',
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

  returnWithButton = (dataRow, freeText, index) => {
    var newDataRow = Array.from(dataRow);
    newDataRow[2] = (
      <Icon
        name={'information-outline'}
        color={'black'}
        style={{marginLeft: '50%'}}
        size={25}
        onPress={() => {
          this.setState({
            showInfoModal: true,
            tempFreeText: freeText,
          });
        }}
      />
    );
    return newDataRow;
  };

  render() {
    const state = this.state;
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={[styles.image, styles.container, {opacity: 0.8}]}>
        <Row
          data={state.tableHead}
          flexArr={[30, 30, 30]}
          style={styles.head}
          textStyle={styles.textHead}
        />
        <ScrollView style={styles.container}>
          <Table style={{flex: 1}}>
            {/* <TableWrapper style={styles.wrapper}> */}
            {this.state.freePlayersData.map((dataRow, index) => (
              <Row
                key={index}
                data={this.returnWithButton(dataRow, dataRow[2], index)}
                style={styles.row}
                textStyle={styles.textLines}
                //flexArr={[10, 10, 2]}
              />
            ))}

            {/* <Rows
                data={this.state.freePlayersData}
                flexArr={[40, 40, 60]}
                style={styles.row}
                textStyle={styles.textLines}
              /> */}
            {/* </TableWrapper> */}
          </Table>
        </ScrollView>
        <Icon
          style={{alignSelf: 'flex-end'}}
          name="plus-circle"
          size={100}
          onPress={() => {
            this.setState({showAddModal: true});
          }}
        />
        <Modal
          visible={this.state.showInfoModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            this.setState({showInfoModal: false});
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
            }}>
            <View
              style={{
                margin: 50,
                padding: 24,
                marginTop: '50%',
                backgroundColor: '#ffffff',
                borderRadius: 10,
                justifyContent: 'flex-start',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  margin: 50,
                  marginTop: '9%',
                  backgroundColor: '#ffffff',
                }}>
                <Text style={{fontSize: 20, color: 'black'}}>Information</Text>
                <Icon
                  name={'close'}
                  color={'black'}
                  style={{marginLeft: '50%'}}
                  size={25}
                  onPress={() => {
                    alert('a');
                    this.setState({
                      showInfoModal: false,
                    });
                  }}
                />
              </View>
              <Text style={{fontSize: 16, color: 'black'}}>
                {this.state.tempFreeText}
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showAddModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                value={this.state.fullName}
                style={styles.inputBox}
                placeholder="Full Name"
                placeholderTextColor="black"
                underlineColorAndroid="#2C3E50"
                onChangeText={fullName => this.setState({fullName})}
              />
              <TextInput
                value={this.state.contactDetails}
                style={styles.inputBox}
                placeholder="contact Details"
                placeholderTextColor="black"
                underlineColorAndroid="#2C3E50"
                onChangeText={contactDetails => this.setState({contactDetails})}
              />
              <View style={{textAlignVertical: 'top'}}>
                <TextInput
                  value={this.state.freeText}
                  style={styles.inputBox}
                  placeholder={'FreeText'}
                  placeholderTextColor="black"
                  underlineColorAndroid="#2C3E50"
                  onChangeText={freeText => this.setState({freeText})}
                />
              </View>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
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
                  this.setState({showAddModal: false});
                }}>
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
  inputBox: {
    width: '100%',
    paddingHorizontal: 16,
    fontSize: 18,
    paddingHorizontal: 50,
    //marginVertical: 10,
    //marginTop: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalView: {
    margin: 20,

    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
