'use client'

import React, { createContext, useContext, useState } from 'react';

interface WizardContextType {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  return (
    <WizardContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a FileProvider');
  }
  return context;
};
