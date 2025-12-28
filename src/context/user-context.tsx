
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { mockHolder } from '@/lib/data';
import type { Holder } from '@/lib/types';

interface UserContextType {
  holder: Holder | null;
  setHolder: Dispatch<SetStateAction<Holder | null>>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [holder, setHolder] = useState<Holder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('holderData');
      if (item) {
        setHolder(JSON.parse(item));
      } else {
        // If no data in local storage, initialize with mock data
        setHolder(mockHolder);
        window.localStorage.setItem('holderData', JSON.stringify(mockHolder));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      // Fallback to mock data in case of parsing error
      setHolder(mockHolder);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Persist holder data to localStorage whenever it changes
    if (holder) {
      try {
        window.localStorage.setItem('holderData', JSON.stringify(holder));
      } catch (error) {
        console.error("Failed to save user data to localStorage", error);
      }
    }
  }, [holder]);

  return (
    <UserContext.Provider value={{ holder, setHolder, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
