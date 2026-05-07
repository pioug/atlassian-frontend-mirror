import { useMemo } from 'react';

import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import useSocialProof from '../use-social-proof';

export type SocialProofTier = 'low' | 'not-low';

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

const TIER_THRESHOLD = 30;

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

		const tier: SocialProofTier =
			connectedPct !== undefined && connectedPct >= TIER_THRESHOLD ? 'not-low' : 'low';

		return { isTreatment, tier, connectedPct, isLoading };
	}, [isEnabled, isLoading, connectedPct]);
};

export default useSocialProofExperiment;
