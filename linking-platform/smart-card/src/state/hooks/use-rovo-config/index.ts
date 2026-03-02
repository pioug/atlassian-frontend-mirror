import { useMemo } from 'react';

import { type ProviderProps, useSmartLinkContext } from '@atlaskit/link-provider';

export type RovoConfig = ProviderProps['rovoOptions'];

const useRovoConfig = (): RovoConfig => {
	const { rovoOptions } = useSmartLinkContext();

	return useMemo(() => rovoOptions, [rovoOptions]);
};

export default useRovoConfig;
