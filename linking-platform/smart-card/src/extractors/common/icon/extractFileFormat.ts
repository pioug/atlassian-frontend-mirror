import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractFileFormat = (jsonLd: JsonLd.Data.Document): string | undefined => {
	return jsonLd['schema:fileFormat'];
};
