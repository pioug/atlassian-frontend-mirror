import { useContext } from 'react';

import { SmartCardContext } from './index';
import { type CardContext } from './types';

export function useSmartLinkContext(): CardContext {
	const context = useContext(SmartCardContext);
	if (!context) {
		throw Error('useSmartCard() must be wrapped in <SmartCardProvider>');
	}

	return context;
}
