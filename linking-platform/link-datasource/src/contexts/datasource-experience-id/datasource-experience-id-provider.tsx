import React, { type PropsWithChildren, useMemo } from 'react';
import { DatasourceExperienceIdContext } from './datasource-experience-id-context';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

export const DatasourceExperienceIdProvider = ({
	children,
}: PropsWithChildren<{}>): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const value = useMemo<string>(() => uuidv4(), []);
	return (
		<DatasourceExperienceIdContext.Provider value={value}>
			{children}
		</DatasourceExperienceIdContext.Provider>
	);
};
