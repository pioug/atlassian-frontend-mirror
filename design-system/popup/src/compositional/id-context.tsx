import { type Context, createContext } from 'react';

/* eslint-disable @repo/internal/react/require-jsdoc */
export const IdContext: Context<string | undefined> = createContext<string | undefined>(undefined);
