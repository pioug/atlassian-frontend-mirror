import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

type LinkViewCountType = JsonLd.Data.Document | JsonLd.Data.SourceCodeRepository | JsonLd.Data.Task;

export const extractViewCount = (data: JsonLd.Data.BaseData): number | undefined =>
	extractValue<LinkViewCountType, number>(data, 'atlassian:viewCount');
