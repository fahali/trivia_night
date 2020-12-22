import Game from './modules/game.js';
import Renderer from './modules/renderer.js';
import api from './modules/api.js';

const game = new Game();
const renderer = new Renderer();
const storage = window.localStorage;

const formCategoryCountURL = category => {
   return api.category_count + api.arguments.category + category;
};

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
   const time = renderer.stopTimer();
   game.processAnswer(answer, time);
   game.nextQuestion();
   renderGame();
};

const renderGame = () => {
   renderer.renderScore(game.score, game.index);

   if (game.isGameOver()) {
      renderer.renderGameover(
         game.getFinalScore(),
         game.getTotalScore(),
         game.timed
      );

      return;
   }

   renderer.renderCard(game.getQuestion(), game.getAllAnswers());
};

const requestToken = async url => {
   try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.response_code === api.response_codes.success) {
         game.token = data.token;
         storage.token = data.token;
      }
   } catch (error) {
      return console.log(error);
   }
};

const reset = () => {
   game.reset();
   renderer.reset();
};

const start = async url => {
   try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log(data);

      // RESPONSE 0 - SUCCESS
      if (data.response_code === api.response_codes.success) {
         game.setQuestions(data.results);
         renderer.renderDetails(game.getTotalQuestions());
         renderGame();
      }

      // RESPONSE 1 - NO RESULTS
      // Because we use tokens, we just get served RESPONSE CODE 4

      // RESPONSE 2 - INVALID PARAMETER
      // Because we handle API calls, we will never get this

      // RESPONSE 3 - TOKEN NOT FOUND
      // For when the session token expires after 6 hours
      else if (data.response_code === api.response_codes.token_not_found) {
         game.token = null;
         startWithToken();
      }

      // RESPONSE 4 - TOKEN EMPTY
      // For when the number of requested questions exceeds the number of
      // available questions
      else if (data.response_code === api.response_codes.token_empty) {
         // TODO - alert user they finished all questions
         startWithToken();
      }
   } catch (error) {
      return console.log(error);
   }
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

const checkSession = () => {
   const now = Date.now();
   const lastTime = storage.visitTime;
   if (lastTime) {
      const ms = 1000;
      const sec = 60;
      const min = 60;
      const elapsed = (now - lastTime) / (ms * sec * min);
      console.log(`since last visit: ${elapsed.toFixed(2)} hours`);

      if (elapsed < 6 && storage.token) {
         game.token = storage.token;
      }

      if (elapsed >= 6) {
         console.log(`should only be here when elapsed is >= 6`);
         storage.visitTime = now;
      }
   } else {
      storage.visitTime = now;
   }
};

const setCategoryCount = async url => {
   try {
      const response = await fetch(url);
      const data = await response.json();

      const category = {
         total: data.category_question_count.total_question_count,
         easy: data.category_question_count.total_easy_question_count,
         medium: data.category_question_count.total_medium_question_count,
         hard: data.category_question_count.total_hard_question_count
      };

      game.setCategoryCount(data.category_id.toString(), category);
   } catch (error) {
      console.log(error);
   }
};

(async () => {
   checkSession();

   // HTML building that we want to happen right away
   try {
      const response = await fetch(api.category_list);
      const data = await response.json();

      data.trivia_categories.forEach(category =>
         setCategoryCount(formCategoryCountURL(category.id))
      );

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
