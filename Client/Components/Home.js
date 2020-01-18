import React from 'react';
import {
    StyleSheet,
    View,
    Button,
    Text,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LeagueTable from './LeagueTable'
import GameResults from './GameResults'
import Register from './Register'
import { Table, Row, Rows } from 'react-native-table-component';

var IP = '10.0.0.33';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            isLoggedIn: false,
            role: null,
            token: null
        };
        this.handleSendRequestToServer = this.handleSendRequestToServer.bind(this);
        this.load = this.load.bind(this);
    }

    handleSendRequestToServer = async (param) => {
        // what if its undefined????
        let token = await AsyncStorage.getItem('token')

        let response = fetch('http://' + IP + ':3000/?data=' + param, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Football-Request': param,
                'Authorization': this.state.token,
            }
        })
            .then((response) => { return response.json() })
            .then((resJson) => {
                if (!resJson.success) {
                    alert(resJson.error.msg);
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
                    case 'insertGameResult':
                        this.props.navigation.navigate('Home')
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
        this.focusListener = this.props.navigation.addListener('didFocus', this.load)
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    async load() {
        let token;
        let currRole;

        try {
            token = await AsyncStorage.getItem('token');
            currRole = await AsyncStorage.getItem('role');
        } catch (err) {
            throw err
        }

        this.setState({ isLoggedIn: (token !== 'none'), token: token, role: currRole })
    }

    render() {
        return (
            <View style={styles.body}>
                <View style={styles.sectionTwoBtnContainer}>
                    {!this.state.isLoggedIn ?
                        (<TouchableOpacity style={styles.divided} onPress={() => this.props.navigation.navigate('Register', { 'IP': IP })}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>)
                        : null
                    }
                    <TouchableOpacity style={styles.divided} onPress={() => this.props.navigation.navigate('Login', { 'IP': IP })}>
                        <Text style={styles.buttonText}>{this.state.isLoggedIn ? 'Logout' : 'Login'}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.touchAble} onPress={() => this.handleSendRequestToServer('leagueTable')}>
                    <Text style={styles.buttonText}>Viewing the league table</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touchAble} onPress={() => this.handleSendRequestToServer('gameResults')}>
                    <Text style={styles.buttonText}>Viewing the game results</Text>
                </TouchableOpacity>

                {this.state.isLoggedIn && (this.state.role === 'referee' || this.state.role === 'manager') ?
                    (<TouchableOpacity style={styles.touchAble} onPress={() => this.handleSendRequestToServer('insertGameResult')}>
                        <Text style={styles.buttonText}>Insert the game results</Text>
                    </TouchableOpacity>)
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        height: '100%',
        backgroundColor: '#D5DBDB',
    },
    sectionTwoBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 32,
        paddingHorizontal: 24,
        //backgroundColor: '#5DADE2',
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        backgroundColor: '#5DADE2',
    },
    divided: {
        flex: 1,
        backgroundColor: '#5D6D7E',
        borderRadius: 25,
        marginHorizontal: 10,
        paddingVertical: 5,
    },
    touchAble: {
        marginTop: 32,
        marginHorizontal: 40,
        paddingHorizontal: 24,
        backgroundColor: '#5D6D7E',
        borderRadius: 25,
        paddingVertical: 5
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#AED6F1',
        textAlign: 'center',
    }
});

