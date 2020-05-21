import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';
import Home from './Components/Home';
import LeagueTable from './Components/LeagueTable';
import GamesResults from './Components/GamesResults';
import ScorerTable from './Components/ScorerTable';
import Squads from './Components/Squads';
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

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    LeagueTable: LeagueTable,
    GamesResults: GamesResults,
    ScorerTable: ScorerTable,
    Squads: Squads,

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
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
