var express = require('express');
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

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    //console.log(req.query.data)
    let data = req.query.data
    if (data === 'leagueTable') {
        res.send(teams)
    }
    else if (data === 'gameResults') {
        res.send(results)
    }
    else {

    }
})

app.post('/', function (req, res) {
    console.log("Got a Post message");
    res.send(JSON.stringify({ 'role': 'regular'}))
  })

async function getLeagueTable(client) {
    results = []
    result = await client.db("FootballLeague").collection("LeagueTable").find()
    if (result) {
        documents = result.toArray();
        documents.forEach(function (myDoc) {
            results.push([myDoc.Club.toString(), myDoc.MP.toString(),
            myDoc.W.toString(), myDoc.D.toString(),
            myDoc.L.toString(), myDoc.GF.toString(),
            myDoc.GA.toString(), myDoc.GD.toString()])
        })
    } else {
        //c will be implemented
    }
}

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

    const DATABASE_ADDRESS = "mongodb+srv://alonlaza:1234@cluster0-5uxtz.mongodb.net/test?retryWrites=true&w=majority";
    const DATABASE_NAME = "FootballLeague";
    var MongoClient = require('mongodb').MongoClient;

    async function database() {
        /**
         * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
         * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
         */


        var client = new MongoClient(DATABASE_ADDRESS);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

        } catch (e) {
            console.error(e);
        } 
        finally {
            await client.close();
        }

        // Make the appropriate DB calls
    
    }

    database().catch(console.err); 
})


