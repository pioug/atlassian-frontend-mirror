import type { JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors';
import type { ProductType } from '@atlaskit/linking-common';

import type { RovoChatActionData } from '../../../state/flexible-ui-context/types';
import { getExtensionKey } from '../../../state/helpers';
import type { RovoConfig } from '../../../state/hooks/use-rovo-config';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import {
	CardAction,
	type InternalCardActionOptions as CardActionOptions,
} from '../../../view/Card/types';

const extractRovoChatAction = (
	response: JsonLd.Response,
	rovoConfig?: RovoConfig,
	actionOptions?: CardActionOptions,
	product?: ProductType,
): RovoChatActionData | undefined => {
	if (!canShowAction(CardAction.RovoChatAction, actionOptions)) {
		return;
	}

	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig);
	if (!isRovoChatEnabled) {
		return;
	}

	// Experiment cleanup note: platform_sl_3p_auth_rovo_action
	// If feature isn't support all 3P, this value should come from meta.supportedFeature
	const isSupportedFeature = getExtensionKey(response) === 'google-object-provider';
	const isOptIn = actionOptions?.rovoChatAction?.optIn === true;

	const url = extractSmartLinkUrl(response);
	return isSupportedFeature && isOptIn ? { product, url } : undefined;
};

export default extractRovoChatAction;
