// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:

import { Quiz, User, Question, Choice, Answer } from "./definitions";

const choices:Choice[] = [
  {
    id:"choice1", 
    choice_text:"true"
  }, 
  {
    id:"choice2", 
    choice_text:"false"
  }, 
]

const questions:Question[] = [
  {
    id:"question1",
    question_type:"multiplechoice", 
    question_text: "Answer true to this question",
    choices:[choices[0], choices[1]],
    correct_choices:[choices[0]]
  }, 
  {
    id:"question2", 
    question_type:"open", 
    question_text:"how do you feel today?"
  },
  {
    id:"question3", 
    question_type:"open", 
    question_text:"how do you rank the Back to the Future movies?"
  }
]

const quizzes: Quiz[] =[
  {
    id: "quizid",
    title:"Sample Quiz",
    questions:[questions[0], questions[1], questions[2]],
  }
]

export const users:User[] = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
    assignedQuiz:quizzes[0],
    currentQuestionIndex:0,
  },
];

export const answers:Answer[] =[
  {
  id:'answer1',
  user_id:'410544b2-4001-4271-9855-fec4b6a6442a',
  question_id:"question1",
  quiz_id:"quizid",
  answer_id:"choice1",
  }
]
