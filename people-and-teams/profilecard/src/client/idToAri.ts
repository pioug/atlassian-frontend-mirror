/// <reference types="node" />
// for typing `process`

/**
 * @deprecated Use idToAriSafe instead
 */
export const idToAri = (teamId: string): string => {
	return `ari:cloud:identity::team/${teamId}`;
};
