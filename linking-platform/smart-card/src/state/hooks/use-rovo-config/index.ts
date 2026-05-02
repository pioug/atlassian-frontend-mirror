import { useMemo } from 'react';

import { type ProviderProps, useSmartLinkContext } from '@atlaskit/link-provider';

export type RovoConfig = {
	product?: ProviderProps['product'];
	rovoOptions?: ProviderProps['rovoOptions'];
};

const useRovoConfig = (): RovoConfig => {
	const { rovoOptions, product } = useSmartLinkContext();

	return useMemo(() => ({ rovoOptions, product }), [rovoOptions, product]);
};

export default useRovoConfig;
