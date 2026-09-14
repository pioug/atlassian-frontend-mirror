import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

export const extractAppliedToComponentsCount = (data: JsonLd.Data.BaseData): number | undefined =>
	extractValue<JsonLd.Data.Project, number>(data, 'atlassian:appliedToComponentsCount');
