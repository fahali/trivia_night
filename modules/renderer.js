class Renderer {
   UPDATE_INTERVAL = 1000;

   getTypeString = type => {
      return type === 'boolean' ? 'True / False' : 'Multiple choice';
   };

   hideOptions = () => {
      document.querySelector('.options').style.display = 'none';
   };

   renderDetails = questions => {
      const basic = this.category ? this.category : 'Mixed category';
      let extended = `${questions} questions`;
      extended = this.level
         ? `${extended}, ${this.level} difficulty`
         : extended;
      extended = this.type ? `${extended}, ${this.type} only` : extended;

      document.querySelector('.basic-config').textContent = basic;
      document.querySelector('.extended-config').textContent = extended;

      document.querySelector('.correct-label').textContent = 'correct:';
      document.querySelector('.answered-label').textContent = 'answered:';

      document.querySelector('details').style.visibility = 'visible';
   };

   renderGameover = (score, total) => {
      const gameover = document.querySelector('.gameover');

      gameover.appendChild(
         document.createTextNode(`You scored ${score} out of ${total}!`)
      );

      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createTextNode('Play again?'));

      document.querySelector('.end').style.display = 'flex';
   };

   renderQuestion = (question, answers) => {
      this.resetCard();

      document.querySelector('.question').textContent = question;

      answers.forEach(answer => {
         const button = document.createElement('button');

         button.classList.add('answer');
         button.classList.add('button');
         button.textContent = answer;

         document.querySelector('.answers').appendChild(button);
      });

      this.startTimer();
   };

   renderScore = (score = 0, answered = 0) => {
      document.querySelector('.correct').textContent = score;
      document.querySelector('.answered').textContent = answered;
   };

   renderTime = () => {
      // console.log('render');
   };

   reset = () => {
      this.resetDetails();
      this.resetScore();
      this.resetCard();

      document.querySelector('.end').style.display = 'none';
      document.querySelector('.gameover').textContent = '';
   };

   resetCard = () => {
      document.querySelector('.question').textContent = '';
      document.querySelector('.answers').textContent = '';
   };

   resetCategories = () => {
      document.querySelector('#categories').firstChild.selected = true;
   };

   resetDetails = () => {
      document.querySelector('details').style.visibility = 'hidden';

      document.querySelector('.basic-config').textContent = '';
      document.querySelector('.extended-config').textContent = '';

      document.querySelector('.correct-label').textContent = '';
      document.querySelector('.answered-label').textContent = '';
   };

   resetOptions = () => {
      this.resetCategories();
      this.category = null;

      for (parent of document.querySelectorAll('.radio')) {
         parent.children[0].checked = false;
      }
      this.level = null;
      this.type = null;

      document.querySelector('#amount').value = '';
   };

   resetScore = () => {
      document.querySelector('.correct').textContent = '';
      document.querySelector('.answered').textContent = '';
   };

   setAmount = (min, max) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      const id = 'amount';

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

      document.querySelector('form.dialog').appendChild(section);
   };

   // TODO
   // As we make categories, we should also record them to the game object
   // perhaps with a callback
   // so we can keep track of how many questions we can still serve?
   setCategories = categories => {
      // A quick and easy way to have placeholder text for the dropdown menu
      // https://stackoverflow.com/a/30525521/1987724
      let option = document.createElement('option');

      option.selected = true;
      option.disabled = true;
      option.hidden = true;
      option.value = -1;
      option.textContent = 'Please select a category';

      const select = document.querySelector('#categories');
      select.appendChild(option);

      categories.forEach(category => {
         option = document.createElement('option');

         option.value = category.id;
         option.textContent = category.name;

         select.appendChild(option);
      });
   };

   setCategoryConfig = category => {
      this.category = category;
   };

   setLevelConfig = level => {
      this.level = this.toTitleCase(level);
   };

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
         section.classList.add('radio');
         section.appendChild(radio);
         section.appendChild(label);

         fieldset.appendChild(section);
      });

      document.querySelector('form.dialog').appendChild(fieldset);
   };

   setOptionsButtons = () => {
      const reset = document.createElement('button');
      const rtype = 'reset';

      const start = document.createElement('button');
      const btype = 'button';

      reset.type = rtype;
      reset.classList.add(rtype);
      reset.classList.add('menu');
      reset.classList.add(btype);
      reset.textContent = 'RESET';

      start.type = btype;
      start.classList.add('start');
      start.classList.add('menu');
      start.classList.add(btype);
      start.textContent = 'START GAME';

      const section = document.createElement('section');
      section.classList.add('options-buttons');
      section.appendChild(reset);
      section.appendChild(start);

      document.querySelector('form.dialog').appendChild(section);
   };

   setTimed = () => {
      const input = document.createElement('input');
      const label = document.createElement('label');
      const id = 'timed';

      input.type = 'checkbox';
      input.id = id;
      input.name = id;

      label.setAttribute('for', id);
      label.textContent = id.toUpperCase();

      const section = document.createElement('section');
      section.classList.add(id);
      section.appendChild(input);
      section.appendChild(label);

      document.querySelector('form.dialog').appendChild(section);
   };

   startTimer = () => {
      this.elapsedTime = 0;
      this.timer = setInterval(() => {
         this.elapsedTime++;
         this.renderTime();
      }, this.UPDATE_INTERVAL);
   };

   stopTimer = () => {
      clearInterval(this.timer);
      // console.log(`timer: ${this.timer}
      // time: ${this.elapsedTime}`);
      return this.elapsedTime;
   };

   setTypeConfig = type => {
      this.type = this.getTypeString(type);
   };

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
         section.classList.add('radio');
         section.appendChild(radio);
         section.appendChild(label);

         fieldset.appendChild(section);
      });

      document.querySelector('form.dialog').appendChild(fieldset);
   };

   showOptions = () => {
      document.querySelector('.options').style.display = 'flex';
   };

   toTitleCase = string => {
      return string
         .split(' ')
         .map(word => word[0].toUpperCase().concat(word.substring(1)))
         .join(' ');
   };
}

export default Renderer;
