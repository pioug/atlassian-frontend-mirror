import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractValue } from './extract-value';
import type { LinkSubscriberType } from './utils';

export const extractSubscriberCount = (data: JsonLd.Data.BaseData): number | undefined =>
	extractValue<LinkSubscriberType, number>(data, 'atlassian:subscriberCount');
