import { useContext } from 'react';

import type { QuickInsertContextValue } from './QuickInsertContext';
import { QuickInsertContext } from './QuickInsertContext';

export const useQuickInsertContext = (): QuickInsertContextValue => {
	const value = useContext(QuickInsertContext);

	if (!value) {
		throw new Error('useQuickInsertContext must be used within QuickInsertProvider');
	}

	return value;
};
