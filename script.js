import Game from './modules/game.js';
import Renderer from './modules/renderer.js';
import api from './modules/api.js';

const game = new Game();
const renderer = new Renderer();

const formTokenURL = () => {
   return game.token === null
      ? api.session + api.arguments.request
      : api.session +
           api.arguments.reset +
           '&' +
           api.arguments.token +
           game.token;
};

const formQuestionsURL = () => {
   const and = '&';
   let url =
      api.questions +
      api.arguments.token +
      game.token +
      and +
      api.arguments.encode +
      api.defaults.encode;

   const category = document.querySelector('#categories').value;
   if (category > -1) {
      url += and + api.arguments.category + category;
   }

   const type = document.querySelector('input[name="type"]:checked');
   if (type) {
      url += and + api.arguments.type + type.id;
   }

   const level = document.querySelector('input[name="level"]:checked');
   if (level) {
      url += and + api.arguments.level + level.id;
   }

   let amount = document.querySelector('#amount').value;
   amount = amount === '' ? api.defaults.min_amount : amount;
   url += and + api.arguments.amount + amount;

   // console.log(url);
   return url;
};

const processAnswer = answer => {
   const time = renderer.stopTimer();
   game.processAnswer(answer, time);
   game.nextQuestion();
   renderGame();
};

const renderGame = () => {
   renderer.renderScore(game.score, game.index);

   if (game.isGameOver()) {
      renderer.renderGameover(game.getFinalScore(), game.getTotalScore());

      return;
   }

   renderer.renderQuestion(game.getQuestion(), game.getAllAnswers());
};

const requestToken = async url => {
   try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.response_code === api.response_codes.success) {
         game.token = data.token;
      }
   } catch (error) {
      return console.log(error);
   }
};

const reset = () => {
   game.reset();
   renderer.reset();
};

const start = url => {
   fetch(url)
      .then(response => response.json())
      .then(data => {
         // TODO - handle other response codes (failures)
         // console.log(data);
         // RESPONSE 0 - SUCCESS
         if (data.response_code === api.response_codes.success) {
            game.setQuestions(data.results);
            renderer.renderDetails(game.getTotalQuestions());
            renderGame();
         }
         // RESPONSE 1 - NO RESULTS
         else if (data.response_code === api.response_codes.no_results) {
            // for when there aren't enough questions to serve the request
         }
         // RESPONSE 3 - TOKEN NOT FOUND
         else if (data.response_code === api.response_codes.token_not_found) {
            // for when the session token expires after 6 hours
            game.token = null;
            startWithToken();
         }
         // RESPONSE 4 - SESSION TOKEN EXHAUSTED ALL QUESTIONS
         else if (data.response_code === api.response_codes.token_empty) {
            // TODO - alert user they finished all questions
            // reset the token in the background
            // then just start() as normal
            startWithToken();
         }
      })
      .catch(error => console.log(error));
};

const startWithToken = () => {
   requestToken(formTokenURL()).then(() => start(formQuestionsURL()));
};

document.body.addEventListener('click', event => {
   const target = event.target;

   if (target.classList.contains('new')) {
      reset();
      renderer.showOptions();
   }

   if (target.classList.contains('start')) {
      renderer.hideOptions();

      if (game.token === null) {
         startWithToken();
      } else {
         start(formQuestionsURL());
      }
   }

   if (target.classList.contains('answer')) {
      processAnswer(target.textContent);
   }

   if (target.tagName === 'OPTION') {
      renderer.setCategoryConfig(target.textContent);
   }

   if (target.name === 'level') {
      renderer.setLevelConfig(target.id);
   }

   if (target.name === 'type') {
      renderer.setTypeConfig(target.id);
   }

   if (target.name === 'timed') {
      game.timed = target.checked;
   }

   if (target.classList.contains('reset')) {
      event.preventDefault();
      renderer.resetOptions();
      game.timed = false;
   }
});

(async () => {
   try {
      const response = await fetch(api.category_list);
      const data = await response.json();
      renderer.setCategories(
         data.trivia_categories.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
         })
      );
   } catch (error) {
      console.log(error);
   }

   renderer.setLevels(api.arguments.levels);
   renderer.setTypes(api.arguments.types);
   renderer.setAmount(api.defaults.min_amount, api.defaults.max_amount);
   renderer.setTimed();
   renderer.setOptionsButtons();
})();
