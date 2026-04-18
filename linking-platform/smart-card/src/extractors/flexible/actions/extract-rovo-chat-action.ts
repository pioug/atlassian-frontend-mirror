import type { JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors';
import type { ProductType } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { InternalActionName } from '../../../constants';
import type { RovoChatActionData } from '../../../state/flexible-ui-context/types';
import { getDefinitionId, getExtensionKey, getResourceType } from '../../../state/helpers';
import type { RovoConfig } from '../../../state/hooks/use-rovo-config';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import {
	CardAction,
	type InternalCardActionOptions as CardActionOptions,
} from '../../../view/Card/types';
import type { FlexibleCardProps } from '../../../view/FlexibleCard/types';

type ExtractInvokeRovoChatActionParam = {
	actionOptions?: CardActionOptions;
	appearance?: FlexibleCardProps['appearance'];
	id?: string;
	product?: ProductType;
	response: JsonLd.Response;
	rovoConfig?: RovoConfig;
};

const extractRovoChatAction = ({
	actionOptions,
	appearance,
	id,
	product,
	response,
	rovoConfig,
}: ExtractInvokeRovoChatActionParam): RovoChatActionData | undefined => {
	if (!canShowAction(CardAction.RovoChatAction, actionOptions)) {
		return;
	}

	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig);
	if (!isRovoChatEnabled) {
		return;
	}

	const supportsRovoActions = response?.meta?.supportedFeature?.includes('RovoActions');
	const isGoogleProvider = getExtensionKey(response) === 'google-object-provider';
	const is3PAuthRovoActionEnabled =
		isGoogleProvider && fg('platform_sl_3p_auth_rovo_action_kill_switch');
	const is3PInlinePostAuthActionsEnabled =
		!isGoogleProvider && fg('rovogrowth-640-inline-action-nudge-fg');

	const isSupportedFeature =
		(supportsRovoActions && is3PInlinePostAuthActionsEnabled) || is3PAuthRovoActionEnabled;
	const isOptIn = actionOptions?.rovoChatAction?.optIn === true;

	const url = extractSmartLinkUrl(response);
	return isSupportedFeature && isOptIn
		? {
				invokeAction: {
					actionSubjectId: 'rovoChatPrompt',
					actionType: InternalActionName.RovoChatAction,
					definitionId: getDefinitionId(response),
					display: appearance,
					extensionKey: getExtensionKey(response),
					id,
					resourceType: getResourceType(response),
				},
				product,
				url,
			}
		: undefined;
};

export default extractRovoChatAction;
