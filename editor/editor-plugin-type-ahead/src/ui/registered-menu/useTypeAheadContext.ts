import { useContext } from 'react';

import type { TypeAheadContextValue } from './TypeAheadContext';
import { TypeAheadContext } from './TypeAheadContext';

export const useTypeAheadContext = (): TypeAheadContextValue => {
	const value = useContext(TypeAheadContext);

	if (!value) {
		throw new Error('useTypeAheadContext must be used within TypeAheadProvider');
	}

	return value;
};
