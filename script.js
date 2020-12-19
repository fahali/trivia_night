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

   console.log(url);
   return url;
};

const processAnswer = answer => {
   game.processAnswer(answer);
   game.nextQuestion();
   renderGame();
};

const renderGame = () => {
   renderer.renderScore(game.score, game.index);

   if (game.isGameOver()) {
      renderer.renderGameover(game.score, game.totalQuestions());

      return;
   }

   renderer.renderQuestion(game.getQuestion(), game.getAllAnswers());
};

const requestToken = async url => {
   try {
      const response = await fetch(url);
      const data = await response.json();
      // TODO - handle other response codes (failures)
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

// TODO - this might need refactoring
// consider making it async?
const setCategories = () => {
   fetch(api.category_list)
      .then(response => response.json())
      .then(data => {
         renderer.setCategories(
            data.trivia_categories.sort((a, b) => {
               const nameA = a.name.toLowerCase();
               const nameB = b.name.toLowerCase();
               return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            })
         );
      })
      .catch(error => console.log(error));
};

const start = url => {
   fetch(url)
      .then(response => response.json())
      .then(data => {
         // TODO - handle other response codes (failures)
         console.log(data);
         // RESPONSE 0 - SUCCESS
         if (data.response_code === api.response_codes.success) {
            game.setQuestions(data.results);
            renderer.renderDetails(game.totalQuestions());
            renderGame();
         }
         // RESPONSE 4 - SESSION TOKEN EXHAUSTED ALL QUESTIONS
         else if (data.response_code === api.response_codes.token_empty) {
            // TODO - alert user they finished all questions
            // reset the token in the background
            // then just start() as normal
            startWithResetToken();
         }
      })
      .catch(error => console.log(error));
};

const startWithResetToken = () => {
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
         startWithResetToken();
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

   if (target.classList.contains('reset')) {
      event.preventDefault();
      renderer.resetOptions();
   }
});

const buildForm = () => {
   setCategories();
   renderer.setLevels(api.arguments.levels);
   renderer.setTypes(api.arguments.types);
   renderer.setAmount(api.defaults.min_amount, api.defaults.max_amount);
   renderer.setOptionsButtons();
};

buildForm();
