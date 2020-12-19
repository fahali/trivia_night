class Game {
   constructor() {
      this.reset();
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

   getQuestion = () => this.getQuestionObject().question;

   getQuestionObject = () => this.questions[this.index];

   incrementScore = () => this.score++;

   isGameOver = () => this.index === this.totalQuestions();

   nextQuestion = () => this.index++;

   processAnswer = answer => {
      this.score =
         answer === this.getCorrectAnswer() ? this.score + 1 : this.score;
   };

   reset = () => {
      this.index = 0;
      this.score = 0;
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

   totalQuestions = () => this.questions.length;
}

export default Game;
