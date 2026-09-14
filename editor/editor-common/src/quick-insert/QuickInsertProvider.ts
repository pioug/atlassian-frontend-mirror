import type { Provider } from 'react';

import type { QuickInsertContextValue } from './QuickInsertContext';
import { QuickInsertContext } from './QuickInsertContext';

export const QuickInsertProvider: Provider<QuickInsertContextValue | null> =
	QuickInsertContext.Provider;
