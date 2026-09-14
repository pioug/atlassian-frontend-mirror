import { getSocialProofExperimentMetadata } from './getSocialProofExperimentMetadata';
import { INLINE_SOCIAL_PROOF_EXPERIMENT_KEY } from './index';
import type { InlineSocialProofExperimentMeta } from './index';

export const getInlineSocialProofExperimentMeta = (params: {
	baseUriWithNoTrailingSlash?: string;
	extensionKey?: string;
}): InlineSocialProofExperimentMeta => ({
	[INLINE_SOCIAL_PROOF_EXPERIMENT_KEY]: getSocialProofExperimentMetadata(params),
});
