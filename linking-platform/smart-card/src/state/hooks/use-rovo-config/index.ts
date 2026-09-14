import { useMemo } from 'react';

import type { CardProviderProps as ProviderProps } from '@atlaskit/link-provider/types';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';

export type RovoConfig = {
	product?: ProviderProps['product'];
	rovoOptions?: ProviderProps['rovoOptions'];
};

const useRovoConfig = (): RovoConfig => {
	const { rovoOptions, product } = useSmartLinkContext();

	return useMemo(() => ({ rovoOptions, product }), [rovoOptions, product]);
};

export default useRovoConfig;
