import React from 'react';
import { type UserInteractions } from './types';

export const UserInteractionsContext: React.Context<UserInteractions | undefined> =
	React.createContext<UserInteractions | undefined>(undefined);
