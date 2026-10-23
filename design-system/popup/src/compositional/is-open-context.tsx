import { type Context, createContext } from 'react';

export const IsOpenContext: Context<boolean> = createContext<boolean>(false);
