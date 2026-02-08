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
    if (signUpError) {
      setError(signUpError.message);
    } else {
      alert('Check your email for the confirmation link!');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
    }
  };

  const handleSignOut = async () => {
    setError('');
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="mt-4 space-y-2">
        <div className="px-3 py-3 bg-gray-800 rounded">
          <span className="block text-xs text-gray-400 mb-1">Signed in as</span>
          <span className="block text-sm font-medium text-white truncate">
            {user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full px-3 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4 px-3">
      {error && (
        <div className="px-3 py-2 text-red-400 text-sm bg-red-900/20 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSignIn} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          style={{
            WebkitBoxShadow: '0 0 0 1000px rgb(31 41 55) inset',
            WebkitTextFillColor: 'white'
          }}
          required
        />
        <button
          type="submit"
          className="w-full px-3 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-gray-900 text-gray-400">or</span>
        </div>
      </div>
      
      <form onSubmit={handleSignUp}>
        <button
          type="submit"
          className="w-full px-3 py-2 text-sm font-semibold rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
