import { useCallback } from 'react';
import { addMetadataToExperience } from '../../analytics';
import type { CardState } from '@atlaskit/linking-common';
import { SmartLinkStatus } from '../../../constants';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import useResponse from '../use-response';

const useResolve = () => {
	// Request JSON-LD data for the card from ORS, if it has extended
	// its cache lifespan OR there is no data for it currently. Once the data
	// has come back asynchronously, call the useResponse callback to
	// dispatch the resolved action for the card.
	const { store, connections } = useSmartLinkContext();
	const { getState } = store;
	const { handleResolvedLinkResponse, handleResolvedLinkError } = useResponse();

	return useCallback(
		async (url: string, isReloading = false, isMetadataRequest = false, id = '') => {
			const { details } =
				getState()[url] ||
				({
					status: SmartLinkStatus.Pending,
					details: undefined,
				} as CardState);
			const hasData = !!(details && details.data);

			if (isReloading || !hasData || isMetadataRequest) {
				return connections.client
					.fetchData(url, isReloading)
					.then((response) =>
						handleResolvedLinkResponse(url, response, isReloading, isMetadataRequest),
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
