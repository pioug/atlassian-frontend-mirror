import { getSocialProofExperimentMetadata } from './getSocialProofExperimentMetadata';
import { SOCIAL_PROOF_3P_UNAUTH_BLOCK_EXPERIMENT_KEY } from './index';
import type { BlockCardSocialProofExperimentMeta } from './index';

export const getSocialProofExperimentMeta = (params: {
	baseUriWithNoTrailingSlash?: string;
	extensionKey?: string;
}): BlockCardSocialProofExperimentMeta => ({
	[SOCIAL_PROOF_3P_UNAUTH_BLOCK_EXPERIMENT_KEY]: getSocialProofExperimentMetadata(params),
});
