import type { JsonLd } from 'json-ld-types';

import { extractLink } from '@atlaskit/link-extractors';

import { ActionName, CardAction } from '../../index';
import { getDefinitionId, getExtensionKey, getResourceType } from '../../state/helpers';
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

	const data = response.data as JsonLd.Data.BaseData;
	const url = extractLink(data);
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
