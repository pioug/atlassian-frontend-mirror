import { type JsonLd } from '@atlaskit/json-ld-types';

export const extractFileFormat = (jsonLd: JsonLd.Data.Document): string | undefined => {
	return jsonLd['schema:fileFormat'];
};
