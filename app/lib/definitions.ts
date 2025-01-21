export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  assignedQuiz?:Quiz;
  currentQuestionIndex?:number;
};

export type Quiz ={
  id: string;
  title:string;
  questions:Question[];
}

export type QuizRaw = Omit<Quiz, 'questions'> & {
  questions: string[];
};

export type Question ={
  id: string; 
  question_type:"multiplechoice" | "open";
  question_text:string;
  choices?:Choice[]
  correct_choices?:Choice[];
}

export type QuestionRaw ={
  id: string; 
  question_type:"multiplechoice" | "open";
  question_text:string;
  choices?:string[]
  correct_choices?:string[];
}

export type Choice ={
  id:string;
  choice_text:string;
}

export type Answer ={
  id:string;
  user_id:string;
  question_id:string;
  quiz_id:string;
  answer_id?:string;
  answer_text?:string;
}

