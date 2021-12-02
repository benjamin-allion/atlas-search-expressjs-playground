const MongoClient = require('mongodb').MongoClient
let mongoCollection = undefined;
const { mongoUri } = require('../mongoUri')

/**
 * Method to get current MongoDB database connexion
 * @return {Promise<*>}
 */
const getMongoCollection = async () => {
    if (mongoCollection) { return mongoCollection }

    const connection = await MongoClient.connect(mongoUri)
    mongoCollection = await connection.db().collection('customers')
    return mongoCollection
}

module.exports = { getMongoCollection };
