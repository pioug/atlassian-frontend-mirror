import { useCallback } from 'react';

import { isEntityPresent } from '@atlaskit/link-extractors';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import type { CardAppearance, CardState } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../../constants';
import { addMetadataToExperience } from '../../analytics';
import useResponse from '../use-response';

export interface ResolveUrlParams {
	appearance?: CardAppearance;
	id?: string;
	isMetadataRequest?: boolean;
	isReloading?: boolean;
	url: string;
}

const useResolve = (): ((params: ResolveUrlParams
) => Promise<void>) => {
	// Request JSON-LD data for the card from ORS, if it has extended
	// its cache lifespan OR there is no data for it currently. Once the data
	// has come back asynchronously, call the useResponse callback to
	// dispatch the resolved action for the card.
	const { store, connections } = useSmartLinkContext();
	const { getState } = store;
	const { handleResolvedLinkResponse, handleResolvedLinkError } = useResponse();

	return useCallback(
		async (params: ResolveUrlParams) => {
			const {
				url,
				isReloading = false,
				isMetadataRequest = false,
				id = '',
				appearance,
			} = params;

			const { details } =
				getState()[url] ||
				({
					status: SmartLinkStatus.Pending,
					details: undefined,
				} as CardState);

			const hasData = !!((details && details.data) || isEntityPresent(details));

			if (isReloading || !hasData || isMetadataRequest) {
				const metadataStatus =
					appearance === 'inline' &&
					!isMetadataRequest &&
					fg('platform_smartlink_inline_resolve_optimization')
						? 'pending'
						: undefined;

				return connections.client
					.fetchData(url, isReloading, appearance)
					.then((response) =>
						handleResolvedLinkResponse(
							url,
							response,
							isReloading,
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
