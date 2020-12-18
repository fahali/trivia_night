import Game from './modules/game.js';
import Renderer from './modules/renderer.js';
import api from './modules/api.js';

const game = new Game();
const renderer = new Renderer();

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
      game.reset();
      renderer.reset();

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

               renderer.renderQuestion(
                  game.currentQuestionString(),
                  game.currentAnswers()
               );
            }
            // console.log(game.questions); // TODO - remove console.log
         })
         .catch(error => console.log(error));
   }

   if (target.classList.contains('answer')) {
      game.processAnswer(target.textContent);
      game.nextQuestion();
      renderer.renderScore(game.score);

      if (game.isGameOver()) {
         renderer.renderWin(game.score, game.totalQuestions());

         return;
      }

      renderer.renderQuestion(
         game.currentQuestionString(),
         game.currentAnswers()
      );
   }
});
