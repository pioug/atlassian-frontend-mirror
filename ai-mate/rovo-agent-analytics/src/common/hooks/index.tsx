import { useEffect } from 'react';

import { CSID_QUERY_PARAM } from '../constants';

let CSID: string | null = null;

/**
 * Hook to get Rovo Agent Create Session ID (CSID) from the query parameters or generate a new one if not found.
 * @returns Rovo Agent CSID as a string.
 */
export const useRovoAgentCSID = () => {
	useEffect(() => {
		if (CSID) {
			return;
		}

		const queryParams = new URLSearchParams(window.location.search);

		const querySessionId = queryParams.get(CSID_QUERY_PARAM);
		CSID = querySessionId ?? (crypto.randomUUID() as string);
	}, []);

	return CSID;
};
