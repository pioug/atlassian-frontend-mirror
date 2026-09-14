import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';

type LinkVoteCountType =
	| JsonLd.Data.Document
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task;

export const extractVoteCount = (data: JsonLd.Data.BaseData): number | undefined =>
	extractValue<LinkVoteCountType, number>(data, 'atlassian:voteCount');
