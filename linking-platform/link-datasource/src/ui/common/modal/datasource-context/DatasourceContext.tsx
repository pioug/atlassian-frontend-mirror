import React from 'react';

import type { DatasourceContextValue } from './DatasourceContextValue';

export const DatasourceContext: React.Context<DatasourceContextValue | null> =
	React.createContext<DatasourceContextValue | null>(null);
