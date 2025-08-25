import { createContext } from 'react';

type ValidationContextType = { allowNestedTables?: boolean; skipValidation?: boolean } | null;

/**
 * The ValidationContext is used to pass down the `skipValidation` flag from the NBMRenderer
 * to any ReactRenderer nested inside a Legacy Content Macro. This allows the nested ReactRenderer
 * to bypass the ADF schema validation when necessary.
 * It also allows validation overrides to be passed to nested renderers. For example renderers nested inside bodiedExtension
 */
export const ValidationContext = createContext<ValidationContextType>(null);
export const ValidationContextProvider = ValidationContext.Provider;
