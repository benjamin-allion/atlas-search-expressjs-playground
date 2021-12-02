const express = require('express');
const router = express.Router();
const { getAtlasSearchResults, getAllCustomers } = require('../services/customerServices')

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

router.post('/search', async (req, res, next) => {
  const searchFormValues = req.body;
  const searchRequest = await getAtlasSearchResults(searchFormValues);
  console.log(searchRequest.result);
  res.render(
      'index', {
        searchResult : searchRequest.result,
        mongoAggregation: searchRequest.mongoAggregation,
        searchForm: searchFormValues
      }
  );
});

module.exports = router;
