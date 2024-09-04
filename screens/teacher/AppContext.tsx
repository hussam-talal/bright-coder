// AppContext.tsx

import React, { createContext, useState, useContext } from 'react';

// تحديد النوع للبيانات التي سيتم تخزينها في السياق
interface AppContextType {
  classId: number | null;
  setClassId: (id: number) => void;
  teacherId: string | null;
  setTeacherId: (id: string) => void;
}

// إنشاء السياق وإعداد القيم الافتراضية
const AppContext = createContext<AppContextType | undefined>(undefined);

// إنشاء مقدم (Provider) للسياق لتغليف التطبيق
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classId, setClassId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ classId, setClassId, teacherId, setTeacherId }}>
      {children}
    </AppContext.Provider>
  );
};

// هوك (Hook) للوصول إلى السياق بسهولة من المكونات الأخرى
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
