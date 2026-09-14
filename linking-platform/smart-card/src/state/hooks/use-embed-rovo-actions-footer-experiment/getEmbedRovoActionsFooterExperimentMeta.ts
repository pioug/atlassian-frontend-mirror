import type { ProductType } from '@atlaskit/linking-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY } from './index';
import type { EmbedRovoActionsFooterExperimentMeta } from './index';
import { isEligibleEmbedRovoActionsFooterExtensionKey } from './isEligibleEmbedRovoActionsFooterExtensionKey';

const isEmbedRovoActionsFooterKillSwitchEnabled = (product?: ProductType): boolean => {
	return product === 'CONFLUENCE' && fg('platform_sl_3p_auth_rovo_embed_footer_kill_switch');
};

const isEmbedRovoActionsFooterExperimentEnabledNoExposure = (product?: ProductType): boolean => {
	return (
		isEmbedRovoActionsFooterKillSwitchEnabled(product) &&
		expValEqualsNoExposure(EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY, 'isEnabled', true)
	);
};

export const getEmbedRovoActionsFooterExperimentMeta = ({
	extensionKey,
	isRovoChatActionOptedIn,
	isRovoChatEnabled,
	product,
}: {
	extensionKey?: string;
	isRovoChatActionOptedIn: boolean;
	isRovoChatEnabled: boolean;
	product?: ProductType;
}): EmbedRovoActionsFooterExperimentMeta | undefined => {
	const isEligible =
		isEmbedRovoActionsFooterKillSwitchEnabled(product) &&
		isRovoChatEnabled &&
		isRovoChatActionOptedIn &&
		isEligibleEmbedRovoActionsFooterExtensionKey(extensionKey);

	if (!isEligible) {
		return undefined;
	}

	return {
		[EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY]: {
			isEligible: true,
			isTreatment: isEmbedRovoActionsFooterExperimentEnabledNoExposure(product),
		},
	};
};
