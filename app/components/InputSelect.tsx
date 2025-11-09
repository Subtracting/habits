import CreatableSelect from 'react-select/creatable';
import type { Option } from '@/types/option.types';

interface InputSelectProps {
  countValue: number;
  setCountValue: (value: number) => void;
  handleSelectUpdate: (value: Option | null) => void;
  handleCreate: (value: string) => void;
  options: Option[];
  selectedOption: Option | null;
}

export default function InputSelect({
    countValue,
    setCountValue,
    handleSelectUpdate,
    handleCreate,
    options,
    selectedOption
    } : (InputSelectProps)) {
    return (
        <div className='flex'>

          <input 
            type='number' 
            value={countValue}
            onChange={(e) => setCountValue(Number(e.target.value))} 
            className='w-16 my-4 bg-zinc-950 text-zinc-100 bborder-2 px-4 py-1 mr-4 rounded'
            />

        <CreatableSelect
            isClearable
            onChange={(newValue) => handleSelectUpdate(newValue)}
            onCreateOption={handleCreate}
            options={options}
            value={selectedOption}
            placeholder="Add habit..."
            className="my-4 mr-4"
            styles={{
                input: base => ({
                  ...base,
                  color: "white",
                }),
                singleValue: base => ({
                  ...base,
                  color: "white",
                }),
                control: base => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "black",
                    minHeight: "0",
                    minWidth: "140px",
                    maxWidth: "240px",
                    height: "32px",
                }),
                menu: base => ({
                    ...base,
                    backgroundColor: "black",
                    width: "auto",
                    marginTop: "4px",
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#1a1a1a" : "black",
                    color: "white",
                }),
            }}
        />

        </div>
    );
}
