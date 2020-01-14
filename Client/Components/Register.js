import React from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import {
    StyleSheet,
    View,
    Button,
    Text,
    ScrollView,
    AsyncStorage,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            user: "",
            password: "",
        };
    }

    async componentDidMount() {
        console.log('in didMount')
        if (this.props.navigation.getParam('isLoggedIn')) {
            console.log('in first if')
            await AsyncStorage.setItem('role', null);
            this.props.navigation.navigate('Home')
        }
        const role =  ('role');
        if (role !== null) {
            this.props.navigation.navigate('Home')
        }
    }

    async onButtonPress() {
        let response = fetch('http://' + this.props.navigation.getParam('IP') + ':3000/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'user': this.state.user, 'password': this.state.password })
        })
            .then((response) => response.json())
            .then(async (resJson) => {
                await AsyncStorage.setItem('role', resJson.role);
                this.props.navigation.navigate("Home");
            })
            .catch(err => alert(err))
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Text"
                    placeholderTextColor="#ffffff"
                    selectionColor="#fff"
                    //onSubmitEditing={() => this.password.focus()}
                    onChangeText={user => this.setState({ user })}
                />
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#ffffff"
                    //ref={(input) => this.password = input}
                    onChangeText={password => this.setState({ password })}
                />
                <TouchableOpacity style={styles.button} onPress={this.onButtonPress.bind(this)}>
                    <Text style={styles.buttonText}></Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255, 255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
    },
    button: {
        width: 300,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    }

});