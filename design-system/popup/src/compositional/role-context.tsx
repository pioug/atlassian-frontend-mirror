/* eslint-disable @repo/internal/react/require-jsdoc */

import { type Context, createContext } from 'react';

export const RoleContext: Context<'dialog' | undefined> = createContext<'dialog' | undefined>(
	undefined,
);
