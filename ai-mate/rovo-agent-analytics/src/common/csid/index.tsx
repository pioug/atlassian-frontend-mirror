import { useEffect, useMemo, useState } from 'react';

import { CSID_QUERY_PARAM } from '../constants';

let CACHED_CSID: string | null = null;

const generateCSID = () => {
	return crypto.randomUUID();
};

const retrieveCSID = () => {
	if (CACHED_CSID) {
		return CACHED_CSID;
	}

	const queryParams = new URLSearchParams(window.location.search);

	const querySessionId = queryParams.get(CSID_QUERY_PARAM);
	return querySessionId ?? generateCSID();
};

/**
 * Hook to get Rovo Agent Create Session ID (CSID) from the query parameters or generate a new one if not found.
 * @returns Rovo Agent CSID as a string.
 */
export const useRovoAgentCSID = () => {
	const [CSID, setCSID] = useState<string | null>(retrieveCSID());

	const actions = useMemo(() => {
		return {
			refresh: () => {
				const newCSID = generateCSID();

				setCSID(newCSID);
			},
			clear: () => {
				// remove CSID query parameter
				const url = new URL(window.location.href);

				url.searchParams.delete(CSID_QUERY_PARAM);
				window.history.replaceState({}, '', url.toString());

				// reset state
				setCSID(null);
			},
		};
	}, []);

	useEffect(() => {
		// sync cache on state change
		CACHED_CSID = CSID;
	}, [CSID]);

	return [CSID, actions] as const;
};
