import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import type { DaysState } from '@/types/days.types';

export default function DeletePopup({
    setDays, 
    selectedOptionValue
} : {
    setDays: React.Dispatch<React.SetStateAction<DaysState>>; 
    selectedOptionValue: string
}) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function deleteSelectedOption() {
    setIsOpen(false);
    setDays(prev => {
        const newState = { ...prev, [selectedOptionValue]: [] };
        localStorage.setItem('habits-data', JSON.stringify(newState));
        return newState;
    });
  }

  return (
    <>
      <Button
        onClick={open}
        className='bg-black hover:bg-zinc-950 text-zinc-700 hover:text-zinc-100 border-zinc-900 hover:border-rose-900 border-2 m-4 px-4 py-1 rounded'
      >
        del
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                Delete habit 
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Do you want to delete all habits in {selectedOptionValue}? 
              </p>
              <div className="mt-4">
                <Button
                  className='bg-black hover:bg-zinc-950 text-zinc-200 hover:text-zinc-100 border-rose-950 hover:border-rose-900 border-2 px-4 py-1 rounded'
                  onClick={deleteSelectedOption}
                >
                 Delete 
                </Button>

                <Button
                  className='m-4 bg-black hover:bg-zinc-950 text-zinc-100 hover:text-zinc-100 border-zinc-900 hover:border-zinc-700 border-2 px-4 py-1 rounded'
                  onClick={close}
                >
                 Cancel 
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
