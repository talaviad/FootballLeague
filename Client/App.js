/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Text,
  Alert,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import LeagueTable from './Components/LeagueTable'
import GameResults from './Components/GameResults'

import { Table, Row, Rows } from 'react-native-table-component';
var IP = '132.72.232.77'

class HomeScreen extends React.Component {
  handleSendRequestToServer = (param) => {
    let response = fetch('http://' + IP + ':3000/?data=' + param, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((resJson) => {
        switch (param) {
          case 'leagueTable':
            this.props.navigation.navigate('LeagueTable', {
              'tableData': resJson.tableData
            })
            break;
          case 'gameResults':
            this.props.navigation.navigate('GameResults', {
              'tableData': resJson.tableData
            })
            break;
          default:
            break;

        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //() => this.props.navigation.navigate('LeagueTable')
  render() {
    return (
      <View style={styles.body}>
        <View style={styles.sectionContainer}>
          <Button title='Viewing the league table' onPress={() => this.handleSendRequestToServer('leagueTable')}> </Button>
        </View>
        <View style={styles.sectionContainer}>
          <Button title='Viewing the game results' onPress={() => this.handleSendRequestToServer('gameResults')}> </Button>
        </View>
      </View>

    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    LeagueTable: LeagueTable,
    GameResults: GameResults,
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

/*const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Button
                title="League Table"
                onPress={() => Alert.alert('Suprise')}
              />
            </View>
            <View style={styles.sectionContainer}>
              <Button
                title="Game Resultsssssssss"
                onPress={() => Alert.alert('Suprise')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}; */

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});


/*export default App; */


