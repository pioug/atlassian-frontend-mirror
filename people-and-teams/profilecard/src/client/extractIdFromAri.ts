/// <reference types="node" />
// for typing `process`

export const extractIdFromAri = (ari: string): string => {
	const slashPos = ari.indexOf('/');
	const id = ari.slice(slashPos + 1);
	return id;
};
