const api = {
   endpoint: 'https://opentdb.com/api.php?',
   response_codes: {
      success: 0, // success, returned questions successfully
      no_results: 1, // no results, not enough questions to fulfill request
      invalid: 2, // invalid, request arguments are invalid
      token_not_found: 3, // token not found, session token does not exist
      empty_token: 4 // empty token, session token has exhausted all possible questions
   },
   category_list: 'https://opentdb.com/api_category.php',
   arguments: {
      amount: 'amount=',
      category: 'category=',
      level: 'difficulty=',
      levels: {
         easy: 'easy',
         medium: 'medium',
         hard: 'hard'
      },
      type: 'type=',
      types: {
         multiple: 'multiple', // multiple choice questions
         boolean: 'boolean' // true / false questions
      },
      token: 'token=',
      new_token: 'command=request'
   },
   defaults: {
      amount: 10,
      max_amount: 50,
      category: 9, // general category - TODO refactor this
      level: 'easy',
      type: 'multiple'
   }
};

class Game {
   constructor() {
      this.index = 0;
   }

   currentQAPair = () => this.questions[this.index];

   currentQuestion = () => this.currentQAPair().question;

   currentAnswers = () => {
      return [this.currentQAPair().correct_answer].concat(
         this.currentQAPair().incorrect_answers
      );
   };

   nextQuestion = () => this.index++;

   setQuestions = questions => (this.questions = questions);
}

const game = new Game();

document.body.addEventListener('click', event => {
   event.preventDefault();
   const target = event.target;

   const and = '&';
   const defaultUrl =
      api.endpoint +
      api.arguments.category +
      api.defaults.category +
      and +
      api.arguments.type +
      api.defaults.type +
      and +
      api.arguments.level +
      api.defaults.level +
      and +
      api.arguments.amount +
      api.defaults.amount;

   const question = document.querySelector('.question');
   const answers = document.querySelector('.answers');

   const renderQuestion = () => {
      question.textContent = game.currentQuestion();
      game.currentAnswers().forEach(answer => {
         const button = document.createElement('button');
         button.textContent = answer;
         answers.appendChild(button);
      });
   };

   if (target.classList.contains('new-game')) {
      // console.log(defaultUrl); // TODO - remove console.log
      fetch(defaultUrl)
         .then(response => {
            // console.log(response); // TODO - remove console.log
            return response.json();
         })
         .then(data => {
            // console.log(data); // TODO - remove console.log
            if (data.response_code === api.response_codes.success) {
               game.setQuestions(data.results);
            }
            renderQuestion();
            // console.log(game.questions); // TODO - remove console.log
         })
         .catch(error => console.log(error));
   }
});
