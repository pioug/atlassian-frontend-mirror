import { createContext } from 'react';

type ValidationContextType = { skipValidation: boolean } | null;

/**
 * The ValidationContext is used to pass down the `skipValidation` flag from the NBMRenderer
 * to any ReactRenderer nested inside a Legacy Content Macro. This allows the nested ReactRenderer
 * to bypass the ADF schema validation when necessary.
 */
export const ValidationContext = createContext<ValidationContextType>(null);
export const ValidationContextProvider = ValidationContext.Provider;
