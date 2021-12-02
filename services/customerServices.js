const { getMongoCollection } = require('./mongoServices')

const DEFAULT_CUSTOMERS_LIMIT = 30;
const SEARCH_INDEX_NAME = 'default'

/**
 * Return customers from database without doing any search request
 */
const getAllCustomers = async() => {
    const mongoCollection = await getMongoCollection();
    return mongoCollection.find({}).limit(DEFAULT_CUSTOMERS_LIMIT).toArray()
}

/**
 * Search customers from specified 'searchFormParams'
 * @param {{postalCode: string, phoneNumber: string, firstName: string, lastName: string, city: string, email: string }} searchFormValues
 * @returns {Promise<{result: *, mongoAggregation: [{$search: {highlight: {path: string[]}, index: string, compound: {must: ({text: {path: *, query: *}}|{text: {path: string, query: string, fuzzy: {maxEdits: number}}})[]}}}, {$limit: number}, {$set: {score: {$meta: string}, highlights: {$meta: string}}}]}|*>}
 */
const getAtlasSearchResults = async(searchFormValues) => {
    const mongoCollection = await getMongoCollection();
    const searchPipeline = getSearchPipelineFromSearchForm(searchFormValues);

    const isSearchFormEmpty = (searchPipeline.compound.must.length === 0)
    if(isSearchFormEmpty) { return getAllCustomers() }

    const mongoAggregation = [
        { $search: searchPipeline },
        { $limit: DEFAULT_CUSTOMERS_LIMIT }
    ]

    console.log(searchPipeline.compound.must) // Debug line
    return {
        mongoAggregation,
        result: await mongoCollection.aggregate(mongoAggregation).toArray()
    }
}

/**
 * Return Mongo $search pipeline from search form values
 * @param {{postalCode: string, phoneNumber: string, firstName: string, lastName: string, city: string, email: string }} searchFormValues
 * @returns {{highlight: {path: string[]}, index: string, compound: {must: {text: {path: *, query: *}}[]}}}
 */
const getSearchPipelineFromSearchForm = (searchFormValues) => {
    return {
        index: SEARCH_INDEX_NAME,
        compound: {
            must: [
                getQueryForPath('firstName', searchFormValues.firstName?.trim()),
                getQueryForPath('lastName', searchFormValues.lastName?.trim()),
                getQueryForPath('email', searchFormValues.email?.trim()),
                getQueryForPath('addresses.city', searchFormValues.city?.trim()),
                getQueryForPath('phoneNumbers', searchFormValues.phoneNumber?.trim()),
                getQueryForPath('addresses.postalCode', searchFormValues.postalCode?.trim())
            ].filter( query => { return !!query })
        },
        highlight: {
            path: ['postalCodes', 'firstName', 'lastName']
        }
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

module.exports = {
    getAtlasSearchResults,
    getAllCustomers
}
