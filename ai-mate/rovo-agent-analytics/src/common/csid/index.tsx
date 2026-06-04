import { useMemo, useState } from 'react';

import { CSID_QUERY_PARAM } from '../CSID_QUERY_PARAM';

let CACHED_CSID: string | null = null;

const generateCSID = () => {
	return crypto.randomUUID();
};

/**
 * Hook to manage CSID state for entry point components.
 * The returned csid is used in href attributes and by trackCreateSessionStart.
 * After trackCreateSessionStart fires, it calls refresh() to generate a new CSID
 * for the next session — the component re-renders and the href updates.
 */
export const useRovoAgentCSID = (): readonly [
	{
		readonly csid: string | null;
		readonly globalCSID: string | null;
	},
	{
		refresh: () => `${string}-${string}-${string}-${string}-${string}`;
	},
] => {
	const [csid, setCSID] = useState<string | null>(CACHED_CSID || generateCSID());

	const globalCSID = useMemo(() => {
		const queryParams = new URLSearchParams(window.location.search);
		return queryParams.get(CSID_QUERY_PARAM);
	}, []);

	const actions = useMemo(() => {
		return {
			refresh: () => {
				const newCSID = generateCSID();

				setCSID(newCSID);
				CACHED_CSID = newCSID;
				return newCSID;
			},
		};
	}, []);

	return [
		{
			csid, // generated CSID to be used in href and createFlowStart events
			globalCSID, // CSID from the URL query parameter
		},
		actions,
	] as const;
};
