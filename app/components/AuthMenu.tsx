'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthMenuProps {
  user: User | null;
}

export default function AuthMenu({ user }: AuthMenuProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) setError(signUpError.message);
    else alert('Check your email for the confirmation link!');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
  };

  const handleSignOut = async () => {
    setError('');
    await supabase.auth.signOut();
  };

  const inputClass = "w-full px-4 py-2 rounded bg-zinc-950 text-zinc-100 border-2 border-zinc-900 hover:border-zinc-700 focus:border-zinc-700 outline-none text-sm transition-colors";
  const btnClass = "w-full px-4 py-1 text-sm rounded border-2 border-zinc-900 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors";

  if (user) {
    return (
      <div className="mt-4 space-y-2">
        <div className="px-4 py-2 border-2 border-zinc-900 rounded">
          <span className="block text-xs text-zinc-600 mb-1">signed in as</span>
          <span className="block text-sm text-zinc-300 truncate">{user.email}</span>
        </div>
        <button onClick={handleSignOut} className={`${btnClass} text-zinc-500 hover:text-zinc-300`}>
          sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3 bg-black ">
      {error && (
        <p className="text-xs text-red-400 px-1">{error}</p>
      )}

      <form onSubmit={handleSignIn} className="space-y-2">
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        <button type="submit" className={`${btnClass} text-zinc-100`}>
          sign in
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-900" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-black text-zinc-600">or</span>
        </div>
      </div>

      <form onSubmit={handleSignUp}>
        <button type="submit" className={`${btnClass} text-zinc-500 hover:text-zinc-300`}>
          sign up
        </button>
      </form>
    </div>
  );
}
