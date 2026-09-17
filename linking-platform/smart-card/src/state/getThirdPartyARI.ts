import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

export const getThirdPartyARI = (details?: SmartLinkResponse): string | undefined => {
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
	return undefined;
};
