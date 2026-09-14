import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { type DestinationProduct } from '../utils/analytics/types';

export const getProduct = (details?: JsonLd.Response): DestinationProduct | string | undefined =>
	details?.meta?.product;
