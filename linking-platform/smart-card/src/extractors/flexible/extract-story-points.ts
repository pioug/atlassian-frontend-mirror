import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

export const extractStoryPoints = (data: JsonLd.Data.BaseData): number | undefined => {
	return extractValue<JsonLd.Data.Task, number>(data, 'atlassian:storyPoints');
};
