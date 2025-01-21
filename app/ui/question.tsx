import { Choice } from "../lib/definitions";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { TextArea } from "@radix-ui/themes"
import { Button } from "./button";
import { useRef, useState } from "react";
import { cva } from 'class-variance-authority'

interface QuestionProps {
    id: string;
    question_type: "multiplechoice" | "open";
    question_text: string;
    initialValue?: string;
    choices?: Choice[]
    locked: boolean,
    handleSubmit: (questionId: string, answer: string, index: number) => void;
    index: number;
    answerResult?: boolean;
    totalQuestions: number;
}

function QuestionComponent({ id, question_type, question_text, initialValue, choices, locked, handleSubmit, index, answerResult, totalQuestions }: QuestionProps) {

    const activeQuestion = cva(
        "border",
        {
            variants: {
                disabled: {
                    true: "pointer-events-none",
                    false: ''
                },
                answerStatus:{
                    correct: "bg-green-100", 
                    incorrect: "bg-red-100", 
                    review:"bg-yellow-100", 
                    unanswered:"bg-white"
                }
            }
        }
    )

    const [selectedRadio, setSelectedRadio] = useState<string | undefined>()

    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const radioQuestion = (choices: Choice[]) => {
        return (
            <RadioGroup.Root defaultValue={initialValue} onValueChange={setSelectedRadio} className="flex flex-col gap-2.5">
                {choices.map((choice) => {
                    return (
                        <div className="flex items-center" key={choice.id}>
                            <RadioGroup.Item className="size-[25px] cursor-default rounded-full bg-gray shadow-[0_2px_10px] outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black" value={choice.choice_text}>
                                <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-black" />
                            </RadioGroup.Item>
                            <label
                                className="pl-[15px] text-[15px] leading-none text-black"
                                htmlFor="r1"
                            >
                                {choice.choice_text}
                            </label>
                        </div>
                    )
                })}
            </RadioGroup.Root>
        )
    }

    const openQuestion = () => {
        return (

            <TextArea defaultValue={initialValue} ref={textAreaRef} placeholder="Answer" />

        )
    }
    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let submittedValue;
        if (question_type == "multiplechoice")
            submittedValue = selectedRadio ?? ""
        else {
            submittedValue = textAreaRef.current?.value ?? ""
        }
        handleSubmit(id, submittedValue, index)
    }

    const correct = answerResult !== undefined && answerResult
    const incorrect = answerResult !== undefined && !answerResult;
    const needsReview = answerResult === undefined && locked;

    const answerStatus = correct?"correct":incorrect?"incorrect":needsReview?"review":"unanswered";

    return (
        <div className={activeQuestion({disabled: locked, answerStatus: answerStatus})} id={id} aria-disabled={locked} key={id}>
            <span className="font-bold">{index + 1}/{totalQuestions}</span>
            {correct && <p className="text-green-800 font-bold">Correct</p>}
            { incorrect && <p className="text-red-800 font-bold">Incorrect</p>}
            { needsReview && <p className="text-yellow-800 font-bold">Awaiting Review</p>}
            <form onSubmit={handleFormSubmit}>
                <p>{question_text}</p>
                {question_type == "multiplechoice" && choices && radioQuestion(choices)}
                {question_type == "open" && openQuestion()}
                <Button className={`mt-2 ${locked?"bg-slate-400":''}`} type="submit" disabled={locked}>Submit</Button>
            </form>
        </div>
    )

}

export default QuestionComponent;