import { SOCIAL_PROOF_TIER_THRESHOLD } from './index';
import type { SocialProofTier } from './index';

export const getSocialProofTier = (connectedPct?: number): SocialProofTier | undefined => {
	if (connectedPct === undefined) {
		return undefined;
	}

	return connectedPct >= SOCIAL_PROOF_TIER_THRESHOLD ? 'not-low' : 'low';
};
