import { useMemo } from 'react';

import { getIsRovoChatEnabled } from '../../../utils/rovo';
import type { CardActionOptions } from '../../../view/Card/types';
import { getExtensionKey } from '../../getExtensionKey';
import { useSmartCardState } from '../../store';
import useRovoConfig from '../use-rovo-config';

export interface InlineTailoredAction {
	/**
	 * True when the user is in the treatment cohort and should see the
	 * inline action button UI. All treatment surfaces should gate on this.
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

const NOT_ENABLED_RESULT: InlineTailoredAction = {
	isEnabled: false,
};

/**
 * Returns whether the tailored inline actions
 * are enabled for the current user and link context.
 *
 * All eligibility criteria are consolidated here:
 * 1. Rovo chat must be enabled for the tenant.
 * 2. The consumer must have opted in via actionOptions.rovoChatAction.optIn.
 * 3. The link must support the RovoActions feature.
 * 4. The extension key must be one of the supported options.
 *
 * The extension key is derived from the card store via the resolved URL,
 * so callers don't need to thread it as a prop.
 */
const useInlineTailoredAction = (
	url?: string,
	showHoverPreview?: boolean,
	actionOptions?: CardActionOptions,
): InlineTailoredAction => {
	const { rovoOptions: rovoConfig } = useRovoConfig();
	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig);
	const cardState = useSmartCardState(url ?? '');
	const extensionKey = getExtensionKey(cardState.details);
	const isRovoChatActionOptedIn = actionOptions?.rovoChatAction?.optIn ?? false;

	return useMemo(() => {
		if (!isRovoChatEnabled || !showHoverPreview || !url || !isRovoChatActionOptedIn) {
			return NOT_ENABLED_RESULT;
		}

		if (!extensionKey || !ELIGIBLE_EXTENSION_KEYS.has(extensionKey)) {
			return NOT_ENABLED_RESULT;
		}

		return { isEnabled: true };
	}, [isRovoChatEnabled, extensionKey, showHoverPreview, url, isRovoChatActionOptedIn]);
};

export default useInlineTailoredAction;
