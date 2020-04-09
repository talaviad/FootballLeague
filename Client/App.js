import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import LeagueTable from './Components/LeagueTable';
import GamesResults from './Components/GamesResults';
import ScorerTable from './Components/ScorerTable';
import Register from './Components/Register';
import InsertGame from './Components/InsertGame';
import Login from './Components/Login';
import Home from './Components/Home';
import GameMode from './Components/GameMode';


const AppNavigator = createStackNavigator(
  {
    Home: Home,
    LeagueTable: LeagueTable,
    GamesResults: GamesResults,
    ScorerTable: ScorerTable,
    Register: Register,
    InsertGame: InsertGame,
    Login: Login,
    GameMode: GameMode,
  },
  {
    initialRouteName: 'Home',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
