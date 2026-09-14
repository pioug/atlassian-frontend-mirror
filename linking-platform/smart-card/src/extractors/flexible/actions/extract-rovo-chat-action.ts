import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import type { ProductType } from '@atlaskit/linking-common/types';

import { ActionName, CardAction } from '../../../constants';
import type { RovoChatActionData } from '../../../state/flexible-ui-context/types';
import { getDefinitionId } from '../../../state/getDefinitionId';
import { getExtensionKey } from '../../../state/getExtensionKey';
import { getResourceType } from '../../../state/getResourceType';
import type { RovoConfig } from '../../../state/hooks/use-rovo-config';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { getIsRovoChatEnabled } from '../../../utils/rovo';
import { type InternalCardActionOptions as CardActionOptions } from '../../../view/Card/types';
import type { FlexibleCardProps } from '../../../view/FlexibleCard/types';

type ExtractInvokeRovoChatActionParam = {
	actionOptions?: CardActionOptions;
	appearance?: FlexibleCardProps['appearance'];
	id?: string;
	isEmbedRovoActionsFooterExperimentEnabled?: boolean;
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

	const isRovoChatEnabled = getIsRovoChatEnabled(rovoConfig?.rovoOptions);
	if (!isRovoChatEnabled) {
		return;
	}

	const extensionKey = getExtensionKey(response);

	const url = extractSmartLinkUrl(response);
	return actionOptions?.rovoChatAction?.optIn
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
