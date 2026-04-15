import { useMemo } from 'react';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { getIsRovoChatEnabled } from '../../../utils/rovo';
import { getExtensionKey } from '../../helpers';
import { useSmartCardState } from '../../store';
import useRovoConfig from '../use-rovo-config';

export interface InlineActionNudgeExperiment {
	/**
	 * True when the user is in the treatment cohort and should see the
	 * inline action nudge UI. All treatment surfaces should gate on this.
	 */
	isEnabled: boolean;
}

const EXCLUDED_EXTENSION_KEYS = new Set(['figma-object-provider', 'google-object-provider']);

const NOT_ENABLED_RESULT: InlineActionNudgeExperiment = {
	isEnabled: false,
};

/**
 * Returns whether the rovogrowth_640_inline_action_nudge experiment
 * is enabled for the current user and link context.
 *
 * All eligibility criteria are consolidated here:
 * 1. Rovo chat must be enabled for the tenant.
 * 2. The extension key must not be excluded (Figma and Google links are excluded).
 * 3. The experiment value must be true (via tmp-editor-statsig).
 *
 * The extension key is derived from the card store via the resolved URL,
 * so callers don't need to thread it as a prop.
 */
const useInlineActionNudgeExperiment = (
	url?: string,
): InlineActionNudgeExperiment => {
	const rovoConfig = useRovoConfig();
	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig);
	const cardState = useSmartCardState(url ?? '');
	const extensionKey = getExtensionKey(cardState.details);

	return useMemo(() => {
		if (!isRovoChatEnabled) {
			return NOT_ENABLED_RESULT;
		}

		if (extensionKey && EXCLUDED_EXTENSION_KEYS.has(extensionKey)) {
			return NOT_ENABLED_RESULT;
		}

		const isEnabled = expValEquals('rovogrowth_640_inline_action_nudge', 'isEnabled', true);

		return { isEnabled };
	}, [isRovoChatEnabled, extensionKey]);
};

export default useInlineActionNudgeExperiment;
