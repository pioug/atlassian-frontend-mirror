import { useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { CardAction } from '../../../constants';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import type { CardActionOptions } from '../../../view/Card/types';
import { getExtensionKey } from '../../getExtensionKey';
import { useSmartCardState } from '../../store';
import useRovoConfig from '../use-rovo-config';

const ELIGIBLE_EXTENSION_KEYS = new Set([
	'slack-object-provider',
	'google-object-provider',
	'onedrive-object-provider',
	'github-object-provider',
	'ms-teams-object-provider',
	'gitlab-object-provider',
	'salesforce-object-provider',
]);

/**
 * Returns whether the rovo actions are enabled for the current user and link context.
 *
 * All eligibility criteria are consolidated here:
 * 1. Rovo chat must be enabled for the tenant.
 * 2. The consumer must have opted in via actionOptions.rovoChatAction.optIn.
 * 3. The link must support the RovoActions feature.
 * 4. The extension key must be one of the supported options.
 * 5. The consumer must not hide the Rovo chat action via actionOptions.hide / exclude
 *    (behind platform_sl_block_card_rovo_action_respect_hide).
 *
 * The extension key is derived from the card store via the resolved URL,
 * so callers don't need to thread it as a prop.
 */
const useBlockCardRovoAction = (url?: string, actionOptions?: CardActionOptions): boolean => {
	const { rovoOptions: rovoConfig, product } = useRovoConfig();
	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig);
	const cardState = useSmartCardState(url ?? '');
	const extensionKey = getExtensionKey(cardState.details);
	const isRovoChatActionOptedIn = actionOptions?.rovoChatAction?.optIn ?? false;
	const isRovoChatActionHidden = fg('platform_sl_block_card_rovo_action_respect_hide')
		? !canShowAction(CardAction.RovoChatAction, actionOptions)
		: false;

	return useMemo(() => {
		if (!isRovoChatEnabled || !url || !isRovoChatActionOptedIn || isRovoChatActionHidden) {
			return false;
		}

		if (extensionKey && !ELIGIBLE_EXTENSION_KEYS.has(extensionKey)) {
			return false;
		}

		return !!product && product === 'CONFLUENCE';
	}, [
		isRovoChatEnabled,
		extensionKey,
		url,
		isRovoChatActionOptedIn,
		isRovoChatActionHidden,
		product,
	]);
};

export default useBlockCardRovoAction;
