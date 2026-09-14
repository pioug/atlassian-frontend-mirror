import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';

export const isEntityPresent = (response?: SmartLinkResponse): boolean =>
	Boolean(extractEntity(response));
