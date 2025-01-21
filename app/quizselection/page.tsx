import Link from 'next/link';
import { fetchQuizNamesAndIdsForUser} from '../lib/data';

export default async function Page() {
    const quizzes = await fetchQuizNamesAndIdsForUser('5c991d07-3a28-4672-a3b8-0858acb7b269')
  return (
    <main className="flex min-h-screen flex-col p-6">
        <h1>Quiz Selection</h1>
      <div className="mt-4">
        <div className="rounded-lg bg-gray-50 p-2">
            {quizzes.map((quiz)=>{
                return(<Link className='hover:underline' key={quiz.id} href={`/quiz/${quiz.id}`}>{quiz.title}</Link>)
            })}
        </div>
      </div>
    </main>
  );
}