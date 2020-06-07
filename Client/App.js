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
import RefereeTools from './Components/RefereeTools';
import CaptainTools from './Components/CaptainTools';
import ManagerTools from './Components/ManagerTools';

import Login from './Components/Login';
import GameMode from './Components/GameMode';
import AddReferee from './Components/AddReferee';
import AddClub from './Components/AddClub';
import Constraints from './Components/Constraints';
import ManageSchedule from './Components/ManageSchedule';
import LeagueSchedule from './Components/LeagueSchedule';
import PitchConstraints from './Components/PitchConstraints';
import PersonalArea from './Components/PersonalArea';

import Inbox from './Components/Inbox';
import ChangePassword from './Components/ChangePassword';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

const AppNavigator = createStackNavigator(
  {
    Home: Home,

    'League Table': LeagueTable,
    Results: GamesResults,
    'Scorer Table': ScorerTable,
    Clubs: Clubs,
    Register: Register,
    'Insert Result': InsertGame,
    Login: Login,
    'Game Mode': GameMode,
    'Add Referee': AddReferee,
    'Add Club': AddClub,
    Constraints: Constraints,
    ManageSchedule: ManageSchedule,
    PitchConstraints: PitchConstraints,
    'Referee Tools': RefereeTools,
    'Captain Tools': CaptainTools,
    'Manager Tools': ManagerTools,
    'Personal Area': PersonalArea,
    Inbox: Inbox,
    'Change Password': ChangePassword,
    LeagueSchedule: LeagueSchedule,
  },

  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#073567', //#3B8EBE
        borderBottomWidth: 1,
        borderBottomColor: 'black',
      },
      headerTintColor: '#black',
      headerTitleStyle: {
        fontFamily: 'sans-serif-medium',
        color: 'white',
      },
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

//Styling for specific for the Home Page
Home.navigationOptions = {
  headerStyle: {
    backgroundColor: '#073567',
  },
  headerTitleStyle: {
    fontFamily: 'sans-serif-medium',
    color: 'white',
  },
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
