import Game from './modules/game.js';
import Renderer from './modules/renderer.js';
import api from './modules/api.js';

const game = new Game();
const renderer = new Renderer();

const reset = () => {
   const and = '&';
   const defaultUrl =
      api.endpoint +
      api.arguments.amount +
      api.defaults.amount +
      and +
      api.arguments.encode +
      api.defaults.encode;

   game.reset();
   renderer.reset();

   // console.log(defaultUrl); // TODO - remove console.log
   fetch(defaultUrl)
      .then(response => {
         return response.json();
      })
      .then(data => {
         if (data.response_code === api.response_codes.success) {
            game.setQuestions(data.results);

            renderer.renderDetails(game.totalQuestions());
            renderer.renderQuestion(
               game.currentQuestionString(),
               game.currentAnswers()
            );
         }
      })
      .catch(error => console.log(error));
};

const processAnswer = answer => {
   game.processAnswer(answer);
   game.nextQuestion();
   renderer.renderScore(game.score, game.index);

   if (game.isGameOver()) {
      renderer.renderWin(game.score, game.totalQuestions());

      return;
   }

   renderer.renderQuestion(game.currentQuestionString(), game.currentAnswers());
};

document.body.addEventListener('click', event => {
   event.preventDefault();
   const target = event.target;

   if (target.classList.contains('reset')) {
      reset();
   }

   if (target.classList.contains('answer')) {
      processAnswer(target.textContent);
   }
});

document
   .querySelector('details')
   .addEventListener('click', renderer.toggleDetails);
