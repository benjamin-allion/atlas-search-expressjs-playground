const express = require('express');
const router = express.Router();
const { getSearchResults, getGlobalSearchResults, getAllCustomers } = require('../services/customerServices')

/* GET home page. */
router.get('/', async (req, res, next) => {
  const searchRequest = await getAllCustomers();
  res.render(
      'index', {
          searchResult: searchRequest.result || [],
          mongoAggregation: 'No $search query to display.',
          globalSearchForm: {},
          searchForm: {}
      }
  );
});

router.post('/search', async (req, res, next) => {
  const searchFormValues = req.body;
  const searchRequest = await getSearchResults(searchFormValues);
  res.render(
      'index', {
          searchResult : searchRequest.result || [],
          mongoAggregation: searchRequest.mongoAggregation,
          globalSearchForm: {},
          searchForm: searchFormValues,
      }
  );
});

router.post('/global-search', async (req, res, next) => {
    const searchFormValue = req.body.globalSearchFormTerm;
    const searchRequest = await getGlobalSearchResults(searchFormValue);
    console.log(searchRequest.result);
    res.render(
        'index', {
            searchResult : searchRequest.result || [],
            mongoAggregation: searchRequest.mongoAggregation,
            globalSearchForm: {
                searchFormValue
            },
            searchForm: {},
        }
    );
});

module.exports = router;
