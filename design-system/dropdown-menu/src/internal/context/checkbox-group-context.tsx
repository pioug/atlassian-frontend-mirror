import { type Context, createContext } from 'react';

/**
 * Holds the unique identifier for the checkbox group.
 */
export const CheckboxGroupContext: Context<string> = createContext<string>('');
