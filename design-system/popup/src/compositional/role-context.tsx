/* eslint-disable @repo/internal/react/require-jsdoc */
import { type Context, createContext } from 'react';

export const RoleContext: Context<string | undefined> = createContext<string | undefined>(
	undefined,
);
