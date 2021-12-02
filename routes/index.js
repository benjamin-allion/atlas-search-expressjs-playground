const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient

const DEFAULT_CUSTOMERS_LIMIT = 30;
const SEARCH_INDEX_NAME = 'default'
let mongoCollection = undefined;

/**
 * Method to get current MongoDB database connexion
 * @return {Promise<*>}
 */
const getMongoCollection = async () => {
  if (mongoCollection) { return mongoCollection }

  const uri = 'TO_REPLACE';
  const connection = await MongoClient.connect(uri)
  mongoCollection = await connection.db().collection('customers')
  return mongoCollection
}

/* GET home page. */
router.get('/', async (req, res, next) => {
  const searchResult = await getAllCustomers();
  res.render(
      'index', {
        searchResult,
        mongoAggregation: 'No $search query to display.',
        searchForm: {}
      }
  );
});

/**
 * Return customers from database without doing any search request
 */
const getAllCustomers = async() => {
  const mongoCollection = await getMongoCollection();
  return mongoCollection.find({}).limit(DEFAULT_CUSTOMERS_LIMIT).toArray()
}

router.post('/search', async (req, res, next) => {
  const searchRequest = await sendAtlasSearchRequest(req.body);
  console.log(searchRequest.result);
  res.render(
      'index', {
        searchResult : searchRequest.result,
        mongoAggregation: searchRequest.mongoAggregation,
        searchForm: req.body
      }
  );
});

const sendAtlasSearchRequest = async(searchFormParams) => {
  const mongoCollection = await getMongoCollection();

  const postalCodeQuery = searchFormParams.postalCode ? {
    text: {
      query: searchFormParams.postalCode.trim(),
      path: 'postalCodes',
      fuzzy: {
        maxEdits: 2,
        prefixLength: 2
      }
    }
  } : undefined;

  const phoneNumberQuery = searchFormParams.phoneNumber ? {
    text: {
      query: searchFormParams.phoneNumber.trim(),
      path: 'phoneNumbers',
      fuzzy: {
        maxEdits: 2
      }
    }
  } : undefined;

  const searchPipeline = {
    index: SEARCH_INDEX_NAME,
    compound: {
      must: [
        getQueryForPath('identity.firstName', searchFormParams.firstName?.trim()),
        getQueryForPath('identity.lastName', searchFormParams.lastName?.trim()),
        getQueryForPath('email', searchFormParams.email?.trim()),
        getQueryForPath('addresses.city', searchFormParams.city?.trim()),
        //getQueryForPath('phoneNumbers', searchFormParams.phoneNumber?.trim()),
        //getQueryForPath('addresses.postalCode', searchFormParams.postalCode?.trim()),
        phoneNumberQuery,
        postalCodeQuery
      ].filter( query => { return !!query })
    },
    highlight: {
      path: ['postalCodes', 'identity.firstName', 'identity.lastName']
    }
  }
  if(searchPipeline.compound.must.length === 0) { return getAllCustomers() }

  const mongoAggregation = [
    { $search: searchPipeline },
    { $limit: DEFAULT_CUSTOMERS_LIMIT },
    { $set: { score: { $meta: 'searchScore' }, highlights: { "$meta": 'searchHighlights' }} }
  ]

  console.log(searchPipeline.compound.must)
  return {
    mongoAggregation,
    result: await mongoCollection.aggregate(mongoAggregation).toArray()
  }
}

/**
 * Return 'must' query for search pipeline
 * @param {string} path
 * @param {string} value
 * @return {{text: {path: *, query: *}}}
 */
const getQueryForPath = (path, value) => {
  if(!value) { return undefined }
  return {
    text: {
      query: value,
      path,
    }
  }
}

module.exports = router;
