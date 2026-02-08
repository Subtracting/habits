'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthProps {
  onUserChange: (user: User | null) => void;
}

export default function Auth({ onUserChange }: AuthProps) {

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      onUserChange(currentUser);
    };

    getCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      onUserChange(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onUserChange]);

  return null;
}
