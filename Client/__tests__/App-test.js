/**
 * @format
 */

import 'react-native';
import React from 'react';
//import App from '../App';
import InsertGame from '../Components/InsertGame';
import GameResults from '../Components/GameResults';



// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('InsertGame renders correctly', () => {
  let insertGame = 
  renderer.create(<InsertGame />).getInstance();
  insertGame.setState({ week:5 })
  insertGame.setState({ selectedTeam1:'Basa'})
  insertGame.setState({ selectedTeam2:'TLV'})
  insertGame.setState({ scoreTeam1:3})
  insertGame.setState({ scoreTeam2:5})
  insertGame.getTeamsNames('TeamsNames')
  let c = insertGame.sendResultToServer()
});
  
  it('GameResults renders correctly', () => {
    let gameResults = 
    renderer.create(<GameResults />).getInstance();
  });

