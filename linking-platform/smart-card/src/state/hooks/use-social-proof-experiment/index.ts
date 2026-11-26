import { useMemo } from 'react';

import useSocialProof from '../use-social-proof';
import { getSocialProofTier } from './getSocialProofTier';

export type SocialProofTier = 'low' | 'not-low';

// Stable key for existing smart link analytics.
export const SOCIAL_PROOF_3P_UNAUTH_BLOCK_EXPERIMENT_KEY = 'social_proof_3p_unauth_block_exp';

export type SocialProofExperimentMetadata = {
	isEligible: boolean;
	tier?: SocialProofTier;
};

export type BlockCardSocialProofExperimentMeta = {
	[SOCIAL_PROOF_3P_UNAUTH_BLOCK_EXPERIMENT_KEY]: SocialProofExperimentMetadata;
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
	 * True when social proof data is ready and the UI can render it.
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

/**
 * Returns eligibility and tier for social proof in unauthorised block cards.
 *
 * Delegates data-fetching to `useSocialProof` (Sasha's shared service layer),
 * which handles cloudId resolution, TAP trait fetch, localStorage caching,
 * request deduping, and sync reads.
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

		const isTreatment = isEnabled && !isLoading && hasSocialProofData;

		const tier = getSocialProofTier(connectedPct) ?? 'low';

		return { isTreatment, tier, connectedPct, isLoading };
	}, [isEnabled, isLoading, connectedPct]);
};

export default useSocialProofExperiment;
