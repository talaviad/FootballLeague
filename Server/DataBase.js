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
            console.log('An error occured while was trying to connect to database..')
            console.error(e);
        } /*finally {
            await client.close();
        }*/
    }

    async disconnect() {
        await this.client.close();
    }

    async registerNewUser(user, pass, email, requestedRole) {
        let result = await this.client.db('FootballLeague').collection("Users").find({
            $or: [{ username: user }, { email: email }]
        });
        console.log('res: ' + result)
        result = await result.toArray()
        if (result.length !== 0) {
            let registerError = {
                success: false,
                error: {
                    msg: 'username or email is already in used'
                }
            }
            return registerError
        }

        try {
            result = await this.client.db('FootballLeague').collection("Users").insertOne({
                username: user, password: pass, email: email, role: requestedRole
            });
        } catch (err) {
            console.error(err);
            let registerError = {
                success: false,
                error: {
                    msg: err
                }
            }
            return registerError
        };

        // let results = result.map(doc => {
        //     console.log(doc.username.toString());
        //     console.log(doc.email.toString());
        // })
        return { success: true }
    }

    async getUser(user) {
        let result = await this.client.db('FootballLeague').collection("Users").find(
            { username: user }
        );
        console.log('res: ' + result)
        result = await result.toArray()
        if (result.length === 0) {
            let registerError = {
                success: false,
                error: {
                    msg: 'username or password are incorrect'
                }
            }
            return registerError
        }
        else {
            let resultToServer = {
                success: true,
                password: result[0].password,
                role: result[0].role
            }
            return resultToServer
        }
    }

    async getLeagueTable() {
        try {
            let result = await this.client.db("FootballLeague").collection("LeagueTable").find()
            result = await result.toArray()
            let results = result.map(team => {
                return [team.Club.toString(), team.MP.toString(),
                team.W.toString(), team.D.toString(),
                team.L.toString(), team.GF.toString(),
                team.GA.toString(), team.GD.toString(), team.Pts.toString()];
            })
            let resultsToTheServer = {
                success: true,
                tableData: results,
            }
            return resultsToTheServer;
        }
        catch {
            console.log('in catch')
            return {
                success: false,
                error: {
                    msg: 'Coudln"t find collection "FootballLeague"'
                }
            };
        }
    }
};