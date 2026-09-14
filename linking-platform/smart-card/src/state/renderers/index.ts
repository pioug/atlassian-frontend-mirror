import { useMemo } from 'react';

import type { CardContext } from '@atlaskit/link-provider/types';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';

export const useSmartLinkRenderers = (): CardContext['renderers'] | undefined => {
	const context = useSmartLinkContext();
	let renderers = context?.renderers;
	renderers = useMemo(() => renderers, [renderers]);

	return renderers;
};
