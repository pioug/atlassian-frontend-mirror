import { type Context, createContext } from 'react';

export const EnsureIsInsidePopupContext: Context<boolean> = createContext<boolean>(false);
