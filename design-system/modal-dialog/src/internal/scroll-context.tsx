import { type Context, createContext } from 'react';

export const ScrollContext: Context<boolean | null> = createContext<boolean | null>(null);
