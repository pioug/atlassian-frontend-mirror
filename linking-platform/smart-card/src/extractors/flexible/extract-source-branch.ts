import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractLinkName } from './extract-link-name';

export const extractSourceBranch = (data: JsonLd.Data.SourceCodePullRequest): string | undefined =>
	extractLinkName(data['atlassian:mergeSource'] as JsonLd.Primitives.Link);
