import type { Provider } from 'react';

import type { TypeAheadContextValue } from './TypeAheadContext';
import { TypeAheadContext } from './TypeAheadContext';

export const TypeAheadProvider: Provider<TypeAheadContextValue | null> = TypeAheadContext.Provider;
