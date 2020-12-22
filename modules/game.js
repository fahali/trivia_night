class Game {
   /* CONSTANTS */
   SCORE_WEIGHT = 3.333;
   TIME_LIMIT = 30;
   TIME_TOTAL = 100;

   constructor() {
      this.reset();
      this.timed = false;
      this.token = null;
      this.counts = {};
   }

   setCategoryCount = (id, category) => (this.counts[id] = category);

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

      return this.getQuestionObject().type === 'boolean'
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
         ? (
              (this.weighted * this.SCORE_WEIGHT) /
              this.getTotalQuestions()
           ).toFixed(2)
         : this.score;
   };

   getQuestion = () => this.getQuestionObject().question;

   getQuestionObject = () => this.questions[this.index];

   getTotalQuestions = () => this.questions.length;

   getTotalScore = () => {
      return this.timed ? this.TIME_TOTAL.toFixed(2) : this.getTotalQuestions();
   };

   isGameOver = () => this.index === this.getTotalQuestions();

   nextQuestion = () => this.index++;

   processAnswer = (answer, time) => {
      const elapsed = this.TIME_LIMIT - time;
      const correct = answer === this.getCorrectAnswer();
      // if the user has elapsed the time limit or answered incorrectly
      // they don't get any points
      this.weighted += correct && elapsed > 0 ? elapsed : 0;
      this.score += correct ? 1 : 0;
   };

   reset = () => {
      this.index = 0;
      this.score = 0;
      this.weighted = 0;
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

         return question;
      });
   };
}

export default Game;

// TODO - Test score functions' return values
