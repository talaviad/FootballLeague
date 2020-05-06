import React from 'react';
import {
  Table,
  Row,
  Rows,
  Col,
  TableWrapper,
} from 'react-native-table-component';
import { View, StyleSheet, ScrollView, Button, Text, TouchableOpacity, TextInput, Dimensions, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker'; // tal's old state

export default class Inbox extends React.Component {
  constructor(props) {
    console.log('In Inbox.js constructor111111');
    super(props);
    const {navigation} = this.props;

    // Initialize state
    this.state = {
        inbox: navigation.getParam('inbox'),
        msgIsShown: false,
        currMsg: '',
    };
    this.updateServer = this.updateServer.bind(this);
    this.createMsgModal = this.createMsgModal.bind(this);
  }

  componentDidMount() {
    console.log('In componentDidMount22222')
    this.load();
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      this.load,
    );
  }

  componentWillUnmount() {
    console.log('In componentWillUnmount33333')
    this.focusListener.remove();
    //this.updateServer();
  }

  async load() {
    // let token;

    // try {
    //   token = await AsyncStorage.getItem('token');
    // } catch (err) {
    //   throw err;
    // }

    // this.getConstraints(token);
  }

  async updateServer(msgNum) {
    let inbox = this.state.inbox;
    inbox.messages[msgNum].read = true;
    this.setState({inbox: inbox, msgIsShown: true, currMsg: inbox.messages[msgNum].msg});

    console.log('In Inbox.js - updateServer()');
    console.log('this.props.navigation.getParam(IP): ' + this.props.navigation.getParam('IP'));
    try {
        let response = await fetch('http://' + this.props.navigation.getParam('IP') + ':3000/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Football-Request': 'UpdateInbox',
            Authorization: await AsyncStorage.getItem('token'),
            },
            body: JSON.stringify({
                inbox: this.state.inbox,
            }),
        });
        let json = await response.json();
        console.log('In Inbox.js, updateServer() - json.success: ' + json.success);
        if (json.success)
            console.log('json.inbox: ' + json.inbox);
        else
            console.log('Error message: ' + json.error.msg);
    } catch (err) {
        alert('An error occured in Inbox.js - updateServer(): ' + err);
    }
  }

  createMsgModal() {
      return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.msgIsShown}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            }}
            >
                <View style={{ alignItems: 'center', flexDirection:'column', height: '60%', width: '90%', backgroundColor: '#14B1F8', margin: 20}}>
                    <Text style={{flex: 8, width: '100%'}}> 
                        {this.state.currMsg}
                    </Text>
                    <TouchableOpacity style={{ justifyContent: 'center', flex:2, width: '50%', backgroundColor: '#D91D1D', borderRadius: 25, height: '20%' }} onPress={() =>this.setState({msgIsShown: false})}>
                        <Text style={{fontSize: 18, width: '100%', textAlign: 'center', color: '#FCFAFA'}}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal> 
      );
  }

  render() {
    console.log('In render44444');
    const messagesToRender = [];
    let messages = this.state.inbox.messages;
    for (let msgNum=0; msgNum<messages.length; msgNum++) {
        console.log('messages[msgNum]: ' + messages[msgNum]);
        messagesToRender.push(
            <TouchableOpacity
              style={{height: (Dimensions.get('window').height/10), backgroundColor: '#1AACBC', borderWidth: 1}}
              onPress={() => {
                this.updateServer(msgNum);
              }}>
                <Text style={{fontWeight: (messages[msgNum].read)? 'normal' : 'bold'}}> {messages[msgNum].msg} </Text>
            </TouchableOpacity>


            // <View style={{height: (Dimensions.get('window').height/10), backgroundColor: '#1AACBC', borderWidth: 1}}>
            //     <Text style={{fontWeight: (messages[msgNum].read)? 'normal' : 'bold'}}> {messages[msgNum].msg} </Text>
            // </View>
        )
    }

    return (
        <ScrollView style={{height: '100%', width: '100%'}}>
            {messagesToRender.reverse()}
            {this.createMsgModal()}
        </ScrollView>
    );
  }
}