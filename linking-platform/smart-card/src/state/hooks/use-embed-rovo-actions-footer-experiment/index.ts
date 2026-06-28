import { useMemo } from 'react';

import type { ProductType } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { RovoConfig } from '../../../state/hooks/use-rovo-config';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import type { CardActionOptions } from '../../../view/Card/types';
import { getExtensionKey } from '../../helpers';
import { useSmartCardState } from '../../store';

const EMBED_ROVO_ACTIONS_FOOTER_ELIGIBLE_EXTENSION_KEYS: ReadonlySet<string> = new Set([
	'google-object-provider',
	'onedrive-object-provider',
	'github-object-provider',
	'gitlab-object-provider',
]);

const isEligibleEmbedRovoActionsFooterExtensionKey = (extensionKey?: string): boolean =>
	extensionKey !== undefined && EMBED_ROVO_ACTIONS_FOOTER_ELIGIBLE_EXTENSION_KEYS.has(extensionKey);

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

export const isEmbedRovoActionsFooterExperimentEnabled = (product?: ProductType): boolean => {
	return (
		product === 'CONFLUENCE' &&
		fg('platform_sl_3p_auth_rovo_embed_footer_kill_switch') &&
		expValEquals(EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY, 'isEnabled', true)
	);
};

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
