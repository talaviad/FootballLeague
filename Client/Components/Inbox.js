import React from 'react';
import { 
    View, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    Dimensions, 
    Modal,
}  from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
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
    };
    this.updateServer = this.updateServer.bind(this);
    this.createMsgModal = this.createMsgModal.bind(this);
  }

  async updateServer(msgNum) {
    let inbox = this.state.inbox;
    inbox.messages[msgNum].read = true;
    this.setState({inbox: inbox, msgIsShown: true, currMsg: inbox.messages[msgNum].msg});

    try {
        let response = await fetch('http://' + this.props.navigation.getParam('IP') + ':' + this.props.navigation.getParam('PORT') +'/', {
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
                <View style={{ alignItems: 'center', flexDirection:'column', height: '60%', width: '100%', backgroundColor: GLOBALS.colors.ModalBackGround }}>
                    <Text style={{ fontSize: 20, flex: 9, width: '90%' }}> 
                        {this.state.currMsg}
                    </Text>
                    <TouchableOpacity style={{ justifyContent: 'center', flex: 1, width: '50%', backgroundColor: GLOBALS.colors.Negative, borderRadius: 25, height: '20%' }} onPress={() =>this.setState({msgIsShown: false})}>
                        <Text style={{fontSize: 18, width: '100%', textAlign: 'center', color: '#FCFAFA'}}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal> 
      );
  }

  render() {
    const messagesToRender = [];
    let messages = this.state.inbox.messages;
    for (let msgNum=0; msgNum<messages.length; msgNum++) {
        console.log('messages[msgNum]: ' + messages[msgNum]);
        messagesToRender.push(
            <TouchableOpacity
              key={msgNum}
              style={{height: (Dimensions.get('window').height/10), backgroundColor: GLOBALS.colors.BackGround, borderBottomWidth: 2}}
              onPress={() => {
                this.updateServer(msgNum);
              }}>
                <Text style={{fontWeight: (messages[msgNum].read)? 'normal' : 'bold'}}> {messages[msgNum].msg} </Text>
            </TouchableOpacity>
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