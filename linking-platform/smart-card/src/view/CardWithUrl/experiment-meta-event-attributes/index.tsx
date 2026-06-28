import type { CardAppearance, CardState } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { useSmartLinkContext } from '../../../state';
import { getExtensionKey } from '../../../state/helpers';
import {
	getEmbedRovoActionsFooterExperimentMeta,
	type EmbedRovoActionsFooterExperimentMeta,
} from '../../../state/hooks/use-embed-rovo-actions-footer-experiment';
import useRovoConfig from '../../../state/hooks/use-rovo-config';
import {
	getSocialProofExperimentMeta,
	getInlineSocialProofExperimentMeta,
	type BlockCardSocialProofExperimentMeta,
	type InlineSocialProofExperimentMeta,
} from '../../../state/hooks/use-social-proof-experiment';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import type { InternalCardActionOptions } from '../../Card/types';

type ExperimentMetaEventAttributes = Partial<
	BlockCardSocialProofExperimentMeta &
		InlineSocialProofExperimentMeta &
		EmbedRovoActionsFooterExperimentMeta
>;

type ExperimentMetaEventAttributesParams = {
	actionOptions?: InternalCardActionOptions;
	appearance: CardAppearance;
	state: CardState;
};

const useExperimentMetaEventAttributes = ({
	actionOptions,
	appearance,
	state,
}: ExperimentMetaEventAttributesParams): ExperimentMetaEventAttributes | undefined => {
	const {
		connections: {
			client: { baseUrlOverride: baseUriWithNoTrailingSlash },
		},
	} = useSmartLinkContext();
	const { rovoOptions, product } = useRovoConfig();
	const { details, status } = state;
	const extensionKey = getExtensionKey(details);

	const embedRovoActionsFooterExperimentMeta =
		appearance === 'embed' && status === 'resolved'
			? getEmbedRovoActionsFooterExperimentMeta({
					extensionKey,
					isRovoChatActionOptedIn: actionOptions?.rovoChatAction?.optIn ?? false,
					isRovoChatEnabled: getIsRovoChatEnabled(rovoOptions),
					product,
				})
			: undefined;

	if (
		!embedRovoActionsFooterExperimentMeta &&
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
		...embedRovoActionsFooterExperimentMeta,
	};

	if (Object.keys(experimentMeta).length > 0) {
		return experimentMeta;
	}
};

export default useExperimentMetaEventAttributes;
