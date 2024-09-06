// AppContext.tsx

import React, { createContext, useState, useContext } from 'react';

interface AppContextType {
  classId: number | null;
  setClassId: (id: number) => void;
  teacherId: string | null;
  setTeacherId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classId, setClassId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ classId, setClassId, teacherId, setTeacherId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
