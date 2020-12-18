const api = {
   endpoint: 'https://opentdb.com/api.php?',
   response_codes: {
      success: 0, // success, returned questions successfully
      no_results: 1, // no results, not enough questions to fulfill request
      invalid: 2, // invalid, request arguments are invalid
      token_not_found: 3, // token not found, session token does not exist
      empty_token: 4 // empty token, session has exhausted all questions
   },
   category_list: 'https://opentdb.com/api_category.php',
   arguments: {
      amount: 'amount=',
      category: 'category=',
      encode: 'encode=',
      level: 'difficulty=',
      levels: ['easy', 'medium', 'hard'],
      type: 'type=',
      types: ['multiple', 'boolean'],
      token: 'token=',
      new_token: 'command=request'
   },
   defaults: {
      min_amount: 10,
      max_amount: 50,
      category: 9, // general category - TODO refactor this
      encode: 'url3986',
      level: 'easy',
      type: 'multiple'
   }
};

export default api;
