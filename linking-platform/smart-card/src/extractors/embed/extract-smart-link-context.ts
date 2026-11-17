import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntityIcon } from '@atlaskit/link-extractors/extract-entity-icon';
import { extractEntityProvider } from '@atlaskit/link-extractors/extract-entity-provider';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { getEmptyJsonLd } from '../../utils/get-empty-json-ld';
import type { ContextViewModel } from '../../view/EmbedCard/types';
import { generateContext } from '../common/context/generateContext';

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export function extractSmartLinkContext(
	response?: SmartLinkResponse,
): ContextViewModel | undefined {
	if (isEntityPresent(response)) {
		const entityProvider = extractEntityProvider(response);
		if (!entityProvider) {
			return undefined;
		}

		const entityIcon = extractEntityIcon(response);
		return {
			...entityProvider,
			icon: entityIcon?.url ?? entityProvider.icon,
			iconLabel: entityIcon?.label ?? entityProvider.iconLabel,
			providerIcon: entityProvider.icon,
			providerIconLabel: entityProvider.iconLabel,
		};
	}

	return generateContext((response?.data as JsonLd.Data.BaseData) || getEmptyJsonLd());
}
