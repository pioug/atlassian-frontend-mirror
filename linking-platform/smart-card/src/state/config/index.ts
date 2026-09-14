import type { CardContext } from '@atlaskit/link-provider/types';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';

export const useSmartLinkConfig = (): CardContext['config'] | undefined => {
	const context = useSmartLinkContext();
	if (context) {
		return context.config;
	}
	return undefined;
};
