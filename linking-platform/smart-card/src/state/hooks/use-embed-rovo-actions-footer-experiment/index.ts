import { useMemo } from 'react';

import type { ProductType } from '@atlaskit/linking-common/types';

import type { RovoConfig } from '../../../state/hooks/use-rovo-config';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import type { CardActionOptions } from '../../../view/Card/types';
import { getExtensionKey } from '../../getExtensionKey';
import { useSmartCardState } from '../../store';
import { isEligibleEmbedRovoActionsFooterExtensionKey } from './isEligibleEmbedRovoActionsFooterExtensionKey';
import { isEmbedRovoActionsFooterExperimentEnabled } from './isEmbedRovoActionsFooterExperimentEnabled';

export const EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY = 'platform_sl_3p_auth_rovo_embed_footer_exp';

type EmbedRovoActionsFooterExperimentMetadata = {
	isEligible: boolean;
	isTreatment?: boolean;
};

export type EmbedRovoActionsFooterExperimentMeta = {
	[EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY]: EmbedRovoActionsFooterExperimentMetadata;
};

export interface EmbedRovoActionsFooterExperiment {
	isEnabled: boolean;
}

const NOT_ENABLED_RESULT: EmbedRovoActionsFooterExperiment = {
	isEnabled: false,
};

const useEmbedRovoActionsFooterExperiment = (
	url?: string,
	actionOptions?: CardActionOptions,
	rovoOptions?: RovoConfig['rovoOptions'],
	product?: ProductType,
): EmbedRovoActionsFooterExperiment => {
	const isRovoChatEnabled = getIsRovoChatEnabled(rovoOptions);
	const cardState = useSmartCardState(url ?? '');
	const extensionKey = getExtensionKey(cardState.details);
	const isRovoChatActionOptedIn = actionOptions?.rovoChatAction?.optIn ?? false;

	return useMemo(() => {
		if (!isRovoChatEnabled || !url || !isRovoChatActionOptedIn || !extensionKey) {
			return NOT_ENABLED_RESULT;
		}

		if (!isEligibleEmbedRovoActionsFooterExtensionKey(extensionKey)) {
			return NOT_ENABLED_RESULT;
		}

		return { isEnabled: isEmbedRovoActionsFooterExperimentEnabled(product) };
	}, [isRovoChatEnabled, extensionKey, url, isRovoChatActionOptedIn, product]);
};

export default useEmbedRovoActionsFooterExperiment;
