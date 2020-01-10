var DATABASE_ADDRESS = "mongodb+srv://alonlaza:1234@cluster0-5uxtz.mongodb.net/test?retryWrites=true&w=majority";
var DATABASE_NAME = "FootballLeague";
var MongoClient = require('mongodb').MongoClient;

export default class database {
    constructor() {
        this.client = new MongoClient(DATABASE_ADDRESS);
        try {
            // Connect to the MongoDB cluster
            await client.connect();

            // Make the appropriate DB calls
            await findOneListingByName(client, 'teamA');

        } catch (e) {
            console.error(e);
        } /*finally {
            await client.close();
        }*/
    }

    async getLeagueTable(client) {
        results = []
        result = await client.db("FootballLeague").collection("LeagueTable").find()
        if (result) {
            documents = result.toArray();
            documents.forEach(function (myDoc) {
                results.push([myDoc.Club.toString(), myDoc.MP.toString(),
                myDoc.W.toString(), myDoc.D.toString(),
                myDoc.L.toString(), myDoc.GF.toString(),
                myDoc.GA.toString(), myDoc.GD.toString()])
                //console.log(myDoc.Pts.toString());
            })
            //console.log(result);
        } else {
            //console.log(`No listings found with the name '${nameOfListing}'`);
        }
    }

    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
}

/*database().catch(console.err);
async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}; */