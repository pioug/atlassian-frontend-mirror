import { createContext } from 'react';

import { type SubscriptionContextValue } from './types';

export const WaitContext = createContext<SubscriptionContextValue>({
	subscribe: () => () => {},
	currentValue: () => 1,
});
