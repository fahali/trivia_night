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
      document.querySelector('#categories').textContent = '';
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
