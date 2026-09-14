import { extractEntityIcon } from '@atlaskit/link-extractors/extract-entity-icon';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { CardProviderRenderers } from '@atlaskit/link-provider/types';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { type IconType } from '../../../constants';
import { extractLinkIcon } from './extract-link-icon';

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkIcon = (
	response?: SmartLinkResponse,
	renderers?: CardProviderRenderers,
):
	| {
			icon?: IconType;
			label?: string;
			render: (() => React.ReactNode) | undefined;
			url?: string;
	  }
	| {
			label: string | undefined;
			url: string | undefined;
	  }
	| undefined => {
	if (!response || !response?.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const entityIcon = extractEntityIcon(response);
		if (entityIcon) {
			return entityIcon;
		}
	}

	return extractLinkIcon(response, renderers);
};
