class Renderer {
   toggleDetails = () => {
      const details = document.querySelector('details');
      details.open = details.open ? false : true;
   };

   resetDetails = () => {
      document.querySelector('details').style.visibility = 'hidden';

      document.querySelector('.basic-config').textContent = '';
      document.querySelector('.extended-config').textContent = '';

      document.querySelector('.correct-label').textContent = '';
      document.querySelector('.answered-label').textContent = '';
   };

   resetScore = () => {
      document.querySelector('.correct').textContent = '';
      document.querySelector('.answered').textContent = '';
   };

   resetCard = () => {
      document.querySelector('.question').textContent = '';
      document.querySelector('.answers').textContent = '';
   };

   resetCategories = () => {
      document.querySelector('#categories').firstChild.selected = true;
   };

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
         label.textContent = level[0].toUpperCase().concat(level.substring(1));

         fieldset.appendChild(radio);
         fieldset.appendChild(label);
      });

      const options = document.querySelector('form.dialog');
      options.appendChild(fieldset);
   };

   setTypes = types => {
      const legend = document.createElement('legend');
      legend.textContent = 'TYPE';

      const fieldset = document.createElement('fieldset');
      fieldset.appendChild(legend);

      types.forEach(type => {
         const radio = document.createElement('input');
         const label = document.createElement('label');
         const text = type === 'boolean' ? 'True / False' : 'Multiple choice';

         radio.type = 'radio';
         radio.name = 'type';
         radio.id = type;

         label.setAttribute('for', type);
         label.textContent = text;

         fieldset.appendChild(radio);
         fieldset.appendChild(label);
      });

      const options = document.querySelector('form.dialog');
      options.appendChild(fieldset);
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

      const options = document.querySelector('form.dialog');
      options.appendChild(label);
      options.appendChild(input);
   };

   setStartButton = () => {
      const button = document.createElement('button');
      const type = 'button';

      button.type = type;
      button.classList.add('start');
      button.classList.add('menu');
      button.classList.add(type);
      button.textContent = 'START GAME';

      document.querySelector('form.dialog').appendChild(button);
   };

   hideOptions = () => {
      document.querySelector('.options').style.display = 'none';
   };

   showOptions = () => {
      document.querySelector('.options').style.display = 'flex';
   };

   renderDetails = questions => {
      document.querySelector('details').style.visibility = 'visible';

      let config = `${questions} questions`;
      document.querySelector('.basic-config').textContent = config;
      document.querySelector('.extended-config').textContent = config;

      document.querySelector('.correct-label').textContent = 'correct:';
      document.querySelector('.answered-label').textContent = 'answered:';
   };

   renderScore = (score = 0, answered = 0) => {
      document.querySelector('.correct').textContent = score;
      document.querySelector('.answered').textContent = answered;
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
   };

   renderGameover = (score, total) => {
      const gameover = document.querySelector('.gameover');

      gameover.appendChild(
         document.createTextNode(
            `You scored ${score} out of ${total} questions!`
         )
      );

      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createTextNode('Play again?'));

      document.querySelector('.end').style.display = 'flex';
   };

   reset = () => {
      this.resetDetails();
      this.resetScore();
      this.resetCard();
      this.resetCategories();

      document.querySelector('.end').style.display = 'none';
      document.querySelector('.gameover').textContent = '';
   };
}

export default Renderer;
