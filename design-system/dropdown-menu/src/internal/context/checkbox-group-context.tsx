import { createContext } from 'react';

/**
 * Holds the unique identifier for the checkbox group.
 */
export const CheckboxGroupContext: import("react").Context<string> = createContext<string>('');
