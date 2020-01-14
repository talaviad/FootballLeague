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
        let result = []
        try {
            console.log('ccccccccccccc')


            result = await this.client.db("FootballLeague").collection("LeagueTable").find()
            result = result.toArray(function (err, response) {
                if (err) {
                    return null;
                    //return JSON.stringify({ 'success': false });
                    // res.send(JSON.stringify({ 'success': false }))
                }

                //     let results = []
                let results = response.map(team => {
                    console.log('team: ' + team)
                    let newTeam = [team.Club.toString(), team.MP.toString(),
                    team.W.toString(), team.D.toString(),
                    team.L.toString(), team.GF.toString(),
                    team.GA.toString(), team.GD.toString()];
                    console.log('newTeam: ' + newTeam)
                    return newTeam;
                }

                console.log('resultttttt: ' + results)
                return JSON.stringify(results);
            })
                //     // res.map(team => 
                //     //     results.push([team.Club.toString(), team.MP.toString(),
                //     //         team.W.toString(), team.D.toString(),
                //     //         team.L.toString(), team.GF.toString(),
                //     //         team.GA.toString(), team.GD.toString()]))
                //     console.log('results: ' + results);
                //    // res.send(JSON.stringify(results));
                //    return JSON.stringify(results);
                //     //db.close();

            //.then(res => { res = res.toArry();  console.log('res: ' + res)})
            //return this.client.db("FootballLeague").collection("LeagueTable").find({});
        }
        catch {
            return JSON.stringify({ 'success': false });
        }
    }
};

/*database().catch(console.err);
async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}; */