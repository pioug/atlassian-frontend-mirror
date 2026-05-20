import { useMemo } from 'react';

import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	getCurrentSiteCloudIdSync,
} from '../../services/current-site-cloud-id';
import {
	getProviderPctMapSync,
	SOCIAL_PROOF_TRAIT_NAME,
} from '../../services/personalization';
import useSocialProof from '../use-social-proof';

export type SocialProofTier = 'low' | 'not-low';

export const SOCIAL_PROOF_3P_UNAUTH_BLOCK_EXPERIMENT_KEY = 'social_proof_3p_unauth_block_exp';
export const INLINE_SOCIAL_PROOF_EXPERIMENT_KEY = 'platform_sl_3p_preauth_social_proof_inline_cta';

type SocialProofExperimentMetadata = {
	isEligible: boolean;
	tier?: SocialProofTier;
};

export type BlockCardSocialProofExperimentMeta = {
	[SOCIAL_PROOF_3P_UNAUTH_BLOCK_EXPERIMENT_KEY]: SocialProofExperimentMetadata;
};

export type InlineSocialProofExperimentMeta = {
	[INLINE_SOCIAL_PROOF_EXPERIMENT_KEY]: SocialProofExperimentMetadata;
};

export interface SocialProofExperiment {
	/**
	 * The raw connected users percentage for the current provider, or undefined if not loaded/available.
	 */
	connectedPct: number | undefined;
	/**
	 * True while the trait is being fetched.
	 */
	isLoading: boolean;
	/**
	 * True when the user is in the treatment cohort and should see the
	 * social proof UI. All treatment surfaces should gate on this.
	 */
	isTreatment: boolean;
	/**
	 * The social proof tier based on the tenant's 3P connected users percentage.
	 * 'low' when tenant 3P adoption is <30%, 'not-low' for >=30%.
	 * Only meaningful when isTreatment is true.
	 */
	tier: SocialProofTier;
}

export const SOCIAL_PROOF_TIER_THRESHOLD = 30;

export const getSocialProofTier = (connectedPct?: number): SocialProofTier | undefined => {
	if (connectedPct === undefined) {
		return undefined;
	}

	return connectedPct >= SOCIAL_PROOF_TIER_THRESHOLD ? 'not-low' : 'low';
};

const getSocialProofExperimentMetadata = ({
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
	const providerPctMap = getProviderPctMapSync(cloudId, SOCIAL_PROOF_TRAIT_NAME);
	const tier = getSocialProofTier(providerPctMap?.[extensionKey]);

	return {
		isEligible: tier !== undefined,
		...(tier ? { tier } : {}),
	};
};

export const getSocialProofExperimentMeta = (params: {
	baseUriWithNoTrailingSlash?: string;
	extensionKey?: string;
}): BlockCardSocialProofExperimentMeta => ({
	[SOCIAL_PROOF_3P_UNAUTH_BLOCK_EXPERIMENT_KEY]: getSocialProofExperimentMetadata(params),
});

export const getInlineSocialProofExperimentMeta = (params: {
	baseUriWithNoTrailingSlash?: string;
	extensionKey?: string;
}): InlineSocialProofExperimentMeta => ({
	[INLINE_SOCIAL_PROOF_EXPERIMENT_KEY]: getSocialProofExperimentMetadata(params),
});

/**
 * Returns enrollment and treatment state for the social proof unauth block card experiment.
 *
 * Delegates data-fetching to `useSocialProof` (Sasha's shared service layer),
 * which handles cloudId resolution, TAP trait fetch, localStorage caching,
 * request deduping, and sync reads.
 *
 * This hook adds the experiment/cohort layer on top:
 * - Only fires exposure (via editorExperiment) when data has loaded.
 * - Derives `tier` and `isTreatment` for rendering decisions.
 *
 * Expected to be called only inside the fg-enabled branch (via componentWithFG).
 *
 * @param extensionKey - The extensionKey of the current 3P provider (e.g. 'google-object-provider').
 */
const useSocialProofExperiment = (
	extensionKey?: string,
	baseUriWithNoTrailingSlash = '',
): SocialProofExperiment => {
	const { connectedPct, isEnabled, isLoading } = useSocialProof(
		extensionKey,
		true,
		baseUriWithNoTrailingSlash,
	);

	return useMemo(() => {
		const hasSocialProofData = connectedPct !== undefined;

		// Only fire exposure when data has loaded (prevents exposure inflation)
		const isTreatment =
			isEnabled && !isLoading && hasSocialProofData
				? editorExperiment('social_proof_3p_unauth_block_exp', true)
				: false;

		const tier = getSocialProofTier(connectedPct) ?? 'low';

		return { isTreatment, tier, connectedPct, isLoading };
	}, [isEnabled, isLoading, connectedPct]);
};

export default useSocialProofExperiment;
