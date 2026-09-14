import { getCurrentSiteCloudIdSync } from '../../services/current-site-cloud-id/getCurrentSiteCloudIdSync';
import { personalizationConstants } from '../../services/personalization/constants';
import { getProviderPctMapSync } from '../../services/personalization/getProviderPctMapSync';
import { getSocialProofTier } from './getSocialProofTier';
import type { SocialProofExperimentMetadata } from './index';

export const getSocialProofExperimentMetadata = ({
	extensionKey,
	baseUriWithNoTrailingSlash = '',
}: {
	baseUriWithNoTrailingSlash?: string;
	extensionKey?: string;
}): SocialProofExperimentMetadata => {
	if (!extensionKey) {
		return { isEligible: false };
	}

	const cloudId = getCurrentSiteCloudIdSync(baseUriWithNoTrailingSlash);
	const providerPctMap = getProviderPctMapSync(
		cloudId,
		personalizationConstants.SOCIAL_PROOF_TRAIT_NAME,
	);
	const tier = getSocialProofTier(providerPctMap?.[extensionKey]);

	return {
		isEligible: tier !== undefined,
		...(tier ? { tier } : {}),
	};
};
