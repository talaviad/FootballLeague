import React from 'react';
import {
    StyleSheet,
    View,
    Button,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            user: "",
            password: ""
        };
        this.load = this.load.bind(this)
        this.onButtonPress = this.onButtonPress.bind(this)
    }

    async componentDidMount() {
        this.load()
        this.focusListener = this.props.navigation.addListener('didFocus', this.load)
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    async load() {
        let token;

        try {
            token = await AsyncStorage.getItem('token');
        } catch (err) {
            throw err;
        }
        console.log('token: ' + token)
        if (token !== 'none') {
            try {
                await AsyncStorage.setItem('token', 'none');
            } catch (err) {
                console.error(err);
                throw err;
            }

            this.props.navigation.navigate('Home')
        }
    }

    async onButtonPress() {
        if (this.state.user === '' || this.state.password === '') {
            alert('you did not fill all the fields')
            return;
        }
        let response = fetch('http://' + this.props.navigation.getParam('IP') + ':3000/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Football-Request': 'login',
            },
            body: JSON.stringify({ user: this.state.user, pass: this.state.password })
        })
            .then((response) => response.json())
            .then(async (resJson) => {
                if (resJson.success) {
                    console.log('resJson.jwt: ' + resJson.jwt)
                    await AsyncStorage.setItem('role', resJson.role);
                    await AsyncStorage.setItem('token', resJson.jwt);
                    this.props.navigation.navigate("Home");
                }
                else {
                    alert(resJson.error.msg)
                }
            })
            .catch(err => alert(err))
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                    placeholder="username"
                    placeholderTextColor="#F8F9F9"
                    onChangeText={user => this.setState({ user })}
                />
                <TextInput style={styles.inputBox}
                    placeholder="password"
                    secureTextEntry={true}
                    placeholderTextColor="#F8F9F9"
                    onChangeText={password => this.setState({ password })}
                />
                <TouchableOpacity style={styles.button} onPress={this.onButtonPress}>
                    <Text style={styles.buttonText}>login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D5DBDB',
    },
    inputBox: {
        width: 300,
        //borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        marginVertical: 10,
        backgroundColor: '#5D6D7E',
        marginTop: 20,

    },
    button: {
        width: '80%',
        backgroundColor: '#5D6D7E',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
        marginTop: 60,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#AED6F1',
        textAlign: 'center',
    }
});


