import DatePicker from "react-datepicker";
import InputSelect from "./InputSelect";
import DeletePopup from "./DeletePopup";
import { Option } from "@/types/option.types";
import { DaysState } from "@/types/days.types";

type LogHabitInputProps = {
  setSelectedDate: (date: Date) => void;
  countValue: number;
  setCountValue: (value: number) => void;
  handleSelectUpdate: (value: Option | null) => void;
  handleCreate: (value: string) => void;
  options: Option[];
  selectedOption: Option | null;
  selectedDate: Date;
  updateDays:(dateToUpdate: Date, count: number) => void;
  setDays: React.Dispatch<React.SetStateAction<DaysState>>; 
  selectedOptionValue: string;
};

export default function LogHabitInput({
  setSelectedDate,
  countValue,
  setCountValue,
  handleSelectUpdate,
  handleCreate,
  options,
  selectedOption,
  selectedDate,
  updateDays,
  setDays,
  selectedOptionValue,
}: LogHabitInputProps) {
  return (
    <>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => date && setSelectedDate(date)}
                className="bg-zinc-950 text-white rounded-md px-4 py-2 my-4"
                calendarClassName="react-datepicker"
              />
                <InputSelect
                    countValue={countValue}
                    setCountValue={setCountValue}
                    handleSelectUpdate={handleSelectUpdate}
                    handleCreate={handleCreate}
                    options={options}
                    selectedOption={selectedOption}
                />

              <div className='flex'>
                <button
                  onClick={() => updateDays(selectedDate, countValue)}
                  className="
                    my-4 
                    bg-black 
                    hover:bg-zinc-950 
                    text-zinc-100 
                    hover:text-zinc-100 
                    border-zinc-900 
                    hover:border-zinc-700 
                    border-2 
                    px-4 
                    py-1 
                    rounded"
                >
                  submit
                </button>
                <DeletePopup
                  setDays={setDays}
                  selectedOptionValue={selectedOptionValue}
                />
              </div>
             </div>
    </>
  )
}
