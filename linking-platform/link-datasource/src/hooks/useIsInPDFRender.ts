import { useMemo } from 'react';

import { useSmartCardContext } from '@atlaskit/link-provider/use-smart-card-context';

export const useIsInPDFRender = (): boolean => {
	const smartCardContext = useSmartCardContext();
	return useMemo(() => !!smartCardContext?.value?.shouldControlDataExport, [smartCardContext]);
};
