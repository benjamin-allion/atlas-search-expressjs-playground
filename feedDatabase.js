const { MongoClient } = require("mongodb");
const { generateFakeCustomersData } = require ('./helper/generateFakeCustomerData')

const NUMBER_OF_CUSTOMERS_TO_GENERATE = 30000
const uri = 'TO_REPLACE'

const client = new MongoClient(uri);
const fakeCustomers = generateFakeCustomersData(NUMBER_OF_CUSTOMERS_TO_GENERATE);

async function run() {
    try {
        await client.connect();
        const collection = await client.db().collection('customers');
        console.log("Connected successfully to server");

        const insertManyResult = await collection.insertMany(fakeCustomers);
        console.log(`${insertManyResult.insertedCount} documents were inserted.`);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
