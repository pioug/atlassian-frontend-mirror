import React, { type PropsWithChildren, useContext, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

const DatasourceExperienceIdContext = React.createContext<string | undefined>(undefined);

const DatasourceExperienceIdProvider = ({ children }: PropsWithChildren<{}>): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const value = useMemo<string>(() => uuidv4(), []);
	return (
		<DatasourceExperienceIdContext.Provider value={value}>
			{children}
		</DatasourceExperienceIdContext.Provider>
	);
};

const useDatasourceExperienceId = (): string => {
	const context = useContext(DatasourceExperienceIdContext);
	if (!context) {
		throw Error('useDatasourceExperienceId() must be wrapped in <DatasourceExperienceIdProvider>');
	}
	return context;
};

export { DatasourceExperienceIdProvider, useDatasourceExperienceId };
