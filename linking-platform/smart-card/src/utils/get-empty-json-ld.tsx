import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { emptyData } from './jsonld';

export const getEmptyJsonLd = (): JsonLd.Data.BaseData => emptyData;
