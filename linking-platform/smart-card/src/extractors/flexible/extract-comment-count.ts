import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';
import type { LinkCommentType } from './utils';

export const extractCommentCount = (data: JsonLd.Data.BaseData): number | undefined =>
	extractValue<LinkCommentType, number>(data, 'schema:commentCount');
