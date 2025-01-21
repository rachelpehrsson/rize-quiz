import { clearAnswersForQuiz, fetchAnswersForUser, fetchQuizData,submitAnswerData, syncAnswerData } from '../../lib/data';
import { Question, } from '@/app/lib/definitions';
import { users } from '@/app/lib/mockdata';
import QuizComponent from '@/app/ui/quiz';

export default async function Page({params}) {

  const id = await params.id

  const user = users[0].id

  async function clearAnswers(){
    "use server"
    clearAnswersForQuiz(user, id)
  }

  async function submitAnswer(question_id: string, answer_text: string) {
    "use server"
    console.log("called")
    submitAnswerData(user, question_id, id, answer_text ?? '')
  }
  
  async function syncSubmitAllAnswers(questionsToAnswers: Map<string, string>) {
    "use server"
    clearAnswers()
    syncAnswerData(user, id, questionsToAnswers)
  }

  const quiz = await fetchQuizData(id as string);
  //get answers for questions
  const answerData = await fetchAnswersForUser(user, id)

  const questionMap = new Map<string, Question>();

  quiz?.questions?.forEach((question) => {
    questionMap.set(question.id, question);
  });

  const initialAnswers: Array<string | undefined> = []
  const initialScores: Array<boolean|undefined> = []
  if (answerData) {
    for (let i = 0; i < answerData.length; i++) {
      const question = questionMap.get(answerData[i].question_id)
      if (question && question?.question_type === "multiplechoice") {
        initialScores.push(question.correct_choices?.map((choice) => { return choice.choice_text }) === answerData[i].answer_text)
      }else{
        initialScores.push(undefined)
      }
      if (answerData[i].answer_text) {
        initialAnswers.push(answerData[i].answer_text)
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <QuizComponent quiz={quiz} initialAnswers={initialAnswers} initialScores={initialScores} submitAnswers={submitAnswer} syncAllAnswers={syncSubmitAllAnswers} clearAnswers={clearAnswers} />
    </main>
  );
}