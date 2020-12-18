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
      this.reset();
   }

   reset = () => {
      this.index = 0;
      this.score = 0;
      this.questions = null;
   };

   currentQAPair = () => this.questions[this.index];

   currentQuestion = () => this.currentQAPair().question;

   correctAnswer = () => this.currentQAPair().correct_answer;

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

      const answers = [this.correctAnswer()].concat(
         this.currentQAPair().incorrect_answers
      );

      return shuffle(answers);
   };

   nextQuestion = () => this.index++;

   incrementScore = () => this.score++;

   totalQuestions = () => this.questions.length;

   setQuestions = questions => (this.questions = questions);

   isGameOver = () => this.index === this.totalQuestions();
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
      modal.style.display = 'none';
      wintext.textContent = EMPTY;
   };

   const renderQuestion = () => {
      resetCard();

      question.innerHTML = game.currentQuestion();
      game.currentAnswers().forEach(answer => {
         const button = document.createElement('button');
         button.classList.add('answer');
         button.classList.add('button');
         button.innerHTML = answer;
         answers.appendChild(button);
      });
   };

   const renderScore = () => {
      const score = document.querySelector('.score');
      score.textContent = `SCORE: ${game.score} / ${game.totalQuestions()}`;
   };

   const render = () => {
      renderScore();
      renderQuestion();
   };

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
            render();
         })
         .catch(error => console.log(error));
   }

   if (target.classList.contains('answer')) {
      const choice = target.textContent;
      if (choice === game.correctAnswer()) {
         game.incrementScore();
      }
      game.nextQuestion();

      if (game.isGameOver()) {
         wintext.innerHTML = `You scored ${
            game.score
         } out of ${game.totalQuestions()} questions!<br /><br />Play again?`;
         modal.style.display = 'flex';

         return;
      }

      render();
   }
});
