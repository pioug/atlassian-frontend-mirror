import { useContext } from 'react';

import type { DatasourceParameters } from '@atlaskit/linking-types/datasource';

import { DatasourceContext } from './DatasourceContext';
import type { DatasourceContextValue } from './DatasourceContextValue';

export const useDatasourceContext = <
	Parameters extends DatasourceParameters,
>(): DatasourceContextValue<Parameters> => {
	const value = useContext(DatasourceContext) as DatasourceContextValue<Parameters> | null;
	if (!value) {
		throw new Error('useDatasourceStore must be used within DatasourceContextProvider');
	}
	return value;
};
