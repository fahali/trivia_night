class Game {
   constructor() {
      this.reset();
      this.timed = false;
      this.token = null;
      this.timeLimit = 30;
      this.weightFactor = 3.333;
   }

   getAllAnswers = () => {
      // Fisher - Yates shuffle algorithm written in Javascript
      // https://stackoverflow.com/a/6274381
      const shuffle = array => {
         for (let i = array.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1));
            const item = array[i];
            array[i] = array[random];
            array[random] = item;
         }

         return array;
      };

      return this.getQuestionObject().boolean
         ? ['True', 'False']
         : shuffle(
              [this.getCorrectAnswer()].concat(
                 this.getQuestionObject().incorrect_answers
              )
           );
   };

   getCorrectAnswer = () => this.getQuestionObject().correct_answer;

   getFinalScore = () => {
      return this.timed
         ? Math.ceil((this.weightedScore * this.weightFactor) / 10)
         : this.score;
   };

   getQuestion = () => this.getQuestionObject().question;

   getQuestionObject = () => this.questions[this.index];

   getTotalQuestions = () => this.questions.length;

   getTotalScore = () => (this.timed ? 100 : this.getTotalQuestions());

   isGameOver = () => this.index === this.getTotalQuestions();

   nextQuestion = () => this.index++;

   processAnswer = (answer, time) => {
      const timeScore = this.timeLimit - time; // * this.weightFactor;
      const correct = answer === this.getCorrectAnswer();
      // if the user has elapsed the time limit or answered incorrectly
      // they don't get any points
      this.weightedScore += correct && timeScore > 0 ? timeScore : 0;
      this.score += correct ? 1 : 0;
   };

   reset = () => {
      this.index = 0;
      this.score = 0;
      this.weightedScore = 0;
      this.questions = null;
   };

   setQuestions = questions => {
      this.questions = questions.map(question => {
         question.category = decodeURIComponent(question.category);
         question.question = decodeURIComponent(question.question);
         question.correct_answer = decodeURIComponent(question.correct_answer);

         question.incorrect_answers = question.incorrect_answers.map(answer => {
            return decodeURIComponent(answer);
         });

         question.boolean =
            decodeURIComponent(question.type) === 'boolean' ? true : false;

         return question;
      });
   };
}

export default Game;
