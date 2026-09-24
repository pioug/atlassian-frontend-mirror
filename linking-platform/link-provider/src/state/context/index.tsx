import React, { createContext } from 'react';

import { type ProviderProps } from '../../provider';
import { type CardContext } from './types';

export const SmartCardContext: React.Context<CardContext | undefined> = createContext<
	CardContext | undefined
>(undefined);

export type { ProviderProps, CardContext };

export default SmartCardContext;
