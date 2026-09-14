import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntity } from '@atlaskit/link-extractors/extract-entity';
import { extractEntityProvider } from '@atlaskit/link-extractors/extract-entity-provider';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { IconType } from '../../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';
import extractProviderIcon from './extract-provider-icon';
import { type IconDescriptor } from './types';

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkProviderIcon = (
	response?: SmartLinkResponse,
): IconDescriptor | undefined => {
	if (!response || !response?.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const provider = extractEntityProvider(response);
		if (!provider) {
			return undefined;
		}

		switch (provider.id) {
			case CONFLUENCE_GENERATOR_ID:
				return {
					icon: IconType.Confluence,
					label: provider.text || 'Confluence',
				};
			case JIRA_GENERATOR_ID:
				return {
					icon: IconType.Jira,
					label: provider.text || 'Jira',
				};
			default:
				const { generator } = response.meta as JsonLd.Meta.BaseMeta;

				if (!generator) {
					return undefined;
				}

				return {
					label: generator.name || extractEntity(response)?.displayName,
					url: generator.icon?.url,
				};
		}
	}

	return extractProviderIcon(response.data as JsonLd.Data.BaseData);
};
