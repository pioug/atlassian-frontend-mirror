import type { CardAppearance, CardState } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { useSmartLinkContext } from '../../../state';
import { getExtensionKey } from '../../../state/helpers';
import {
	getSocialProofExperimentMeta,
	getInlineSocialProofExperimentMeta,
	type BlockCardSocialProofExperimentMeta,
	type InlineSocialProofExperimentMeta,
} from '../../../state/hooks/use-social-proof-experiment';

type ExperimentMetaEventAttributes = Partial<
	BlockCardSocialProofExperimentMeta & InlineSocialProofExperimentMeta
>;

type ExperimentMetaEventAttributesParams = {
	appearance: CardAppearance;
	state: CardState;
};

const useExperimentMetaEventAttributes = ({
	appearance,
	state,
}: ExperimentMetaEventAttributesParams): ExperimentMetaEventAttributes | undefined => {
	const {
		connections: {
			client: { baseUrlOverride: baseUriWithNoTrailingSlash },
		},
	} = useSmartLinkContext();
	const { details, status } = state;
	const extensionKey = getExtensionKey(details);

	if (
		!fg('social-proof-3p-unauth-block-fg') &&
		!fg('platform_sl_3p_preauth_soc_proof_inline_killswitch')
	) {
		return undefined;
	}

	const blockSocialProofExperimentMeta =
		appearance === 'block' && status === 'unauthorized' && fg('social-proof-3p-unauth-block-fg')
			? getSocialProofExperimentMeta({
					extensionKey,
					baseUriWithNoTrailingSlash,
				})
			: undefined;

	const inlineSocialProofExperimentMeta =
		appearance === 'inline' &&
		status === 'unauthorized' &&
		fg('platform_sl_3p_preauth_soc_proof_inline_killswitch')
			? getInlineSocialProofExperimentMeta({
					extensionKey,
					baseUriWithNoTrailingSlash,
				})
			: undefined;

	const experimentMeta = {
		...blockSocialProofExperimentMeta,
		...inlineSocialProofExperimentMeta,
	};

	if (Object.keys(experimentMeta).length > 0) {
		return experimentMeta;
	}
};

export default useExperimentMetaEventAttributes;
