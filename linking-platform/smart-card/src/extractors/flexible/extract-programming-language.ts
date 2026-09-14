import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';
import type { LinkProgrammingLanguageType } from './utils';

export const extractProgrammingLanguage = (data: JsonLd.Data.BaseData): string | undefined =>
	extractValue<LinkProgrammingLanguageType, string>(data, 'schema:programmingLanguage');
