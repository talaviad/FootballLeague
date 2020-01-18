import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import LeagueTable from './Components/LeagueTable';
import GameResults from './Components/GameResults';
import Register from './Components/Register';
import InsertGame from './Components/InsertGame';
import Login from './Components/Login';
import Home from './Components/Home';

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    LeagueTable: LeagueTable,
    GameResults: GameResults,
    Register: Register,
    InsertGame: InsertGame,
    Login: Login,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}


