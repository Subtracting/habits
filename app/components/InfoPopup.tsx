import { Dialog, DialogPanel } from '@headlessui/react'
import { useState } from 'react'

export default function InfoPopup({
    infoDate,
    infoCount,
    updateDays,
    selectedOptionValue,
    onClose,
} : {
    infoDate: string;
    infoCount: number;
    selectedOptionValue: string;
    updateDays: (dateToUpdate: Date, count: number, selectedOptionValue: string) => void;
    onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [count, setCount] = useState(infoCount);

  function close() {
    setIsOpen(false);
    onClose();
  }

  function submit() {
    updateDays(new Date(infoDate), count, selectedOptionValue);
    close();
  }

  return (
    <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-sm bg-black border-2 border-zinc-950 rounded p-6 duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
          <p className="pb-2 border-b-2 border-zinc-900 text-zinc-400 text-xl mb-4">{infoDate}</p>

          <input
            autoFocus
            type="number"
            min="0"
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") close(); }}
            className="w-16 mr-4 bg-zinc-950 text-zinc-100 hover:border-zinc-700 rounded px-4 py-1 mb-4 outline-none tabular-nums"
          />
            {selectedOptionValue}

          <div className="flex gap-2">
            <button
              onClick={submit}
              className="bg-black hover:bg-zinc-950 text-zinc-100 border-2 border-zinc-900 hover:border-zinc-700 px-4 py-1 rounded"
            >
              submit
            </button>
            <button
              onClick={close}
              className="bg-black hover:bg-zinc-950 text-zinc-500 hover:text-zinc-300 border-2 border-zinc-900 hover:border-zinc-700 px-4 py-1 rounded"
            >
              cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
