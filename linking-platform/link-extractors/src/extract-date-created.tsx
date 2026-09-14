import type { LinkTypeCreated } from './types';

export const extractDateCreated = (jsonLd: LinkTypeCreated): string | undefined => {
	if (jsonLd['schema:dateCreated']) {
		return jsonLd['schema:dateCreated'];
	}
	return undefined;
};
