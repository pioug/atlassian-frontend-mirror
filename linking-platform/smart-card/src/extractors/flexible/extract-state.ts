import type { JsonLd } from 'json-ld-types';

import { extractLink } from '@atlaskit/link-extractors';
import {
	type InvokeRequest,
	type InvokeRequestAction,
	type SmartLinkActionType,
} from '@atlaskit/linking-types';

import { getExtensionKey } from '../../state/helpers';
import {
	type CardDetails,
	type InvokeRequestWithCardDetails,
} from '../../state/hooks/use-invoke/types';
import { canShowAction } from '../../utils/actions/can-show-action';
import { CardAction, type CardActionOptions } from '../../view/Card/types';
import { extractLozenge } from '../common/lozenge';
import { type LinkLozenge, type LinkLozengeInvokeActions } from '../common/lozenge/types';

import { extractPreviewAction } from './actions/extract-preview-action';
import extractServerAction from './extract-server-action';

const toInvokeRequest = (
	extensionKey: string,
	resourceIdentifiers: InvokeRequestAction['resourceIdentifiers'],
	actionType?: InvokeRequestAction['actionType'],
	details?: CardDetails,
): InvokeRequest | InvokeRequestWithCardDetails | undefined => {
	if (!actionType) {
		return;
	}

	return {
		action: {
			actionType,
			resourceIdentifiers,
		},
		providerKey: extensionKey,
		details,
	};
};

const extractAction = (
	response?: JsonLd.Response,
	id?: string,
): LinkLozengeInvokeActions | undefined => {
	const extensionKey = getExtensionKey(response);
	const data = response?.data as JsonLd.Data.BaseData;
	const actions = extractServerAction(data);
	if (!extensionKey || actions.length === 0) {
		return;
	}

	const action = actions.find(
		(item) =>
			item?.name === 'UpdateAction' && (item as JsonLd.Primitives.UpdateAction)?.refField === 'tag',
	) as JsonLd.Primitives.UpdateAction;

	if (!action || !action.resourceIdentifiers) {
		return;
	}

	const read = toInvokeRequest(
		extensionKey,
		action.resourceIdentifiers,
		action.dataRetrievalAction?.name as SmartLinkActionType,
	);

	const url = extractLink(data);

	const previewData = response ? extractPreviewAction(response) : null;

	const details = { id, url, previewData };
	const update = toInvokeRequest(
		extensionKey,
		action.resourceIdentifiers,
		action.dataUpdateAction?.name as SmartLinkActionType,
		details,
	);

	return read || update
		? {
				read,
				update,
			}
		: undefined;
};

const extractState = (
	response?: JsonLd.Response,
	actionOptions?: CardActionOptions,
	id?: string,
): LinkLozenge | undefined => {
	if (!response || !response.data) {
		return;
	}

	const lozenge = extractLozenge(response?.data as JsonLd.Data.BaseData);

	if (!lozenge) {
		return;
	}

	if (!canShowAction(CardAction.ChangeStatusAction, actionOptions)) {
		return lozenge;
	}

	const action = extractAction(response, id);
	return { ...lozenge, action };
};

export default extractState;
