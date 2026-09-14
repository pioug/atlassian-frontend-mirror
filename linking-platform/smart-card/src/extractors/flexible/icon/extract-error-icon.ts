import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { IconType, SmartLinkStatus } from '../../../constants';
import extractProviderIcon from './extract-provider-icon';

export const extractErrorIcon = (
	response?: JsonLd.Response,
	status?: SmartLinkStatus,
):
	| {
			icon: IconType | undefined;
			url: string | undefined;
	  }
	| {
			icon: IconType;
			url?: undefined;
	  } => {
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
