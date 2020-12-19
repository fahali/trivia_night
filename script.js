import Game from './modules/game.js';
import Renderer from './modules/renderer.js';
import api from './modules/api.js';

const game = new Game();
const renderer = new Renderer();

const reset = () => {
   game.reset();
   renderer.reset();
};

const start = url => {
   fetch(url)
      .then(response => {
         return response.json();
      })
      .then(data => {
         if (data.response_code === api.response_codes.success) {
            game.setQuestions(data.results);

            renderer.renderDetails(game.totalQuestions());
            renderer.renderScore();
            renderer.renderQuestion(game.getQuestion(), game.getAllAnswers());
         }
      })
      .catch(error => console.log(error));
};

const formURL = () => {
   const and = '&';
   let url = api.endpoint + api.arguments.encode + api.defaults.encode;

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

   return url;
};

const processAnswer = answer => {
   game.processAnswer(answer);
   game.nextQuestion();
   renderer.renderScore(game.score, game.index);

   if (game.isGameOver()) {
      renderer.renderGameover(game.score, game.totalQuestions());

      return;
   }

   renderer.renderQuestion(game.getQuestion(), game.getAllAnswers());
};

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

const buildForm = () => {
   setCategories();
   renderer.setLevels(api.arguments.levels);
   renderer.setTypes(api.arguments.types);
   renderer.setAmount(api.defaults.min_amount, api.defaults.max_amount);
   renderer.setOptionsButtons();
};

document.body.addEventListener('click', event => {
   const target = event.target;

   if (target.classList.contains('new')) {
      reset();
      renderer.showOptions();
   }

   if (target.classList.contains('start')) {
      renderer.hideOptions();
      start(formURL());
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

buildForm();
