import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntityProvider } from './extract-entity-provider';
import { extractProvider } from './extract-provider';
import { isEntityPresent } from './is-entity-present';
import type { LinkProvider } from './types';

export const extractSmartLinkProvider = (
	response?: SmartLinkResponse,
): LinkProvider | undefined => {
	if (isEntityPresent(response)) {
		return extractEntityProvider(response);
	}

	return response?.data && extractProvider(response?.data as JsonLd.Data.BaseData);
};
