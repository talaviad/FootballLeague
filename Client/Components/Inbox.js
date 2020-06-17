import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/blue';
import AwesomeAlert from 'react-native-awesome-alerts';
import GLOBALS from '../Globals';

export default class Inbox extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    // Initialize state
    this.state = {
      inbox: this.props.navigation.getParam('inbox'),
      msgIsShown: false,
      currMsg: '',
      removeAll: false,
      alerts: {
        responseError: {
          toShow: false,
          msg: '',
        },
      },
    };
    this.updateServer = this.updateServer.bind(this);
    this.createMsgModal = this.createMsgModal.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.createAllAlerts = this.createAllAlerts.bind(this);
    this.setAlertsState = this.setAlertsState.bind(this);
    this.addAlertToarray = this.addAlertToarray.bind(this);
    this.createRemoveAllAlert = this.createRemoveAllAlert.bind(this);
  }

  createRemoveAllAlert() {
    if (!this.state.removeAll) return null;
    return (
      <AwesomeAlert
        show={true}
        showProgress={false}
        title={'Confirm'}
        message="Are you sure you want to remove all the messages?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Yes"
        cancelText="No"
        confirmButtonColor={GLOBALS.colors.Positive}
        cancelButtonColor={GLOBALS.colors.Negative}
        onConfirmPressed={() => {
          let inbox = {
            messages: [],
          };
          this.setState({inbox: inbox, removeAll: false});
          this.updateServer();
        }}
        onCancelPressed={() => {
          this.setState({removeAll: false});
        }}
      />
    );
  }

  createAllAlerts() {
    const alerts = [];
    this.addAlertToarray(alerts, 'responseError', 'Error');
    return alerts;
  }

  setAlertsState(field, toShow, msg) {
    this.setState(prevState => {
      let alerts = Object.assign({}, prevState.alerts);
      alerts[field] = {toShow: toShow, msg: msg};
      return {alerts};
    });
  }

  addAlertToarray(alerts, field, title) {
    alerts.push(
      <AwesomeAlert
        show={this.state.alerts[field].toShow}
        showProgress={false}
        title={title}
        message={this.state.alerts[field].msg}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Yes"
        confirmText="ok"
        confirmButtonColor="#8fbc8f"
        onConfirmPressed={() => {
          this.setAlertsState(field, false, '');
        }}
      />,
    );

    return alerts;
  }

  async updateServer() {
    // let inbox = this.state.inbox;
    // inbox.messages[msgNum].read = true;
    // this.setState({inbox: inbox, msgIsShown: true, currMsg: inbox.messages[msgNum].msg});

    try {
      let response = await fetch(
        'http://' +
          this.props.navigation.getParam('IP') +
          ':' +
          this.props.navigation.getParam('PORT') +
          '/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'UpdateInbox',
            Authorization: await AsyncStorage.getItem('token'),
          },
          body: JSON.stringify({
            inbox: this.state.inbox,
          }),
        },
      );
      let json = await response.json();
      console.log(
        'In Inbox.js, updateServer() - json.success: ' + json.success,
      );
      if (json.success) console.log('json.inbox: ' + json.inbox);
      else console.log('Error message: ' + json.error.msg);
    } catch (err) {
      this.setAlertsState(
        'responseError',
        true,
        'An error occured in Inbox.js - updateServer(): ' + err,
      );
      //alert('An error occured in Inbox.js - updateServer(): ' + err);
    }
  }

  createMsgModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.msgIsShown}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View
          style={{
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: '#ECE7E4',
          }}>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <Text
            style={{
              height: GLOBALS.windowHeightSize * 0.85,
              fontSize: 22,
              width: '90%',
            }}>
            {this.state.currMsg}
          </Text>
          <View
            style={{
              height: GLOBALS.windowHeightSize * 0.1,
              alignItems: 'center',
              width: '100%',
            }}>
            <AwesomeButtonCartman
              onPress={() => this.setState({msgIsShown: false})}
              type="anchor"
              stretch={true}
              textSize={20}
              backgroundColor={GLOBALS.colors.Negative} //'#123c69'
              style={{width: '50%'}}
              borderWidth={0.5}
              borderRadius={10}
              raiseLevel={4}>
              Close
            </AwesomeButtonCartman>
          </View>
        </View>
      </Modal>
    );
  }

  deleteMessage(msgNum) {
    let inbox = this.state.inbox;
    inbox.messages.splice(msgNum, 1);
    this.setState({inbox: inbox});
    this.updateServer();
  }

  render() {
    const messagesToRender = [];
    let messages = this.state.inbox.messages;
    for (let msgNum = 0; msgNum < messages.length; msgNum++) {
      console.log('messages[msgNum]: ' + messages[msgNum]);
      messagesToRender.push(
        <View
          style={{
            borderRadius: 7.5,
            width: '95%',
            height: GLOBALS.windowHeightSize * 0.15,
            backgroundColor: '#ECE7E4',
            borderBottomWidth: msgNum === messages.length - 1 ? 0 : 1,
            borderTopWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            key={msgNum}
            style={{flex: 6, height: '100%', alignItems: 'center'}}
            onPress={() => {
              let inbox = this.state.inbox;
              inbox.messages[msgNum].read = true;
              this.setState({
                inbox: inbox,
                msgIsShown: true,
                currMsg: inbox.messages[msgNum].msg,
              });
              this.updateServer();
            }}>
            <Text
              style={{
                fontSize: 18,
                height: '80%',
                width: '97%',
                textAlignVertical: 'center',
                textAlign: 'center',
                fontFamily: 'sans',
                fontWeight: messages[msgNum].read ? 'normal' : 'bold',
              }}>
              {' '}
              {messages[msgNum].msg.substring(0, 47) + '...'}{' '}
            </Text>
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Icon2.Button
              name="trash-o"
              style={{alignItems: 'center', width: '100%'}}
              backgroundColor="#ECE7E4"
              iconStyle={{width: '100%', textAlign: 'center'}}
              color={GLOBALS.colors.Negative}
              onPress={() => this.deleteMessage(msgNum)}
              solid
            />
          </View>
        </View>,
      );
      messagesToRender.push(
        <View style={{height: GLOBALS.windowHeightSize * 0.01}} />,
      );
    }

    if (messagesToRender.length === 0)
      return (
        <ImageBackground
          source={require('../Images/wall1.png')}
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {/* <View style={{ flex: 1, alignItems: 'center' }}> */}
          <Image
            style={{
              width: GLOBALS.windowWidthSize,
              height: GLOBALS.windowHeightSize,
            }}
            source={require('../Images/noMessages.jpeg')}
          />
        </ImageBackground>
        // {/* </View>   */}
      );
    return (
      <ImageBackground
        source={require('../Images/wall1.png')}
        style={{height: '100%', width: '100%'}}>
        <ScrollView style={{height: GLOBALS.windowHeightSize, width: '100%'}}>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <View
            style={{
              height: GLOBALS.windowHeightSize * 0.05,
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}>
            <TouchableOpacity
              style={{
                width: '30%',
                height: '100%',
                alignItems: 'center',
                backgroundColor: GLOBALS.colors.Negative,
                borderRadius: 7.5,
              }}
              onPress={() => {
                this.setState({removeAll: true});
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                  height: '100%',
                  width: '100%',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}>
                {' '}
                Remove All{' '}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          <ScrollView
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            style={{height: GLOBALS.windowHeightSize * 0.85}}>
            {messagesToRender.reverse()}
            {this.createMsgModal()}
            <View style={{height: GLOBALS.windowHeightSize * 0.05}} />
          </ScrollView>
          {this.createAllAlerts()}
          {this.createRemoveAllAlert()}
        </ScrollView>
      </ImageBackground>
    );
  }
}
