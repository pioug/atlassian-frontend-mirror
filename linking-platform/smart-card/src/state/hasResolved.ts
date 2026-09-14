import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { isAccessible } from './isAccessible';
import { isVisible } from './isVisible';

export const hasResolved = (details?: JsonLd.Response): boolean | undefined =>
	details && isAccessible(details) && isVisible(details);
