"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import useNetworkStatus from '../lib/useNetworkStatus';
import { Question, Quiz } from '@/app/lib/definitions';
import QuestionComponent from './question';
import TimerAlertDialog from './timer-dialog';

interface QuizProps {
    quiz: Quiz;
    initialAnswers: Array<string | undefined>;
    initialScores: Array<boolean | undefined>;
    submitAnswers: (question_id: string, answer_text: string) => void;
    syncAllAnswers: (questionsToAnswers: Map<string, string>) => void;
    clearAnswers: () => void;
}

function QuizComponent({ quiz, initialAnswers, initialScores, submitAnswers, syncAllAnswers, clearAnswers }: QuizProps) {

    const [answerArray, setAnswerArray] = useState<Array<string | undefined>>(initialAnswers)
    const [scoreArray, setScoreArray] = useState<Array<boolean | undefined>>(initialScores)
    const [inProgress, setInProgress] = useState<boolean>(true)
    const [timeLeft, setTimeLeft] = useState(10000);

    useEffect(() => {
        if (timeLeft > 0 && inProgress) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, inProgress]);

    const questionMap = new Map<string, Question>();

    quiz?.questions?.forEach((question) => {
        questionMap.set(question.id, question);

    });

    const { isOnline } = useNetworkStatus();

    const handleSubmit = (questionId: string, answer: string, index: number) => {
        console.log(questionId, answer)
        let correct = undefined;
        if (quiz?.questions[index].question_type == 'multiplechoice') {
            correct = false;
            quiz?.questions[index].correct_choices?.forEach((choice) => {
                if (choice.choice_text === answer) {
                    correct = true
                }
            })
        }
        const scoreArrayTemp = [...scoreArray]
        scoreArrayTemp.push(correct)
        setScoreArray(scoreArrayTemp)


        const answerArrayTemp = [...answerArray]
        answerArrayTemp.push(answer)
        setAnswerArray(answerArrayTemp)

        //submit question data
        if (isOnline) {
            submitAnswers(questionId, answer)
        }
    }

    const handleSync = () => {
        const questionsToAnswersMap = new Map(answerArray.map((answer, index) => [quiz.questions[index].id, answer ?? '']));
        if (isOnline) {
            syncAllAnswers(questionsToAnswersMap)
        }
    }

    const booleanScore = (scores: Array<boolean | undefined>) => {
        const booleanValues = scores.filter(score => typeof score === 'boolean');
        const trueCount = booleanValues.filter(value => value === true).length;
        return `${trueCount} / ${quiz.questions.length}`;
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const questionIndex = answerArray.length



    return (
        <main className="flex min-h-screen flex-col p-6">
            {timeLeft === 0 && <TimerAlertDialog openDialog={true} score={booleanScore(scoreArray)} onClose={clearAnswers} />}
            <h1>{quiz.title}</h1>
            <p>Time left: {formatTime(timeLeft)}</p>
            {isOnline && <p className='text-green-800 font-bold'>Online</p>}
            {!isOnline && <p className='text-yellow-800 font-bold'>Offline</p>}
            <div className="mt-4 gap-4">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:px-20">
                    <p className={`text-xl text-gray-800 md:text-xl md:leading-normal`}>
                        Answer the following questions
                    </p>
                </div>
                <div className="p-6">
                    {quiz?.questions.map((question, index) => {
                        const locked = index < questionIndex
                        const answerResult = locked ? scoreArray[index] : undefined
                        if (index <= questionIndex) {
                            return (
                                <QuestionComponent locked={locked} initialValue={initialAnswers[index]}
                                    handleSubmit={handleSubmit} {...question} index={index}
                                    answerResult={answerResult} totalQuestions={quiz.questions.length} />
                            )
                        }
                        return null;
                    }
                    )
                    }
                    {inProgress && <div className='md:flex block'>
                        <Button className="my-3" onClick={handleSync} disabled={!isOnline}>Sync</Button>
                        {!isOnline && <span>You are offline. Please go back online to sync</span>}
                    </div>}
                    {quiz && (questionIndex > quiz?.questions.length - 1) && inProgress && (<Button className='bg-green-800' onClick={() => setInProgress(!inProgress)} disabled={!isOnline}>Finish</Button>)}
                </div>
            </div>
            {!inProgress && <div>
                <p>Congratulations! You have finished.</p>
                <p>Of the multiple choice questions, you scored {booleanScore(scoreArray)}</p>
                <p>You spent {formatTime(10000 - timeLeft)} on this assignment</p>
                <Link className="text-blue-800 underline" onClick={clearAnswers} href='/quizselection'>Return to quiz selection</Link>
            </div>
            }
        </main>
    );
}

export default QuizComponent