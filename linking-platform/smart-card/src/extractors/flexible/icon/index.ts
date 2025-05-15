import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractEntityIcon, isEntityPresent } from '@atlaskit/link-extractors';
import { type CardProviderRenderers } from '@atlaskit/link-provider';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

import { IconType, SmartLinkStatus } from '../../../constants';

import extractIconRenderer from './extract-icon-renderer';
import extractJsonldDataIcon from './extract-jsonld-data-icon';
import extractProviderIcon from './extract-provider-icon';

export const extractLinkIcon = (response: JsonLd.Response, renderers?: CardProviderRenderers) => {
	const data = response.data as JsonLd.Data.BaseData;
	const render = extractIconRenderer(data, renderers);

	return { ...extractJsonldDataIcon(data), render };
};

export const extractErrorIcon = (response?: JsonLd.Response, status?: SmartLinkStatus) => {
	// Try to get provider icon first.
	if (response) {
		const data = response.data as JsonLd.Data.BaseData;
		const { icon, url } = extractProviderIcon(data) || {};

		if (icon || url) {
			return { icon, url };
		}
	}

	// Otherwise, use fallback icon for each status.
	switch (status) {
		case SmartLinkStatus.Forbidden:
		case SmartLinkStatus.Unauthorized:
			return { icon: IconType.Forbidden };
		case SmartLinkStatus.NotFound:
			return { icon: IconType.Error };
		case SmartLinkStatus.Errored:
		case SmartLinkStatus.Fallback:
		default:
			return { icon: IconType.Default };
	}
};

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkIcon = (
	response?: SmartLinkResponse,
	renderers?: CardProviderRenderers,
) => {
	if (!response || !response?.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntityIcon(response);
	}

	return extractLinkIcon(response, renderers);
};
