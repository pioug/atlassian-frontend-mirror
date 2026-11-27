import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import type { LinkProviderRemixPlugin } from '@atlaskit/link-provider/types';

import { CardAction, InternalActionName } from '../../../constants';
import type { RemixActionData } from '../../../state/flexible-ui-context/types';
import { getDefinitionId } from '../../../state/getDefinitionId';
import { getExtensionKey } from '../../../state/getExtensionKey';
import { getResourceType } from '../../../state/getResourceType';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { isRemixActionEnabled } from '../../../utils/is-remix-action-enabled';
import { type InternalCardActionOptions as CardActionOptions } from '../../../view/Card/types';
import type { FlexibleCardProps } from '../../../view/FlexibleCard/types';

type ExtractRemixActionParam = {
	actionOptions?: CardActionOptions;
	appearance?: FlexibleCardProps['appearance'];
	id?: string;
	remix?: LinkProviderRemixPlugin;
	response: JsonLd.Response;
	url?: string;
};

const extractRemixAction = ({
	actionOptions,
	appearance,
	id,
	remix,
	response,
	url,
}: ExtractRemixActionParam): RemixActionData | undefined => {
	if (!canShowAction(CardAction.RemixAction, actionOptions)) {
		return;
	}

	if (!actionOptions?.remixAction?.optIn) {
		return;
	}

	const remixUrl = extractSmartLinkUrl(response) ?? url;
	if (!remixUrl) {
		return;
	}
	const extensionKey = getExtensionKey(response);
	if (!isRemixActionEnabled({ extensionKey, remix, response })) {
		return;
	}

	return {
		invokeAction: {
			actionSubjectId: 'remix',
			actionType: InternalActionName.RemixAction,
			definitionId: getDefinitionId(response),
			display: appearance,
			extensionKey,
			id,
			resourceType: getResourceType(response),
		},
		url: remixUrl,
	};
};

export default extractRemixAction;
