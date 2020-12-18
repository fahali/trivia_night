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
      encode: 'encode=',
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
      encode: 'base64',
      category: 9, // general category - TODO refactor this
      level: 'easy',
      type: 'multiple'
   }
};

class Game {
   constructor() {
      this.reset();
   }

   reset = () => {
      this.index = 0;
      this.score = 0;
      this.questions = null;
   };

   currentQuestion = () => this.questions[this.index];

   currentQuestionString = () => this.currentQuestion().question_string;

   correctAnswerString = () => this.currentQuestion().correct_string;

   currentAnswers = () => {
      // Fisher - Yates shuffle algorithm written in Javascript
      // https://stackoverflow.com/a/6274381
      const shuffle = array => {
         for (let i = array.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1));
            const item = array[i];
            array[i] = array[random];
            array[random] = item;
         }
         return array;
      };

      // const answers = [this.correctAnswerString()].concat(
      //    this.currentQuestion().incorrect_strings
      // );

      return this.currentQuestion().boolean
         ? ['True', 'False']
         : shuffle(
              [this.correctAnswerString()].concat(
                 this.currentQuestion().incorrect_strings
              )
           );
      // return answers.length > 2 ? shuffle(answers) : answers;
   };

   nextQuestion = () => this.index++;

   incrementScore = () => this.score++;

   totalQuestions = () => this.questions.length;

   setQuestions = questions => {
      this.questions = questions.map(question => {
         question.question_string = atob(question.question);
         question.correct_string = atob(question.correct_answer);
         question.incorrect_strings = question.incorrect_answers.map(answer => {
            return atob(answer);
         });
         question.boolean = atob(question.type) === 'boolean' ? true : false;
         return question;
      });
   };

   isGameOver = () => this.index === this.totalQuestions();
}

const game = new Game();

const EMPTY = '';

const question = document.querySelector('.question');
const answers = document.querySelector('.answers');

const modal = document.querySelector('.modal');
const wintext = document.querySelector('.wintext');

const resetCard = () => {
   question.textContent = EMPTY;
   answers.textContent = EMPTY;
};

const resetGame = () => {
   game.reset();
   resetCard();
   renderScore();
   modal.style.display = 'none';
   wintext.textContent = EMPTY;
};

const renderWin = () => {
   wintext.appendChild(
      document.createTextNode(
         `You scored ${game.score} out of ${game.totalQuestions()} questions!`
      )
   );
   wintext.appendChild(document.createElement('br'));
   wintext.appendChild(document.createElement('br'));
   wintext.appendChild(document.createTextNode(`Play again?`));
   modal.style.display = 'flex';
};

const renderQuestion = () => {
   resetCard();

   question.textContent = game.currentQuestionString();

   // console.log(game.currentAnswers()); // TODO - remove console.log

   game.currentAnswers().forEach(answer => {
      const button = document.createElement('button');
      button.classList.add('answer');
      button.classList.add('button');
      button.textContent = answer;
      answers.appendChild(button);
   });
};

const renderScore = () => {
   const score = document.querySelector('.score');
   score.textContent = `SCORE: ${game.score}`;
};

const render = () => {
   renderScore();
   renderQuestion();
};

document.body.addEventListener('click', event => {
   event.preventDefault();
   const target = event.target;

   const and = '&';
   const defaultUrl =
      api.endpoint +
      api.arguments.amount +
      api.defaults.amount +
      and +
      api.arguments.encode +
      api.defaults.encode;

   if (target.classList.contains('reset')) {
      resetGame();

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
            // console.log(game.questions); // TODO - remove console.log
            renderQuestion();
         })
         .catch(error => console.log(error));
   }

   if (target.classList.contains('answer')) {
      const choice = target.textContent;
      if (choice === game.correctAnswerString()) {
         game.incrementScore();
      }
      game.nextQuestion();
      renderScore();

      if (game.isGameOver()) {
         renderWin();

         return;
      }

      renderQuestion();
   }
});
