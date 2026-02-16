import { useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider';

const useRovoConfig = () => {
	const { rovoOptions } = useSmartLinkContext();

	return useMemo(() => rovoOptions, [rovoOptions]);
};

export default useRovoConfig;
