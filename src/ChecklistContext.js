import React, { createContext, useContext, useState } from 'react';

const ChecklistContext = createContext();

export const useChecklistContext = () => useContext(ChecklistContext);

export const ChecklistProvider = ({ children }) => {
  const [checklistItems, setChecklistItems] = useState([]);

  return (
    <ChecklistContext.Provider value={{ checklistItems, setChecklistItems }}>
      {children}
    </ChecklistContext.Provider>
  );
};
