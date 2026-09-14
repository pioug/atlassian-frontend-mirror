import { useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import { getUrl } from '@atlaskit/linking-common/store';

import type {
	SmartLinkAnalyticsContextProps,
	SmartLinkAnalyticsContextType,
} from './SmartLinkAnalyticsContext';
import { getSmartLinkAnalyticsContext } from './getSmartLinkAnalyticsContext';

/**
 * Provides an analytics context data to supply attributes to events based on a URL
 * and the link state in the store
 * @deprecated Use useSmartLinkAnalyticsUtils instead
 */
export const useSmartLinkAnalyticsContext = ({
	display,
	id,
	source,
	url,
}: Exclude<SmartLinkAnalyticsContextProps, 'children'>):
	| SmartLinkAnalyticsContextType
	| undefined => {
	const { store } = useSmartLinkContext();
	const state = store ? getUrl(store, url) : undefined;

	return useMemo(() => {
		return getSmartLinkAnalyticsContext({
			display,
			id,
			response: state?.details,
			source,
			status: state?.status,
			url,
			error: state?.error,
		});
	}, [display, id, source, state?.details, state?.status, url, state?.error]);
};
