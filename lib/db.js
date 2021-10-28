const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;

exports.connect = (databaseURI) => {
    return new Promise((resolve, reject) => {
        mongoClient.connect(
            databaseURI, 
            { 
                useNewUrlParser: true, 
                usrUnifiedTopology: true 
            }
        ).then(client => {
            resolve(client);
        }).catch(err => {
            reject(err);
        })
    })
}