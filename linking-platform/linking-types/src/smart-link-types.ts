import { type JsonLd } from '@atlaskit/json-ld-types';

import type { EntityType } from './entity-types';

export type SmartLinkResponse = JsonLd.Response & { nounData?: EntityType };
