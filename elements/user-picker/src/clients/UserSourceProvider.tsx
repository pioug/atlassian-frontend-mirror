import React, { createContext } from 'react';

import { type LoadUserSource } from '../types';

export interface UserSourceContext {
	fetchUserSource?: LoadUserSource;
}

export const ExusUserSourceContext: React.Context<Partial<UserSourceContext>> = createContext<
	Partial<UserSourceContext>
>({});
