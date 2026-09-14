import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

export const extractReadTime = (data: JsonLd.Data.BaseData): string | undefined => {
	return extractValue<JsonLd.Data.Document, string>(data, 'atlassian:readTimeInMinutes');
};
