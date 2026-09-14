import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

type LinkReactCountType =
	| JsonLd.Data.Document
	| JsonLd.Data.Message
	| JsonLd.Data.Project
	| JsonLd.Data.Task;

export const extractReactCount = (data: JsonLd.Data.BaseData): number | undefined =>
	extractValue<LinkReactCountType, number>(data, 'atlassian:reactCount');
