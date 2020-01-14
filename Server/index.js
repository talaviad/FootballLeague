//import DataBase from './DataBase.js'
var DataBase = require('./DataBase.js')
var express = require('express');
var bodyParser = require('body-parser');


var app = express();
var port = 3000

var teams = {
    'NumOfTeams': '8',
    'tableData': [
        ['TeamA', '1', '1', '0', '0', '2', '1', '1', '+3'],
        ['TeamB', '1', '1', '0', '0', '5', '2', '3', '+3'],
        ['TeamC', '1', '1', '0', '0', '2', '2', '0', '+1'],
        ['TeamD', '1', '1', '0', '0', '1', '1', '0', '+1'],
        ['TeamR', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['TeamF', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['TeamG', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['TeamH', '0', '0', '0', '0', '0', '0', '0', '0'],
    ]
}

var results = {
    'NumOfGames': '4',
    'tableData': [
        ['Team A\nTeam B', '3\n0', '1.1.20'],
        ['Team C\nTeam D', '1\n1', '1.1.20'],
        ['Team E\nTeam F', '3\n2', '1.1.20'],
        ['Team G\nTeam H', '1\n4', '2.1.20']
    ]
}

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    //console.log(req.query.data)
    let results = []
    let data = req.query.data
    if (data === 'leagueTable') {
        database.getLeagueTable().then(DBResponse => { console.log('DBResponse: ' + DBResponse); res.send(DBResponse) })
    }

    else if (data === 'gameResults') {
        res.send(results)
    }
    else {

    }
})

var database = new DataBase();

app.post('/', function (req, res) {
    console.log("Got a Post message");
    console.log('body: ' + req.body.user);
    res.send(JSON.stringify({ 'role': 'regular' }))
})

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
    //database().catch(console.err); 
})


