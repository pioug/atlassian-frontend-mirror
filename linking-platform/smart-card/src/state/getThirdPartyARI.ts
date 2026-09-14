import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { fg } from '@atlaskit/platform-feature-flags/fg';

export const getThirdPartyARI = (details?: SmartLinkResponse): string | undefined => {
	if (fg('platform_smartlink_3pclick_analytics')) {
		if (
			details?.entityData &&
			'thirdPartyAri' in details.entityData &&
			details.entityData.thirdPartyAri
		) {
			return details.entityData.thirdPartyAri;
		}

		if (
			details?.data &&
			'atlassian:ari' in details.data &&
			typeof details.data['atlassian:ari'] === 'string'
		) {
			const ari = details.data['atlassian:ari'];
			if (ari.includes('ari:third-party')) {
				return ari;
			}
		}
	}
	return undefined;
};
