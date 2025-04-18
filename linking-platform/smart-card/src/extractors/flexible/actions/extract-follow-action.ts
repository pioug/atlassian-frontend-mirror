import type { JsonLd } from '@atlaskit/json-ld-types';
import { extractLink, extractType } from '@atlaskit/link-extractors';
import { SmartLinkActionType } from '@atlaskit/linking-types';

import { type ServerActionProp } from '../../../state/flexible-ui-context/types';
import { getExtensionKey } from '../../../state/helpers';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import extractServerAction from '../extract-server-action';

const extractFollowAction = (
	response?: JsonLd.Response,
	actionOptions?: CardActionOptions,
	id?: string,
): ServerActionProp<boolean> | undefined => {
	if (!canShowAction(CardAction.FollowAction, actionOptions)) {
		return;
	}

	const extensionKey = getExtensionKey(response);
	const data = response?.data as JsonLd.Data.BaseData;
	const actions = extractServerAction(data);

	const type = extractType(data);
	const isProject = type?.includes('atlassian:Project');

	if (!extensionKey || actions.length === 0) {
		return;
	}

	const action = actions.find((item) => {
		if (item?.name === 'UpdateAction') {
			const actionName = (item as JsonLd.Primitives.UpdateAction)?.dataUpdateAction?.name;
			return (
				actionName === SmartLinkActionType.FollowEntityAction ||
				actionName === SmartLinkActionType.UnfollowEntityAction
			);
		}
		return false;
	}) as JsonLd.Primitives.UpdateAction;

	if (!action || !action.resourceIdentifiers) {
		return;
	}

	const url = extractLink(data);
	const reload = url ? { id, url } : undefined;

	const actionType = action.dataUpdateAction?.name as SmartLinkActionType;

	return {
		action: {
			action: {
				actionType,
				resourceIdentifiers: action.resourceIdentifiers,
			},
			providerKey: extensionKey,
			reload,
		},
		value: actionType === SmartLinkActionType.FollowEntityAction,
		isProject,
	};
};

export default extractFollowAction;
