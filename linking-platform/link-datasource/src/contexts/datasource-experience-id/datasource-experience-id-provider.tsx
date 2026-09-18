import React, { type PropsWithChildren, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

import { DatasourceExperienceIdContext } from './datasource-experience-id-context';

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
