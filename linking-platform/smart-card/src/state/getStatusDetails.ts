import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const getStatusDetails = (details?: JsonLd.Response): string | undefined => {
	return details?.meta?.requestAccess?.accessType;
};
