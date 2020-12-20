class Renderer {
   /* CONSTANTS */
   UPDATE_INTERVAL = 100;
   EMPTY = '';

   /* QUERY SELECTORS */
   AMOUNT_QS = '#amount';
   ANSWER_QS = 'answer';
   ANSWERED_QS = '.answered';
   ANSWEREDL_QS = '.answered-label';
   ANSWERS_QS = '.answers';
   BASIC_QS = '.basic-config';
   BUTTON_QS = 'button';
   CATEGORIES_QS = '#categories';
   CORRECT_QS = '.correct';
   CORRECTL_QS = '.correct-label';
   DETAILS_QS = 'details';
   END_QS = '.end';
   EXTENDED_QS = '.extended-config';
   FORM_DIALOG_QS = 'form.dialog';
   GAMEOVER_QS = '.gameover';
   MENU_QS = 'menu';
   OPTIONS_QS = '.options';
   OPTIONS_BUTTONS_QS = 'options-buttons';
   RADIO_QS = '.radio';
   QUESTION_QS = '.question';
   START_QS = 'start';
   TIMED_QS = '#timed';
   TIMER_QS = '.timer';

   getTypeString = type => {
      return type === 'boolean' ? 'True / False' : 'Multiple choice';
   };

   hideOptions = () => {
      document.querySelector(this.OPTIONS_QS).style.display = 'none';
   };

   renderDetails = questions => {
      const basic = this.category ? this.category : 'Mixed category';
      let extended = `${questions} questions`;

      extended = this.level
         ? `${extended}, ${this.level} difficulty`
         : extended;
      extended = this.type ? `${extended}, ${this.type} only` : extended;

      document.querySelector(this.BASIC_QS).textContent = basic;
      document.querySelector(this.EXTENDED_QS).textContent = extended;

      document.querySelector(this.CORRECTL_QS).textContent = 'correct:';
      document.querySelector(this.ANSWEREDL_QS).textContent = 'answered:';

      document.querySelector(this.DETAILS_QS).style.visibility = 'visible';
   };

   renderGameover = (score, total) => {
      const gameover = document.querySelector(this.GAMEOVER_QS);

      gameover.appendChild(
         document.createTextNode(`You scored ${score} out of ${total}!`)
      );

      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createTextNode('Play again?'));

      document.querySelector(this.END_QS).style.display = 'flex';
   };

   renderQuestion = (question, answers) => {
      this.resetCard();

      document.querySelector(this.QUESTION_QS).textContent = question;

      answers.forEach(answer => {
         const button = document.createElement('button');

         button.classList.add(this.ANSWER_QS);
         button.classList.add(this.BUTTON_QS);
         button.textContent = answer;

         document.querySelector(this.ANSWERS_QS).appendChild(button);
      });

      this.startTimer();
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

      document.querySelector(this.END_QS).style.display = 'none';
      document.querySelector(this.GAMEOVER_QS).textContent = this.EMPTY;
   };

   resetCard = () => {
      document.querySelector(this.QUESTION_QS).textContent = this.EMPTY;
      document.querySelector(this.ANSWERS_QS).textContent = this.EMPTY;
   };

   resetCategories = () => {
      document.querySelector(this.CATEGORIES_QS).firstChild.selected = true;
   };

   resetDetails = () => {
      document.querySelector(this.DETAILS_QS).style.visibility = 'hidden';

      document.querySelector(this.BASIC_QS).textContent = this.EMPTY;
      document.querySelector(this.EXTENDED_QS).textContent = this.EMPTY;

      document.querySelector(this.CORRECTL_QS).textContent = this.EMPTY;
      document.querySelector(this.ANSWEREDL_QS).textContent = this.EMPTY;
   };

   resetOptions = () => {
      this.resetCategories();
      this.category = null;

      for (parent of document.querySelectorAll(this.RADIO_QS)) {
         parent.children[0].checked = false;
      }
      this.level = null;
      this.type = null;

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
      const id = 'amount'; // if this changes, change AMOUNT_QS as well

      label.setAttribute('for', id);
      label.textContent = 'NUMBER (10 - 50)';

      input.type = 'number';
      input.id = id;
      input.name = id;
      input.min = min;
      input.max = max;
      input.placeholder = 10;

      const section = document.createElement('section');
      section.classList.add(id);
      section.appendChild(label);
      section.appendChild(input);

      document.querySelector(this.FORM_DIALOG_QS).appendChild(section);
   };

   // TODO
   // As we make categories, we should also record them to the game object
   // perhaps with a callback
   // so we can keep track of how many questions we can still serve?
   // Might be unnecessary with response code 1
   setCategories = categories => {
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

         label.setAttribute('for', level);
         label.textContent = this.toTitleCase(level);

         const section = document.createElement('section');
         section.classList.add('radio'); // if this changes, change RADIO_QS
         section.appendChild(radio);
         section.appendChild(label);

         fieldset.appendChild(section);
      });

      document.querySelector(this.FORM_DIALOG_QS).appendChild(fieldset);
   };

   setOptionsButtons = () => {
      const reset = document.createElement('button');
      const rtype = 'reset';

      const start = document.createElement('button');
      const btype = 'button';

      reset.type = rtype;
      reset.classList.add(rtype);
      reset.classList.add(this.MENU_QS);
      reset.classList.add(btype);
      reset.textContent = 'RESET';

      start.type = btype;
      start.classList.add(this.START_QS);
      start.classList.add(this.MENU_QS);
      start.classList.add(btype);
      start.textContent = 'START GAME';

      const section = document.createElement('section');
      section.classList.add(this.OPTIONS_BUTTONS_QS);
      section.appendChild(reset);
      section.appendChild(start);

      document.querySelector(this.FORM_DIALOG_QS).appendChild(section);
   };

   setTimed = () => {
      const input = document.createElement('input');
      const label = document.createElement('label');
      const id = 'timed'; // if this changes, changed TIMED_QS

      input.type = 'checkbox';
      input.id = id;
      input.name = id;

      label.setAttribute('for', id);
      label.textContent = id.toUpperCase();

      const section = document.createElement('section');
      section.classList.add(id);
      section.appendChild(input);
      section.appendChild(label);

      document.querySelector(this.FORM_DIALOG_QS).appendChild(section);
   };

   startTimer = () => {
      this.startTime = performance.now();
      this.elapsedTime = 300;

      this.timer = setInterval(() => {
         document.querySelector(this.TIMER_QS).style.width = `${
            --this.elapsedTime / 3
         }%`;
      }, this.UPDATE_INTERVAL);

      document.querySelector(this.TIMER_QS).style.visibility = 'visible';
   };

   stopTimer = () => {
      this.endTime = performance.now();
      this.resetTimer();

      return Math.floor((this.endTime - this.startTime) / 1000);
   };

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

         label.setAttribute('for', type);
         label.textContent = text;

         const section = document.createElement('section');
         section.classList.add('radio'); // if this changes, change RADIO_QS
         section.appendChild(radio);
         section.appendChild(label);

         fieldset.appendChild(section);
      });

      document.querySelector(this.FORM_DIALOG_QS).appendChild(fieldset);
   };

   showOptions = () => {
      document.querySelector(this.OPTIONS_QS).style.display = 'flex';
   };

   toTitleCase = string => {
      return string
         .split(' ')
         .map(word => word[0].toUpperCase().concat(word.substring(1)))
         .join(' ');
   };
}

export default Renderer;
