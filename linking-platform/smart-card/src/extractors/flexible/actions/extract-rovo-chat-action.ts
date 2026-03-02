import type { JsonLd } from '@atlaskit/json-ld-types';

import { getExtensionKey } from '../../../state/helpers';
import type { RovoConfig } from '../../../state/hooks/use-rovo-config';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import { type InternalCardActionOptions as CardActionOptions } from '../../../view/Card/types';

const extractRovoChatAction = (
	response: JsonLd.Response,
	rovoConfig?: RovoConfig,
	actionOptions?: CardActionOptions,
): boolean | undefined => {
	// Experiment cleanup note: platform_sl_3p_auth_rovo_action
	// If action is available by default, we need to allow RovoChatAction to be configurable to opt-out
	// if (!canShowAction(CardAction.RovoChatAction, actionOptions)) {
	// 	return;
	// }

	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig);
	if (!isRovoChatEnabled) {
		return;
	}

	// Experiment cleanup note: platform_sl_3p_auth_rovo_action
	// If feature isn't support all 3P, this value should come from meta.supportedFeature
	const isSupportedFeature = getExtensionKey(response) === 'google-object-provider';
	const isOptIn = actionOptions?.rovoChatAction === true;

	return isSupportedFeature && isOptIn ? true : undefined;
};

export default extractRovoChatAction;
