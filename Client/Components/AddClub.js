import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import AddClubStep1 from './AddClubStep1';
import AddClubStep2 from './AddClubStep2';
import AnimatedMultistep from 'react-native-multistep-forms';

const allSteps = [
  {name: 'step 1', component: AddClubStep1},
  {name: 'step 2', component: AddClubStep2},
];

export default class AddClub extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;

    this.state = {};
  }

  onNext = () => {
    //
  };
  onBack = () => {
    // allSteps.step1.setState({clubName: 'aa'});
  };

  finish = state => {
    console.log('TCL: App -> state', state);
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#336da8'}}>
        <View style={styles.lowerContainer}>
          <AnimatedMultistep
            steps={allSteps}
            onFinish={this.finish}
            animate={true}
            onBack={this.onBack}
            onNext={this.onNext}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 32,
    color: '#fff',
  },
  lowerContainer: {
    flex: 2,
  },
});
