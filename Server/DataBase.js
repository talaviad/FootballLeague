//var DATABASE_ADDRESS = "mongodb+srv://alonlaza:1234@cluster0-5uxtz.mongodb.net/test?retryWrites=true&w=majority";
//var DATABASE_NAME = "FootballLeague";
var MongoClient = require('mongodb').MongoClient;

module.exports = class DataBase {
    constructor() {
        console.log('connecting to database...')
        this.connect()
    }

    async connect() {
        const DATABASE_ADDRESS = "mongodb+srv://alonlaza:1234@cluster0-5uxtz.mongodb.net/test?retryWrites=true&w=majority";
        const DATABASE_NAME = "FootballLeague";
        this.client = new MongoClient(DATABASE_ADDRESS);
        try {
            // Connect to the MongoDB cluster
            await this.client.connect();
            console.log('connected to database.')
            // Make the appropriate DB calls
            //await findOneListingByName(this.client, 'teamA');
        } catch (e) {
            console.error(e);
        } /*finally {
            await client.close();
        }*/
    }

    async disconnect() {
        await this.client.close();
    }

    async getLeagueTable() {
        try {
            let result = await this.client.db("FootballLeague").collection("LeagueTable").find()
            result = await result.toArray()
            let results = result.map(team => {
                return [team.Club.toString(), team.MP.toString(),
                team.W.toString(), team.D.toString(),
                team.L.toString(), team.GF.toString(),
                team.GA.toString(), team.GD.toString()];
            })
            let resultsToTheServer = {
                'success': true,
                'tableData': results,
            }
            return JSON.stringify(resultsToTheServer);
        }
        catch {
            console.log('in catch')
            return JSON.stringify({ 'success': false });
        }
    }

    async getGameResults(collection_name) {
        try {
            let result = await this.client.db("FootballLeague").collection(collection_name).find()
            result = await result.toArray()
            let results = result.map(game => {
                return [game.team1.toString(), game.result.toString(), game.team2.toString()];
            })
            let resultsToTheServer = {
                'success': true,
                'tableData': results,
            }
            return JSON.stringify(resultsToTheServer);
        }
        catch {
            console.log('in catch')
            return JSON.stringify({ 'success': false });
        }
    }

    async getTeamsNames() {
        try {
            let result = await this.client.db("FootballLeague").collection('LeagueTable').find()
            result = await result.toArray()
            let results = result.map(team => {
                return team.Club.toString();
            })
            let resultsToTheServer = {
                'success': true,
                'teamsNames': results,
            }
            return JSON.stringify(resultsToTheServer);
        }
        catch {
            console.log('in catch')
            return JSON.stringify({ 'success': false });
        }
    }

    async insertResult(data) {
        
        let winner = 0
        try {
            let arr_data = data.split(',')
            if(parseInt(arr_data[3])>parseInt(arr_data[4])){
                winner=1
            }
            else if(parseInt(arr_data[4])>parseInt(arr_data[3])){
                winner=2
            }
            let result = await this.client.db("FootballLeague").collection('LeagueTable').find({ $or: [ { Club: arr_data[1] }, { Club: arr_data[2] } ] })
            result = await result.toArray()
            //We dont know the order the db return the 2 rows so we need this condition
            if(result[0].Club===arr_data[0]){
            this.updateTeamInTable(result[0], 1, winner,parseInt(arr_data[3]), parseInt(arr_data[4]))
            this.updateTeamInTable(result[1], 2, winner,parseInt(arr_data[3]), parseInt(arr_data[4]))
        }
            else{
            this.updateTeamInTable(result[1], 1, winner,parseInt(arr_data[3]), parseInt(arr_data[4]))
            this.updateTeamInTable(result[0], 2, winner,parseInt(arr_data[3]), parseInt(arr_data[4])) 
            }

            await this.client.db("FootballLeague").collection('GamesWeek'+arr_data[5]).insert({ team1: arr_data[1], result: arr_data[3]+' - '+arr_data[4], team2:arr_data[2] })
        
            let resultsToTheServer = {
                'success': true,
            }

            return JSON.stringify(resultsToTheServer);
        }
        catch {
            console.log('in catch')
            return JSON.stringify({ 'success': false });
        }
    }
    updateTeamInTable(teamJson, teamIndex, winner, scoreTeam1, scoreTeam2){
        if(teamIndex==1){
            teamJson.MP = parseInt(teamJson.MP)+1
            if(winner==1){
                teamJson.W = parseInt(teamJson.W)+1 
                teamJson.Pts = parseInt(teamJson.Pts)+3
            }
            else if(winner==0){
                teamJson.D = parseInt(teamJson.D)+1 
                teamJson.Pts = parseInt(teamJson.Pts)+1
            }
            else{
                teamJson.L = parseInt(teamJson.L)+1 
            }
            teamJson.GF = parseInt(teamJson.GF)+scoreTeam1
            teamJson.GA = parseInt(teamJson.GA)+scoreTeam2
            teamJson.GD = parseInt(teamJson.GD)+(scoreTeam1-scoreTeam2)

            let result =  this.client.db("FootballLeague").collection('LeagueTable')
            .replaceOne({ Club: teamJson.Club },teamJson)
        }
        else{
            teamJson.MP = parseInt(teamJson.MP)+1
            if(winner==2){
                teamJson.W = parseInt(teamJson.W)+1 
                teamJson.Pts = parseInt(teamJson.Pts)+3
            }
            else if(winner==0){
                teamJson.D = parseInt(teamJson.D)+1 
                teamJson.Pts = parseInt(teamJson.Pts)+1
            }
            else{
                teamJson.L = parseInt(teamJson.L)+1 
            }
            teamJson.GF = parseInt(teamJson.GF)+scoreTeam2
            teamJson.GA = parseInt(teamJson.GA)+scoreTeam1
            teamJson.GD = parseInt(teamJson.GD)+(scoreTeam2-scoreTeam1)

            let result =  this.client.db("FootballLeague").collection('LeagueTable')
            .replaceOne({ Club: teamJson.Club },teamJson)
        }
    }
    

};




/*database().catch(console.err);
async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}; */