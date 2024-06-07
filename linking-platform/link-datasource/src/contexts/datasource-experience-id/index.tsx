import React, { type PropsWithChildren, useContext, useMemo } from 'react';

import { v4 as uuidv4 } from 'uuid';

const DatasourceExperienceIdContext = React.createContext<string | undefined>(undefined);

const DatasourceExperienceIdProvider = ({ children }: PropsWithChildren<{}>) => {
	const value = useMemo<string>(() => uuidv4(), []);
	return (
		<DatasourceExperienceIdContext.Provider value={value}>
			{children}
		</DatasourceExperienceIdContext.Provider>
	);
};

const useDatasourceExperienceId = () => {
	const context = useContext(DatasourceExperienceIdContext);
	if (!context) {
		throw Error('useDatasourceExperienceId() must be wrapped in <DatasourceExperienceIdProvider>');
	}
	return context;
};

export { DatasourceExperienceIdProvider, useDatasourceExperienceId };
