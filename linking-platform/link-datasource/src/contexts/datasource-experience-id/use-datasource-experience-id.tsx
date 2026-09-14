import { useContext } from 'react';

import { DatasourceExperienceIdContext } from './datasource-experience-id-context';

export const useDatasourceExperienceId = (): string => {
	const context = useContext(DatasourceExperienceIdContext);
	if (!context) {
		throw Error('useDatasourceExperienceId() must be wrapped in <DatasourceExperienceIdProvider>');
	}
	return context;
};
