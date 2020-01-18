//import DataBase from './DataBase.js'
var DataBase = require('./DataBase.js')
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./config.js');
var bcrypt = require('bcrypt');

var app = express();
var port = 3000

// var teams = {
//     'NumOfTeams': '8',
//     'tableData': [
//         ['TeamA', '1', '1', '0', '0', '2', '1', '1', '+3'],
//         ['TeamB', '1', '1', '0', '0', '5', '2', '3', '+3'],
//         ['TeamC', '1', '1', '0', '0', '2', '2', '0', '+1'],
//         ['TeamD', '1', '1', '0', '0', '1', '1', '0', '+1'],
//         ['TeamR', '0', '0', '0', '0', '0', '0', '0', '0'],
//         ['TeamF', '0', '0', '0', '0', '0', '0', '0', '0'],
//         ['TeamG', '0', '0', '0', '0', '0', '0', '0', '0'],
//         ['TeamH', '0', '0', '0', '0', '0', '0', '0', '0'],
//     ]
// }

// var results = {
//     'NumOfGames': '4',
//     'tableData': [
//         ['Team A\nTeam B', '3\n0', '1.1.20'],
//         ['Team C\nTeam D', '1\n1', '1.1.20'],
//         ['Team E\nTeam F', '3\n2', '1.1.20'],
//         ['Team G\nTeam H', '1\n4', '2.1.20']
//     ]
// }

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/', require('./Middlewares/auth.js'))

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    let results = []
    let data = req.query.data
    if (data === 'leagueTable') {
        database.getLeagueTable().
            then(DBResponse => {
                console.log('results:' + DBResponse)
                res.send(JSON.stringify(DBResponse))
            })
    }
    else if (data === 'gameResults') {
        res.send(JSON.stringify(results))
    }
    else {
    }
})

var database = new DataBase();

handleLoginRequest = async (user, pass) => {
    let DBresponse = await database.getUser(user)
    if (DBresponse.success) {
        try {
            let passwordAreMatch = await bcrypt.compare(pass, DBresponse.password)
            if (passwordAreMatch) {
                let randNumForSignature = Math.floor(Math.random() * 100);
                let resultsToTheServer = {
                    success: true,
                    role: DBresponse.role,
                    id: randNumForSignature,
                    username: user,
                    jwt: jwt.sign({
                        id: randNumForSignature,
                        role: DBresponse.role,
                        username: user,
                    }, config.JWT_SECRET)
                }
                return JSON.stringify(resultsToTheServer);
            }
            else {
                let resultsToTheServer = {
                    success: false,
                    error: {
                        msg: 'username or password are incorrect'
                    }
                }
                return JSON.stringify(resultsToTheServer);
            }
        } catch (err) {
            console.error(err);
            let resultsToTheServer = {
                success: false,
                error: {
                    msg: 'some error occured with the hashing'
                }
            }
            return JSON.stringify(resultsToTheServer);
        }
    }
    else {
        return JSON.stringify(DBresponse);
    }
}

handleRegisterRequest = async (user, pass, requestedRole, email) => {
    if (requestedRole !== 'referee' && requestedRole !== 'captain' && requestedRole !== 'regular') {
        let registerError = {
            success: false,
            error: {
                msg: 'the role you asked does not exists'
            }
        }
        return JSON.stringify(registerError);
    }
    try {
        let hashPassword = await bcrypt.hash(pass, config.BCRYPT_SALT_ROUNDS);
        let DBResponse = await database.registerNewUser(user, hashPassword, email, requestedRole);
        console.log('DBResponse: ' + DBResponse)
        console.log('DBResponse.success: ' + DBResponse.success)
        if (DBResponse.success) {
            return JSON.stringify({
                success: true,
            });
        }
        else {
            return JSON.stringify(DBResponse);
        }
    } catch (err) {
        console.error(err);
        return JSON.stringify({
            success: false,
            error: {
                msg: 'some error occured while trying to register the user'
            }
        });
    }
}

app.post('/', function (req, res) {
    console.log("Got a Post message");
    console.log('user: ' + req.body.user);
    console.log('pass: ' + req.body.pass);
    console.log('role: ' + req.body.requestedRole);
    console.log('email: ' + req.body.email);
    switch (req.get('Football-Request')) {
        case 'login':
            handleLoginRequest(req.body.user, req.body.pass).
                then(ans => res.send(ans))
            break;
        case 'register':
            handleRegisterRequest(req.body.user, req.body.pass, req.body.requestedRole, req.body.email).
                then(ans => res.send(ans))
            break;
        default:
            break;
    }
})

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})


