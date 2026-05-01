import type { JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors';
import type { ProductType } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { ActionName } from '../../../constants';
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

// For rovogrowth-640 post auth inline experiment
const ELIGIBLE_EXTENSION_KEYS = new Set([
	'slack-object-provider',
	'google-object-provider',
	'onedrive-object-provider',
	'github-object-provider',
	'ms-teams-object-provider',
	'gitlab-object-provider',
	'salesforce-object-provider',
]);

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

	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig?.rovoOptions);
	if (!isRovoChatEnabled) {
		return;
	}

	const supportsRovoActions = response?.meta?.supportedFeature?.includes('RovoActions');
	const extensionKey = getExtensionKey(response);
	const isGoogleProvider = extensionKey === 'google-object-provider';
	const is3PAuthRovoActionEnabled =
		isGoogleProvider && fg('platform_sl_3p_auth_rovo_action_kill_switch');
	const is3PInlinePostAuthActionsEnabled =
		extensionKey !== undefined &&
		ELIGIBLE_EXTENSION_KEYS.has(extensionKey) &&
		fg('rovogrowth-640-inline-action-nudge-fg') &&
		expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true);
	const is3PBlockPostAuthActionsEnabled =
		supportsRovoActions && fg('platform_sl_3p_auth_rovo_block_card_kill_switch');

	const isSupportedFeature =
		is3PInlinePostAuthActionsEnabled ||
		is3PAuthRovoActionEnabled ||
		is3PBlockPostAuthActionsEnabled;
	const isOptIn = actionOptions?.rovoChatAction?.optIn === true;

	const url = extractSmartLinkUrl(response);
	return isSupportedFeature && isOptIn
		? {
				invokeAction: {
					actionSubjectId: 'rovoChatPrompt',
					actionType: ActionName.RovoChatAction,
					definitionId: getDefinitionId(response),
					display: appearance,
					extensionKey,
					id,
					resourceType: getResourceType(response),
				},
				product,
				url,
			}
		: undefined;
};

export default extractRovoChatAction;
