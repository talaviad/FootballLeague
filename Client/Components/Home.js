import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Button,
    Text,
    AsyncStorage
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import LeagueTable from './LeagueTable'
import GameResults from './GameResults'
import Register from './Register'
import { Table, Row, Rows } from 'react-native-table-component';
var IP = '192.168.1.124'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            isLoggedIn: false,
            role: null
        };
    }
     static  handleSendRequestToServer  (param)  {
        let response = fetch('http://' + IP + ':3000/?data=' + param, {
            method: "GET"
        })
            .then((response) => { return response.json() })
            .then((resJson) => {
                if (!resJson.success) {
                    alert('An error with the server');
                    return;
                }
                switch (param) {
                    case 'leagueTable':
                        this.props.navigation.navigate('LeagueTable', {
                            'tableData': resJson.tableData
                        })
                        break;
                    case 'GamesWeek1':
                        //alert(resJson.tableData)
                        return resJson.tableData;
                        break;
                    case 'register':
                        this.props.navigation.navigate('Register')
                        break;
                    default:
                        break;

                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.load()
        this.props.navigation.addListener('willFocus', this.load)
    }

    async load() {
        console.log('in load')
        const role = await AsyncStorage.getItem('role')
        console.log('role: ' + role)
        if (role !== null) {
            this.setState({ isLoggedIn: true, role: role })
        }
    }

    getWelcomeMessage() {
        return this.state.isLoggedIn ? 'Hello ' + this.state.role + ' user' : 'Hello anonymous'
    }

    render() {
        return (
            <View style={styles.body}>
                <Text style={{ color: 'red' }}>
                    {this.getWelcomeMessage()}
                </Text>
                <View style={styles.sectionContainer}>
                    <Button title={this.state.isLoggedIn ? 'Logout' : 'Register\\Login'} onPress={() => this.props.navigation.navigate('Register', { 'IP': IP, 'isLoggedIn': this.state.isLoggedIn })}> </Button>
                </View>
                <View style={styles.sectionContainer}>
                    <Button title='Viewing the league table' onPress={() => this.handleSendRequestToServer('leagueTable')}> </Button>
                </View>
                <View style={styles.sectionContainer}>
                    <Button title='Viewing the game results' onPress={() => this.props.navigation.navigate('GameResults')}> </Button>
                </View>
                <View style={styles.sectionContainer}>
                    <Button title='Insert Game Result' onPress={() => this.props.navigation.navigate('InsertGame')}> </Button>
                </View>
            </View>

        );
    }
}

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