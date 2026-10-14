import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { CardState } from '@atlaskit/linking-common/store';
import type { CardAppearance } from '@atlaskit/linking-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getExtensionKey } from '../../../state/getExtensionKey';
import type { BlockCardSocialProofExperimentMeta } from '../../../state/hooks/use-social-proof-experiment';
import { getSocialProofExperimentMeta } from '../../../state/hooks/use-social-proof-experiment/getSocialProofExperimentMeta';

type ExperimentMetaEventAttributes = Partial<BlockCardSocialProofExperimentMeta>;

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

	const blockSocialProofExperimentMeta =
		appearance === 'block' && status === 'unauthorized' && fg('social-proof-3p-unauth-block-fg')
			? getSocialProofExperimentMeta({
					extensionKey,
					baseUriWithNoTrailingSlash,
				})
			: undefined;

	const experimentMeta = {
		...blockSocialProofExperimentMeta,
	};

	if (Object.keys(experimentMeta).length > 0) {
		return experimentMeta;
	}
};

export default useExperimentMetaEventAttributes;
