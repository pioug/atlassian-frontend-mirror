import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

export const extractDueOn = (data: JsonLd.Data.BaseData): string | undefined =>
	extractValue<JsonLd.Data.BaseData, string>(data, 'endTime');
