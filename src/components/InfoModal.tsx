import { useState, type Dispatch, type SetStateAction } from "react";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from "clsx";

interface InfoModalInterface {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    // setIsOpen: (open: boolean) => void;
}

const InfoModal = ({isOpen, setIsOpen}:InfoModalInterface) => {
    

    return (
        <>
            <div
                className={clsx(`
                z-2 
                fixed
                w-full
                h-full
                opacity-80
                bg-base-300
            `,
                    isOpen
                        ?
                        `
                visible
            `
                        :
                        `
                invisible
            `
                )}
                style={{
                    top: 0,
                    left: 0
                }}
            >
                <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-4 border border-8 border-white bg-info rounded-lg p-12">
                            <DialogTitle className="font-bold">EPSM Info</DialogTitle>
                            <Description>EPSM helps you generate 'pack.yml' files for Edgeware++</Description>
                            <Description><b>All data is processed on your computer and never leaves your device</b></Description>
                            <p>See the <a target="blank" href="https://duckduckgo.com"><b>project Github</b></a> to learn more about the project and how to use it</p>
                            <div className="flex gap-4">
                                <button onClick={() => setIsOpen(false)}>Close</button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </div>
        </>
   );
}

export default InfoModal;