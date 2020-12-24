class Renderer {
   /* CONSTANTS */
   EMPTY = '';
   UPDATE_INTERVAL = 0.1 * 1000;

   /* QUERY SELECTORS */
   CLS = '.';
   ID = '#';

   /* CLASSES */
   ANSWER_CLS = 'answer';
   ANSWERED_CLS = 'answered';
   ANSWERED_LABEL_CLS = 'answered-label';
   ANSWERS_CLS = 'answers';
   BASIC_CLS = 'basic-config';
   BUTTON_CLS = 'button';
   CARD_CLS = 'card';
   CORRECT_CLS = 'correct';
   CORRECT_LABEL_CLS = 'correct-label';
   DETAILS_CLS = 'details';
   DIALOG_CLS = 'dialog';
   END_CLS = 'end';
   ERROR_CLS = 'error';
   EXTENDED_CLS = 'extended-config';
   GAMEOVER_CLS = 'gameover';
   INPUT_CLS = 'input';
   MENU_CLS = 'menu';
   OPTIONS_CLS = 'options';
   OPTIONS_BUTTONS_CLS = 'options-buttons';
   RADIO_CLS = 'radio';
   RESET_CLS = 'reset';
   QUESTION_CLS = 'question';
   START_CLS = 'start';
   TIMER_CLS = 'timer';

   /* IDS */
   AMOUNT_ID = 'amount';
   CATEGORIES_ID = 'categories';
   TIMED_ID = 'timed';

   /* TAGS */
   FORM_TAG = 'form';
   MAIN_TAG = 'main';

   /* QUERY SELECTORS - CLASS */
   ANSWER_QS = this.CLS.concat(this.ANSWER_CLS);
   ANSWERED_QS = this.CLS.concat(this.ANSWERED_CLS);
   ANSWERED_LABEL_QS = this.CLS.concat(this.ANSWERED_LABEL_CLS);
   ANSWERS_QS = this.CLS.concat(this.ANSWERS_CLS);
   BASIC_QS = this.CLS.concat(this.BASIC_CLS);
   BUTTON_QS = this.CLS.concat(this.BUTTON_CLS);
   CARD_QS = this.CLS.concat(this.CARD_CLS);
   CORRECT_QS = this.CLS.concat(this.CORRECT_CLS);
   CORRECT_LABEL_QS = this.CLS.concat(this.CORRECT_LABEL_CLS);
   DIALOG_QS = this.CLS.concat(this.DIALOG_CLS);
   DETAILS_QS = this.CLS.concat(this.DETAILS_CLS);
   END_QS = this.CLS.concat(this.END_CLS);
   ERROR_QS = this.CLS.concat(this.ERROR_CLS);
   EXTENDED_QS = this.CLS.concat(this.EXTENDED_CLS);
   GAMEOVER_QS = this.CLS.concat(this.GAMEOVER_CLS);
   INPUT_QS = this.CLS.concat(this.INPUT_CLS);
   MENU_QS = this.CLS.concat(this.MENU_CLS);
   OPTIONS_QS = this.CLS.concat(this.OPTIONS_CLS);
   OPTIONS_BUTTONS_QS = this.CLS.concat(this.OPTIONS_BUTTONS_CLS);
   RADIO_QS = this.CLS.concat(this.RADIO_CLS);
   RESET_QS = this.CLS.concat(this.RESET_CLS);
   QUESTION_QS = this.CLS.concat(this.QUESTION_CLS);
   START_QS = this.CLS.concat(this.START_CLS);
   TIMER_QS = this.CLS.concat(this.TIMER_CLS);

   /* QUERY SELECTORS - ID */
   AMOUNT_QS = this.ID.concat(this.AMOUNT_ID);
   CATEGORIES_QS = this.ID.concat(this.CATEGORIES_ID);
   TIMED_QS = this.ID.concat(this.TIMED_ID);

   /* QUERY SELECTORS - TAG */
   FORM_DIALOG_QS = this.FORM_TAG + this.CLS + this.DIALOG_CLS;
   /* END QUERY SELECTORS */

   /* FUNCTIONS */
   getTypeString = type => {
      return type === 'boolean' ? 'True / False' : 'Multiple choice';
   };

   hideOptions = () => {
      document.querySelector(this.OPTIONS_QS).style.display = 'none';
   };

   renderCard = (question, answers) => {
      this.resetCard();

      const p = document.createElement('p');
      p.classList.add(this.QUESTION_CLS);
      p.textContent = question;

      const section = document.createElement('section');
      section.classList.add(this.ANSWERS_CLS);

      answers.forEach(answer => {
         const button = document.createElement('button');

         button.classList.add(this.ANSWER_CLS);
         button.classList.add(this.BUTTON_CLS);
         button.textContent = answer;

         section.appendChild(button);
      });

      const card = document.createElement('section');
      card.classList.add(this.CARD_CLS);
      card.appendChild(p);
      card.appendChild(section);

      document.querySelector(this.MAIN_TAG).appendChild(card);

      this.startTimer();
   };

   renderDetails = questions => {
      const basic = this.category ? this.category : 'Mixed category';
      let extended = `${questions} questions`;

      extended = this.level
         ? `${extended}, ${this.level} difficulty`
         : extended;
      extended = this.type ? `${extended}, ${this.type} only` : extended;
      extended = this.timed ? `${extended}, Timed scoring` : extended;

      document.querySelector(this.BASIC_QS).textContent = basic;
      document.querySelector(this.EXTENDED_QS).textContent = extended;

      document.querySelector(this.CORRECT_LABEL_QS).textContent = 'correct:';
      document.querySelector(this.ANSWERED_LABEL_QS).textContent = 'answered:';

      document.querySelector(this.DETAILS_QS).style.visibility = 'visible';
   };

   renderError = () => {
      document.querySelector(this.ERROR_QS).style.display = 'flex';
   };

   renderGameover = (score, total, timed) => {
      const gameover = document.querySelector(this.GAMEOVER_QS);

      gameover.appendChild(
         document.createTextNode(
            `You scored ${score}${timed ? '%' : ''} out of ${total}${
               timed ? '%' : ''
            }!`
         )
      );

      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createTextNode('Play again?'));

      document.querySelector(this.END_QS).style.display = 'flex';
   };

   renderScore = (score = 0, answered = 0) => {
      document.querySelector(this.CORRECT_QS).textContent = score;
      document.querySelector(this.ANSWERED_QS).textContent = answered;
   };

   reset = () => {
      this.resetTimer();
      this.resetDetails();
      this.resetScore();
      this.resetCard();
      this.resetModals();
   };

   resetCard = () => {
      const card = document.querySelector(this.CARD_QS);
      if (card) {
         document.querySelector(this.MAIN_TAG).removeChild(card);
      }
   };

   resetCategories = () => {
      document.querySelector(this.CATEGORIES_QS).firstChild.selected = true;
   };

   resetDetails = () => {
      document.querySelector(this.DETAILS_QS).style.visibility = 'hidden';

      document.querySelector(this.BASIC_QS).textContent = this.EMPTY;
      document.querySelector(this.EXTENDED_QS).textContent = this.EMPTY;

      document.querySelector(this.CORRECT_LABEL_QS).textContent = this.EMPTY;
      document.querySelector(this.ANSWERED_LABEL_QS).textContent = this.EMPTY;
   };

   resetModals = () => {
      document.querySelector(this.END_QS).style.display = 'none';
      document.querySelector(this.GAMEOVER_QS).textContent = this.EMPTY;

      document.querySelector(this.ERROR_QS).style.display = 'none';
   };

   resetOptions = () => {
      this.resetCategories();
      this.category = null;

      for (parent of document.querySelectorAll(this.RADIO_QS)) {
         parent.children[0].checked = false;
      }
      this.level = null;
      this.type = null;
      this.timed = false;

      document.querySelector(this.AMOUNT_QS).value = this.EMPTY;
      document.querySelector(this.TIMED_QS).checked = false;
   };

   resetScore = () => {
      document.querySelector(this.CORRECT_QS).textContent = this.EMPTY;
      document.querySelector(this.ANSWERED_QS).textContent = this.EMPTY;
   };

   resetTimer = () => {
      clearInterval(this.timer);

      const timer = document.querySelector(this.TIMER_QS);
      timer.style.visibility = 'hidden';
      timer.style.width = '100%';
   };

   setAmount = (min, max) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      const id = this.AMOUNT_ID;

      label.setAttribute('for', id);
      label.textContent = 'NUMBER (10 - 50)';

      input.type = 'number';
      input.id = id;
      input.name = id;
      input.classList.add(this.INPUT_CLS);
      input.min = min;
      input.max = max;
      input.placeholder = 10;

      const section = document.createElement('section');
      section.classList.add(id);
      section.appendChild(label);
      section.appendChild(input);

      document.querySelector(this.FORM_DIALOG_QS).appendChild(section);
   };

   // TODO - Callback to game here so we avoid two loops in script.js
   // TODO - We can keep track of how many questions we can still serve
   setCategories = (categories, setCategoryCount) => {
      // A quick and easy way to have placeholder text for the dropdown menu
      // https://stackoverflow.com/a/30525521/1987724
      let option = document.createElement('option');

      option.selected = true;
      option.disabled = true;
      option.hidden = true;
      option.value = -1;
      option.textContent = 'Please select a category';

      const select = document.querySelector(this.CATEGORIES_QS);
      select.appendChild(option);

      categories.forEach(category => {
         // set our question count in the game object with this callback
         setCategoryCount(category.id);

         option = document.createElement('option');

         option.value = category.id;
         option.textContent = category.name;

         select.appendChild(option);
      });
   };

   setCategoryConfig = category => (this.category = category);

   setLevelConfig = level => (this.level = this.toTitleCase(level));

   setLevels = levels => {
      const legend = document.createElement('legend');
      legend.textContent = 'DIFFICULTY';

      const fieldset = document.createElement('fieldset');
      fieldset.appendChild(legend);

      levels.forEach(level => {
         const radio = document.createElement('input');
         const label = document.createElement('label');

         radio.type = 'radio';
         radio.name = 'level';
         radio.id = level;
         radio.classList.add(this.INPUT_CLS);

         label.setAttribute('for', level);
         label.textContent = this.toTitleCase(level);

         const section = document.createElement('section');
         section.classList.add(this.RADIO_CLS);
         section.appendChild(radio);
         section.appendChild(label);

         fieldset.appendChild(section);
      });

      document.querySelector(this.FORM_DIALOG_QS).appendChild(fieldset);
   };

   setOptionsButtons = () => {
      const reset = document.createElement('button');

      const start = document.createElement('button');
      const type = 'button';

      reset.type = type;
      reset.classList.add(this.RESET_CLS);
      reset.classList.add(this.MENU_CLS);
      reset.classList.add(this.BUTTON_CLS);
      reset.textContent = 'RESET';

      start.type = type;
      start.classList.add(this.START_CLS);
      start.classList.add(this.MENU_CLS);
      start.classList.add(this.BUTTON_CLS);
      start.textContent = 'START GAME';

      const section = document.createElement('section');
      section.classList.add(this.OPTIONS_BUTTONS_CLS);
      section.appendChild(reset);
      section.appendChild(start);

      document.querySelector(this.FORM_DIALOG_QS).appendChild(section);
   };

   setTimed = () => {
      const input = document.createElement('input');
      const label = document.createElement('label');
      const id = this.TIMED_ID;

      input.type = 'checkbox';
      input.id = id;
      input.name = id;
      input.classList.add(this.INPUT_CLS);

      label.setAttribute('for', id);
      label.textContent = id.toUpperCase();

      const section = document.createElement('section');
      section.classList.add(id);
      section.appendChild(input);
      section.appendChild(label);

      document.querySelector(this.FORM_DIALOG_QS).appendChild(section);
   };

   setTimedConfig = timed => (this.timed = timed);

   setTypeConfig = type => (this.type = this.getTypeString(type));

   setTypes = types => {
      const legend = document.createElement('legend');
      legend.textContent = 'TYPE';

      const fieldset = document.createElement('fieldset');
      fieldset.appendChild(legend);

      types.forEach(type => {
         const radio = document.createElement('input');
         const label = document.createElement('label');
         const text = this.getTypeString(type);

         radio.type = 'radio';
         radio.name = 'type';
         radio.id = type;
         radio.classList.add(this.INPUT_CLS);

         label.setAttribute('for', type);
         label.textContent = text;

         const section = document.createElement('section');
         section.classList.add(this.RADIO_CLS);
         section.appendChild(radio);
         section.appendChild(label);

         fieldset.appendChild(section);
      });

      document.querySelector(this.FORM_DIALOG_QS).appendChild(fieldset);
   };

   showOptions = () => {
      document.querySelector(this.OPTIONS_QS).style.display = 'flex';
   };

   startTimer = () => {
      this.startTime = performance.now();
      this.remaining = 300;

      this.timer = setInterval(() => {
         document.querySelector(this.TIMER_QS).style.width = `${
            --this.remaining / 3
         }%`;
      }, this.UPDATE_INTERVAL);

      document.querySelector(this.TIMER_QS).style.visibility = 'visible';
   };

   stopTimer = () => {
      this.endTime = performance.now();
      this.resetTimer();

      return Math.floor((this.endTime - this.startTime) / 1000);
   };

   toTitleCase = string => {
      return string
         .split(' ')
         .map(word => word[0].toUpperCase().concat(word.substring(1)))
         .join(' ');
   };
}

export default Renderer;
