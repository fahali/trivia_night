class Game {
   constructor() {
      this.reset();
   }

   reset = () => {
      this.index = 0;
      this.score = 0;
      this.questions = null;
   };

   nextQuestion = () => this.index++;

   incrementScore = () => this.score++;

   totalQuestions = () => this.questions.length;

   isGameOver = () => this.index === this.totalQuestions();

   currentQuestion = () => this.questions[this.index];

   correctAnswerString = () => this.currentQuestion().correct_string;

   processAnswer = answer => {
      this.score =
         answer === this.correctAnswerString() ? this.score + 1 : this.score;
   };

   currentQuestionString = () => this.currentQuestion().question_string;

   currentAnswers = () => {
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

      return this.currentQuestion().boolean
         ? ['True', 'False']
         : shuffle(
              [this.correctAnswerString()].concat(
                 this.currentQuestion().incorrect_strings
              )
           );
   };

   setQuestions = questions => {
      this.questions = questions.map(question => {
         question.question_string = decodeURIComponent(question.question);
         question.correct_string = decodeURIComponent(question.correct_answer);

         question.incorrect_strings = question.incorrect_answers.map(answer => {
            return decodeURIComponent(answer);
         });

         question.boolean =
            decodeURIComponent(question.type) === 'boolean' ? true : false;

         return question;
      });
   };
}

export default Game;
