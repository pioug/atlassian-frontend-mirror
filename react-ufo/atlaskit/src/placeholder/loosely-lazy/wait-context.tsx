import { type Context, createContext } from 'react';

import { type SubscriptionContextValue } from './types';

export const WaitContext: Context<SubscriptionContextValue> =
	createContext<SubscriptionContextValue>({
		subscribe: () => () => {},
		currentValue: () => 1,
	});
