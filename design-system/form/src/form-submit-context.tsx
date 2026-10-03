import { type Context, createContext } from 'react';

/**
 * __Form submit context__
 *
 * Counts form submissions so messages that change because of a submit can skip motion.
 */
export const FormSubmitContext: Context<number> = createContext(0);
