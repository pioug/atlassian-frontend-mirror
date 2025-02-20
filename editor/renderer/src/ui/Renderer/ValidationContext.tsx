import { createContext } from 'react';

type ValidationContextType = { skipValidation: boolean } | null;
export const ValidationContext = createContext<ValidationContextType>(null);
export const ValidationContextProvider = ValidationContext.Provider;
