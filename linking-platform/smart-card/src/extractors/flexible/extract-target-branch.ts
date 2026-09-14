import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractLinkName } from './extract-link-name';

export const extractTargetBranch = (data: JsonLd.Data.SourceCodePullRequest): string | undefined =>
	extractLinkName(data['atlassian:mergeDestination'] as JsonLd.Primitives.Link);
