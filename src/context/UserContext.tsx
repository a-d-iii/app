import React, { createContext, useContext, useState } from 'react';

export type UserContextType = {
  icon: string;
  setIcon: (icon: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [icon, setIcon] = useState<string>('person-circle');
  return (
    <UserContext.Provider value={{ icon, setIcon }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};

export default UserContext;
