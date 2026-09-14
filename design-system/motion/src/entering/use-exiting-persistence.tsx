import { useContext } from 'react';

import { type ExitingChildContext, ExitingContext } from './exiting-persistence';

export const useExitingPersistence = (): ExitingChildContext => {
	return useContext(ExitingContext);
};
