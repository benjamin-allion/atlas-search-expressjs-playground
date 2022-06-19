const { MongoClient } = require("mongodb");
const { generateFakeCustomersData } = require ('./helper/generateFakeCustomerData');

const NUMBER_OF_CUSTOMERS_TO_GENERATE = 30000;
const { mongoUri, mongoCollectionName } = require('./mongoUri');

const client = new MongoClient(mongoUri);
const fakeCustomers = generateFakeCustomersData(NUMBER_OF_CUSTOMERS_TO_GENERATE);

async function run() {
    try {
        await client.connect();
        const mongoCollection = await client.db().collection(mongoCollectionName);
        console.log("Connected successfully to server");

        const insertManyResult = await mongoCollection.insertMany(fakeCustomers);
        console.log(`${insertManyResult.insertedCount} documents were inserted.`);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
