/* eslint-disable @repo/internal/react/require-jsdoc */
import { type Context, createContext } from 'react';

export const TriggerRefContext: Context<HTMLElement | null> = createContext<HTMLElement | null>(
	null,
);
