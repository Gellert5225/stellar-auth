const databaseController = require('./db');

class Stellar {
    constructor(databaseURI) {
        databaseController.connect(databaseURI).then(client => {
            this.client = client;
            this.database = client.db(client.s.options.dbName);
            console.log('Database Connected');
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        })
    }
}