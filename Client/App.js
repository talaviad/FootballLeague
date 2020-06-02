import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';
import Home from './Components/Home';
import LeagueTable from './Components/LeagueTable';
import GamesResults from './Components/GamesResults';
import ScorerTable from './Components/ScorerTable';
import Clubs from './Components/Clubs';
import Register from './Components/Register';
import InsertGame from './Components/InsertGame';
import Login from './Components/Login';
import GameMode from './Components/GameMode';
import AddReferee from './Components/AddReferee';
import AddClub from './Components/AddClub';
import Constraints from './Components/Constraints';
import ManageSchedule from './Components/ManageSchedule';
import LeagueSchedule from './Components/LeagueSchedule';
import PitchConstraints from './Components/PitchConstraints';
import Inbox from './Components/Inbox';
import ChangePassword from './Components/ChangePassword';
import {Text, Image, View} from 'react-native';
const AppNavigator = createStackNavigator(
  {
    Home: Home,

    LeagueTable: LeagueTable,
    GamesResults: GamesResults,
    ScorerTable: ScorerTable,
    Clubs: Clubs,

    Register: Register,
    InsertGame: InsertGame,
    Login: Login,
    GameMode: GameMode,
    AddReferee: AddReferee,
    AddClub: AddClub,
    Constraints: Constraints,
    ManageSchedule: ManageSchedule,
    PitchConstraints: PitchConstraints,
    Inbox: Inbox,
    ChangePassword: ChangePassword,
    LeagueSchedule: LeagueSchedule,
  },

  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#8cb3d9', //#3B8EBE
        borderBottomWidth: 1,
        // borderWidth: 3,
        borderBottomColor: 'black',
      },
      headerTintColor: '#black',
      headerTitleStyle: {
        fontFamily: 'sans-serif-medium',
        color: 'black',
      },
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

//Styling for specific for the Home Page
Home.navigationOptions = {
  headerStyle: {},
  headerTitleStyle: {
    fontFamily: 'sans-serif-medium',
    color: 'black',
  },
  headerLeft: (
    <Image
      source={require('./Images/aguda.jpeg')}
      style={{width: 50, height: 50, marginLeft: 10}}
      resizeMode={'cover'} // cover or contain its upto you view look
    />
  ),
};

GameMode.navigationOptions = {
  headerStyle: {
    backgroundColor: '#687864', //#3B8EBE
    opacity: 0.9,
  },
};
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
