import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';

import LeagueTable from './Components/LeagueTable';
import GameResults from './Components/GameResults';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    LeagueTable: LeagueTable,
    GameResults: GameResults,
    Register: Register,
    Login: Login,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  // constructor(props) {
  //   super(props)
  //   const { navigation } = this.props;
  //   this.handleSendRequestToServer = function(param) { 
  //    this.props.navigation.navigate('LeagueTable')
  //   }
  

  // this.hola = function() {
  //   console.log('ffff')
  // }

  // handleSendRequestToServer(param) {
  //     AppNavigator.navigate('LeagueTable')
  // }

  render() {
    return <AppContainer />;
  }
}


