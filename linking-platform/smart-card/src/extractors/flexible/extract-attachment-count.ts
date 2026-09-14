import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';
import type { LinkAttachmentType } from './utils';

export const extractAttachmentCount = (data: JsonLd.Data.BaseData): number | undefined =>
	extractValue<LinkAttachmentType, number>(data, 'atlassian:attachmentCount');
