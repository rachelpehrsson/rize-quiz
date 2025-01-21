import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";

interface TimerAlertDialogProps {
    score: string;
    openDialog: boolean;
    onClose:()=>void;
}

const TimerAlertDialog = ({ score, openDialog, onClose }: TimerAlertDialogProps) => {
    const router = useRouter()
    const handleClose=()=>{
        onClose()
        router.push('/quizselection')
    }
    
    return (
        <AlertDialog.Root open={openDialog}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-5 data-[state=open]:animate-overlayShow" />
                <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
                    <AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                        Time's Up!
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-mauve11">
                        <p>You have run out of time.</p>
                        <p>You scored:{score}</p>
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-[25px]">
                        <AlertDialog.Action asChild>
                            <button onClick={handleClose} className="inline-flex h-[35px] items-center justify-center rounded bg-red4 px-[15px] font-medium leading-none text-red11 outline-none hover:bg-red5 focus:shadow-[0_0_0_2px] focus:shadow-red7">
                                Return to Quiz Selection
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
export default TimerAlertDialog;