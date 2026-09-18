import { useCallback } from 'react';

import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { CardState } from '@atlaskit/linking-common/store';
import type { CardAppearance } from '@atlaskit/linking-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SmartLinkStatus } from '../../../constants';
import { addMetadataToExperience } from '../../analytics/addMetadataToExperience';
import useResponse from '../use-response';

export interface ResolveUrlParams {
	appearance?: CardAppearance;
	id?: string;
	isMetadataRequest?: boolean;
	isReloading?: boolean;
	url: string;
}

const useResolve = (): ((params: ResolveUrlParams) => Promise<void>) => {
	// Request JSON-LD data for the card from ORS, if it has extended
	// its cache lifespan OR there is no data for it currently. Once the data
	// has come back asynchronously, call the useResponse callback to
	// dispatch the resolved action for the card.
	const { store, connections } = useSmartLinkContext();
	const { getState } = store;
	const { handleResolvedLinkResponse, handleResolvedLinkError } = useResponse();

	return useCallback(
		async (params: ResolveUrlParams) => {
			const { url, isReloading = false, isMetadataRequest = false, id = '', appearance } = params;
			const isOptimizedBlockRequest =
				appearance === 'block' && fg('platform_smartlink_inline_resolve_optimization');

			const { details, metadataStatus: currentMetadataStatus } =
				getState()[url] ||
				({
					status: SmartLinkStatus.Pending,
					details: undefined,
				} as CardState);

			const hasData = !!((details && details.data) || isEntityPresent(details));
			const needsOptimizedBlockData =
				isOptimizedBlockRequest && currentMetadataStatus !== 'resolved';

			if (isReloading || !hasData || isMetadataRequest || needsOptimizedBlockData) {
				// A reduced inline response can populate the shared resolver cache before an initial
				// block request completes. Bypass that cache until full metadata has been resolved,
				// then reuse the full block response for subsequent block cards with the same URL.
				const shouldForceFetch = isReloading || needsOptimizedBlockData;
				const metadataStatus =
					appearance === 'inline' &&
					!isMetadataRequest &&
					fg('platform_smartlink_inline_resolve_optimization')
						? 'pending'
						: undefined;

				return connections.client
					.fetchData(url, shouldForceFetch, appearance)
					.then((response) =>
						handleResolvedLinkResponse(
							url,
							response,
							shouldForceFetch,
							isMetadataRequest,
							metadataStatus,
						),
					)
					.catch((error) => handleResolvedLinkError(url, error, undefined, isMetadataRequest));
			} else {
				addMetadataToExperience('smart-link-rendered', id, { cached: true });
			}
		},
		[connections.client, getState, handleResolvedLinkError, handleResolvedLinkResponse],
	);
};

export default useResolve;

export type ResolveFunction = ReturnType<typeof useResolve>;
