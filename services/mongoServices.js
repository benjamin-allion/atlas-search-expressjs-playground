const MongoClient = require('mongodb').MongoClient
let mongoCollection = undefined;
const { mongoUri, mongoCollectionName } = require('../mongoUri')

/**
 * Method to get current MongoDB database connexion
 * @return {Promise<*>}
 */
const getMongoCollection = async () => {
    if (mongoCollection) { return mongoCollection }

    const connection = await MongoClient.connect(mongoUri)
    mongoCollection = await connection.db().collection(mongoCollectionName)
    return mongoCollection
}

module.exports = { getMongoCollection };
