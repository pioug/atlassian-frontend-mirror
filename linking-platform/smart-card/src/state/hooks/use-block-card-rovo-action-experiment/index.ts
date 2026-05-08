import { useMemo } from 'react';

import type { ProductType } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { getIsRovoChatEnabled } from '../../../utils/rovo';
import type { CardActionOptions } from '../../../view/Card/types';
import { getExtensionKey } from '../../helpers';
import { useSmartCardState } from '../../store';
import { JIRA_PRODUCTS } from '../use-rovo-chat/constants';
import useRovoConfig from '../use-rovo-config';

export interface BlockCardRovoActionExperiment {
	/**
	 * True when the user is in the treatment cohort and should see the
	 * inline action nudge UI. All treatment surfaces should gate on this.
	 */
	isEnabled: boolean;
}

const ELIGIBLE_EXTENSION_KEYS = new Set([
	'slack-object-provider',
	'google-object-provider',
	'onedrive-object-provider',
	'github-object-provider',
	'ms-teams-object-provider',
	'gitlab-object-provider',
	'salesforce-object-provider',
]);

const NOT_ENABLED_RESULT: BlockCardRovoActionExperiment = {
	isEnabled: false,
};

/**
 * Returns whether the platform_sl_3p_auth_rovo_block_card_jira or platform_sl_3p_auth_rovo_block_card_confluence experiment
 * is enabled for the current user and link context.
 *
 * All eligibility criteria are consolidated here:
 * 1. Rovo chat must be enabled for the tenant.
 * 2. The consumer must have opted in via actionOptions.rovoChatAction.optIn.
 * 3. The link must support the RovoActions feature.
 * 4. The extension key must be one of the supported options.
 * 5. The experiment value must be true (via tmp-editor-statsig).
 *
 * The extension key is derived from the card store via the resolved URL,
 * so callers don't need to thread it as a prop.
 */
const useBlockCardRovoActionExperiment = (
	url?: string,
	actionOptions?: CardActionOptions,
): BlockCardRovoActionExperiment => {
	const { rovoOptions: rovoConfig, product } = useRovoConfig();
	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig);
	const cardState = useSmartCardState(url ?? '');
	const extensionKey = getExtensionKey(cardState.details);
	const isRovoChatActionOptedIn = actionOptions?.rovoChatAction?.optIn ?? false;

	return useMemo(() => {
		if (!isRovoChatEnabled || !url || !isRovoChatActionOptedIn) {
			return NOT_ENABLED_RESULT;
		}

		if (extensionKey && !ELIGIBLE_EXTENSION_KEYS.has(extensionKey)) {
			return NOT_ENABLED_RESULT;
		}

		const isJiraEnabled =
			!!product &&
			JIRA_PRODUCTS.includes(product) &&
			fg('platform_sl_3p_auth_rovo_block_jira_kill_switch') &&
			expValEquals('platform_sl_3p_auth_rovo_block_card_jira', 'isEnabled', true);

		const isConfluenceEnabled =
			!!product &&
			product === 'CONFLUENCE' &&
			fg('platform_sl_3p_auth_rovo_block_card_kill_switch') &&
			expValEquals('platform_sl_3p_auth_rovo_block_card_confluence', 'isEnabled', true);

		return { isEnabled: isJiraEnabled || isConfluenceEnabled };
	}, [isRovoChatEnabled, extensionKey, url, isRovoChatActionOptedIn, product]);
};

export const isBlockCardRovoActionExperimentEnabled = (product?: ProductType): boolean => {
	const isJiraEnabled =
		!!product &&
		JIRA_PRODUCTS.includes(product) &&
		fg('platform_sl_3p_auth_rovo_block_jira_kill_switch') &&
		expValEqualsNoExposure('platform_sl_3p_auth_rovo_block_card_jira', 'isEnabled', true);

	const isConfluenceEnabled =
		!!product &&
		product === 'CONFLUENCE' &&
		fg('platform_sl_3p_auth_rovo_block_card_kill_switch') &&
		expValEqualsNoExposure('platform_sl_3p_auth_rovo_block_card_confluence', 'isEnabled', true);

	return isJiraEnabled || isConfluenceEnabled;
};

export const useBlockCardRovoActionExperimentNoExposure = (): boolean => {
	const { product } = useRovoConfig();
	return isBlockCardRovoActionExperimentEnabled(product);
};

export default useBlockCardRovoActionExperiment;
