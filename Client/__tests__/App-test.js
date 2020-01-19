/**
 * @format
 */

import 'react-native';
import React from 'react';
//import App from '../App';
import InsertGame from '../Components/InsertGame';
import GameResults from '../Components/GamesResults';


//import "isomorphic-fetch"

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('InsertGame renders correctly', () => {
  let insertGame = 
  renderer.create(<InsertGame />).getInstance();
  insertGame.setState({ week:5 })
  insertGame.setState({ selectedTeam1:'Basa'})
  insertGame.setState({ selectedTeam2:'TLV'})
  insertGame.setState({ scoreTeam1:6})
  insertGame.setState({ scoreTeam2:0})
  const response =  global.fetch('http://' + '10.0.0.9' + ':3000/?data=' + 'Result,' + insertGame.state.selectedTeam1 +
  ',' + insertGame.state.selectedTeam2 + ',' + insertGame.state.scoreTeam1 + ',' + insertGame.state.scoreTeam2 + ',' + insertGame.state.week,
  {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Football-Request': 'Result',
    }
  })


  // const DATABASE_ADDRESS = "mongodb+srv://alonlaza:1234@cluster0-5uxtz.mongodb.net/test?retryWrites=true&w=majority";
  // const DATABASE_NAME = "FootballLeague";
  // this.client = new MongoClient(DATABASE_ADDRESS);
  // try {
  //     // Connect to the MongoDB cluster
  //     await this.client.connect();
  //     console.log('connected to database.')
  //     // Make the appropriate DB calls
  //     //await findOneListingByName(this.client, 'teamA');
  // } catch (e) {
  //     console.log('An error occured while was trying to connect to database..')
  //     console.error(e);
  // } /*finally {


});
  
  it('GameResults renders correctly', () => {
    let gameResults = 
    renderer.create(<GameResults />).getInstance();
  });

