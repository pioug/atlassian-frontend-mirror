import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { type DestinationSubproduct } from '../utils/analytics/types';

export const getSubproduct = (
	details?: JsonLd.Response,
): DestinationSubproduct | string | undefined => details?.meta?.subproduct;
