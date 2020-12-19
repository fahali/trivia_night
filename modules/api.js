const api = {
   category_count: 'https://opentdb.com/api_count.php?',
   category_list: 'https://opentdb.com/api_category.php',
   global_count: 'https://opentdb.com/api_count_global.php',
   questions: 'https://opentdb.com/api.php?',
   session: 'https://opentdb.com/api_token.php?command=',

   arguments: {
      amount: 'amount=',
      category: 'category=',
      encode: 'encode=',
      level: 'difficulty=',
      levels: ['easy', 'medium', 'hard'],
      request: 'request',
      reset: 'reset',
      token: 'token=',
      type: 'type=',
      types: ['multiple', 'boolean']
   },

   defaults: {
      min_amount: 10,
      max_amount: 50,
      encode: 'url3986'
   },

   response_codes: {
      success: 0, // success, returned questions successfully
      no_results: 1, // no results, not enough questions to fulfill request
      invalid: 2, // invalid, request arguments are invalid
      token_not_found: 3, // token not found, session token does not exist
      token_empty: 4 // session has exhausted all questions
   }
};

export default api;
