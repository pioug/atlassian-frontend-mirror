import { useMemo } from 'react';

import { useSmartCardContext } from '@atlaskit/link-provider';

export const useIsInPDFRender = (): boolean => {
	const smartCardContext = useSmartCardContext();
	return useMemo(() => !!smartCardContext?.value?.shouldControlDataExport, [smartCardContext]);
};
