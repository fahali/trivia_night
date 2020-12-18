class Renderer {
   resetCard = () => {
      document.querySelector('.question').textContent = '';
      document.querySelector('.answers').textContent = '';
   };

   renderScore = (score = 0) => {
      document.querySelector('.score').textContent = `SCORE: ${score}`;
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

   renderWin = (score, total) => {
      const gameover = document.querySelector('.gameover');

      gameover.appendChild(
         document.createTextNode(
            `You scored ${score} out of ${total} questions!`
         )
      );

      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createElement('br'));
      gameover.appendChild(document.createTextNode('Play again?'));

      document.querySelector('.modal').style.display = 'flex';
   };

   reset = () => {
      this.resetCard();
      // TODO - I don't like calling renderScore here, feels wrong
      //        figure out how to get rid of this but still have the score
      //        update before we hide the modal
      this.renderScore();

      document.querySelector('.modal').style.display = 'none';
      document.querySelector('.gameover').textContent = '';
   };
}

export default Renderer;
