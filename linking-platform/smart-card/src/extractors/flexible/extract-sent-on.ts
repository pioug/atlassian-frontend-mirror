import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

export const extractSentOn = (data: JsonLd.Data.BaseData): string | undefined => {
	return extractValue<JsonLd.Data.Message, string>(data, 'dateSent');
};
