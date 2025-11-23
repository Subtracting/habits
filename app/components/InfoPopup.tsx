import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

export default function InfoPopup({
    infoDate, 
    infoCount,
    onClose,
} : {
    infoDate: string; 
    infoCount: number;
    onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <>
      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                Day info 
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Date: {infoDate}, count: {infoCount}.
              </p>
              <div className="mt-4">
                <Button
                  className='bg-black hover:bg-zinc-950 text-zinc-200 hover:text-zinc-100 border-rose-950 hover:border-rose-900 border-2 px-4 py-1 rounded'
                  onClick={close}
                >
                 OK 
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
