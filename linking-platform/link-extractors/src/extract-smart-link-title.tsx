import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';
import { extractTitle } from './extract-title';
import { isEntityPresent } from './is-entity-present';

/*
 * ###########################################################################
 * Smart Link response extraction
 * ###########################################################################
 *
 * High-level extractors for SmartLinkResponse objects, preferring entity data with JSON-LD fallbacks.
 */
export const extractSmartLinkTitle = (
	response?: SmartLinkResponse,
	removeTextHighlightingFromTitle?: boolean,
): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.displayName;
	}
	return extractTitle(response?.data as JsonLd.Data.BaseData, removeTextHighlightingFromTitle);
};
