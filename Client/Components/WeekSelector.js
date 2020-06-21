import React, {useState} from 'react';
import DatePicker from 'react-native-datepicker';
import {View, Button, Platform} from 'react-native';
import Moment from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';
import GLOBALS from '../Globals';

export default class WeekSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currDate: props.date,
      weekPage: props.weekPage,
      alerts: {
        wrongChoose: {
          toShow: false,
          msg: '',
        },
      },
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange = (dateStr, date) => {
    if (date.getDay() !== 0) {
      this.state.weekPage.setAlertsState(
        'wrongChoose',
        true,
        'You are able to choose only sundays (start of the week)',
      );
      return;
    }
    this.setState({currDate: date});
    this.state.weekPage.setDate(date);
  };

  static getDerivedStateFromProps(props, state) {
    state.currDate = props.date;
  }

  render() {
    const curr = new Date(); // get current date
    const startOfTheWeek = curr.getDate() - curr.getDay();
    return (
      <View style={{width: '100%', height: '80%'}}>
        <DatePicker
          style={{
            borderRadius: 7.5,
            backgroundColor: '#E3E2DF',
            width: '100%',
            height: GLOBALS.windowHeightSize * 0.05,
          }}
          date={this.state.currDate}
          mode="date"
          placeholder="Select Day"
          format="DD/MM/YY"
          minDate="01/06/20"
          maxDate="01/06/21"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateTouchBody: {
              height: '100%',
              width: '100%',
              borderRadius: 7.5,
              backgroundColor: '#0c4271',
            },
            dateIcon: {
              //   position: 'absolute',
              //   left: 4,
              //   top: 4,
              //   marginLeft: 0,
            },
            dateInput: {
              //   marginLeft: 36,
              borderWidth: 0,
            },
            // dateInput: {backgroundColor: '#ADADAD'},
            dateText: {
              color: 'white',
              fontSize: 14,
              fontFamily: 'sans',
              //fontWeight: 'bold',
            },
            placeholderText: {
              color: 'white',
              fontSize: 14,
              fontFamily: 'sans-serif-condensed',
              fontStyle: 'italic',
            },
          }}
          onDateChange={(dateStr, date) => {
            this.onChange(dateStr, date);
          }}
        />
      </View>
    );
  }
}
