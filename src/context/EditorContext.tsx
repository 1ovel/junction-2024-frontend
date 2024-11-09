'use client'

import React, { createContext, useContext, useState } from 'react';

interface EditorContextType {
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<string>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tool, setTool] = useState<string>("draw");

  return (
    <EditorContext.Provider value={{ tool, setTool }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within a EditorProvider');
  }
  return context;
};
