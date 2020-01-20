/**
 * @format
 */

import 'react-native';
import React from 'react';
//import App from '../App';
import InsertGame from '../Components/InsertGame';
import GameResults from '../Components/GamesResults';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';


function fetch(url) {
  return new Promise(function (resolve, reject) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var request = new XMLHttpRequest();
    console.log('request: ' + request)
    request.open("GET", url);
    request.onload = function () {
      resolve(this.response);
    };
    request.onerror = function () {
      reject("Network error!");
    };
    request.send();
  })
};

continuewith = async () => {
  let respone = await fetch('http://10.0.0.33:3000/').
    then(res => console.log('responseeeeeeeeeeeee: ' + res)).
    catch(res => console.log('responseeeeeeeeeeeee: ' + res))
  //console.log('responseeeeeeeeeeeee: ' + response)
}

it('InsertGame renders correctly', () => {
  //continuewith();

  // console.log('before create');
  // let insertGame = renderer.create(<InsertGame />).getInstance();
  // console.log('before set state');

  // insertGame.setState({ week: 5 })
  // console.log('after set state');

  // insertGame.setState({ selectedTeam1: 'Basa' })
  // insertGame.setState({ selectedTeam2: 'TLV' })
  // insertGame.setState({ scoreTeam1: 3 })
  // insertGame.setState({ scoreTeam2: 5 })
  // insertGame.getTeamsNames('TeamsNames')
  // let c = insertGame.sendResultToServer()
});

// it('GameResults renders correctly', () => {
//   let gameResults =
//     renderer.create(<GameResults />).getInstance();
// });

