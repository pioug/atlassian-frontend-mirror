import { type JsonLd } from 'json-ld-types';

import { extractLink } from '@atlaskit/link-extractors';

import { CardAction } from '../../index';
import { getDefinitionId, getExtensionKey, getResourceType } from '../../state/helpers';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { openUrl } from '../../utils';
import { canShowAction } from '../../utils/actions/can-show-action';
import { getActionsFromJsonLd } from '../common/actions/extractActions';

import { type ExtractClientActionsParam } from './types';

export const extractInvokeViewAction = (
	{ actionOptions, appearance, id, response }: ExtractClientActionsParam,
	force?: boolean,
): InvokeClientActionProps | undefined => {
	if (!canShowAction(CardAction.ViewAction, actionOptions)) {
		return;
	}
	const data = response.data as JsonLd.Data.BaseData;
	if (!data) {
		return;
	}
	const url = extractLink(data);
	const viewActionExists = getActionsFromJsonLd(data).find(
		(action) => action['@type'] === 'ViewAction',
	);

	if (url && (viewActionExists || force)) {
		return {
			actionFn: async () => openUrl(url),
			actionSubjectId: 'shortcutGoToLink',
			actionType: 'ViewAction',
			definitionId: getDefinitionId(response),
			display: appearance,
			extensionKey: getExtensionKey(response),
			id,
			resourceType: getResourceType(response),
		};
	}
};
