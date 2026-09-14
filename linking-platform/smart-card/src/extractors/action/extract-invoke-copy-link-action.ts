import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';

import { ActionName, CardAction } from '../../constants';
import { getDefinitionId } from '../../state/getDefinitionId';
import { getExtensionKey } from '../../state/getExtensionKey';
import { getResourceType } from '../../state/getResourceType';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { canShowAction } from '../../utils/actions/can-show-action';
import { type ExtractClientActionsParam } from './types';

export const extractInvokeCopyLinkAction = ({
	actionOptions,
	appearance,
	id,
	response,
}: ExtractClientActionsParam): InvokeClientActionProps | undefined => {
	if (!canShowAction(CardAction.CopyLinkAction, actionOptions)) {
		return;
	}

	const url = extractSmartLinkUrl(response);

	if (!url) {
		return;
	}

	return {
		actionFn: async () => navigator.clipboard.writeText(url),
		actionSubjectId: 'copyLink',
		actionType: ActionName.CopyLinkAction,
		definitionId: getDefinitionId(response),
		display: appearance,
		extensionKey: getExtensionKey(response),
		id,
		resourceType: getResourceType(response),
	};
};
