import { useCallback, useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import { getUrl } from '@atlaskit/linking-common/store';

import type {
	SmartLinkAnalyticsContextProps,
	SmartLinkAnalyticsContextType,
} from './SmartLinkAnalyticsContext';
import { getSmartLinkAnalyticsContext } from './getSmartLinkAnalyticsContext';

type GetByUrlFn = (
	url: string,
	props: Omit<SmartLinkAnalyticsContextProps, 'children' | 'url'>,
) => SmartLinkAnalyticsContextType;

type UseSmartLinkAnalyticsUtilsReturn = {
	getByUrl: GetByUrlFn;
};

/**
 * Provides an analytics context data to supply attributes to events based on a URL
 * and the link state in the store
 */
export const useSmartLinkAnalyticsUtils = (): UseSmartLinkAnalyticsUtilsReturn => {
	const { store } = useSmartLinkContext();

	const getByUrl: GetByUrlFn = useCallback(
		(url, props) => {
			const state = store ? getUrl(store, url) : undefined;
			return getSmartLinkAnalyticsContext({
				display: props?.display,
				id: props?.id,
				response: state?.details,
				source: props?.source,
				status: state?.status,
				url,
				error: state?.error,
			});
		},
		[store],
	);
	return useMemo(() => ({ getByUrl }), [getByUrl]);
};
