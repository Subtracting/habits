// components/Menu.tsx - much cleaner now
import { User } from '@supabase/supabase-js';
import AuthMenu from './AuthMenu';
import { useState } from 'react';

interface MenuProps {
  inputType: 'habits' | 'goals';
  setInputType: (type: 'habits' | 'goals') => void;
  user: User | null;
}

export default function Menu({ inputType, setInputType, user }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initials = user?.email?.slice(0, 1).toUpperCase() || '';
  const menuIconPath = isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16";
    
  return (
    <div className="relative">
      <button
        className="p-2 rounded-full bg-zinc-800 border border-black text-white hover:bg-zinc-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {initials ? (
          <div className="h-6 w-6 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
        ) : (
          <svg className="h-6 w-6 text-zinc-400" viewBox="0 0 24 24" fill="none">
            <path
              d={menuIconPath}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 z-50 p-4">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setInputType('habits')}
              className={`px-3 py-2 text-sm font-medium rounded ${
                inputType === 'habits' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              habits
            </button>
            <button 
              onClick={() => setInputType('goals')}
              className={`px-3 py-2 text-sm font-medium rounded ${
                inputType === 'goals' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              goals
            </button>
          </div>
          
          <AuthMenu user={user} />
        </div>
      )}
    </div>
  );
}
