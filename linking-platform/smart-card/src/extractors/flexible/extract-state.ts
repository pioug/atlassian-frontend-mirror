import type { JsonLd } from '@atlaskit/json-ld-types';
import { extractLink } from '@atlaskit/link-extractors';
import {
	type InvokeRequest,
	type InvokeRequestAction,
	type SmartLinkActionType,
} from '@atlaskit/linking-types';

import { type FireEventFunction } from '../../common/analytics/types';
import { getExtensionKey } from '../../state/helpers';
import {
	type CardDetails,
	type InvokeRequestWithCardDetails,
} from '../../state/hooks/use-invoke/types';
import { type ResolveFunction } from '../../state/hooks/use-resolve';
import { canShowAction } from '../../utils/actions/can-show-action';
import { type AnalyticsOrigin } from '../../utils/types';
import {
	CardAction,
	type CardActionOptions,
	type CardInnerAppearance,
} from '../../view/Card/types';
import { extractInvokePreviewAction } from '../action/extract-invoke-preview-action';
import { extractLozenge } from '../common/lozenge';
import { type LinkLozenge, type LinkLozengeInvokeActions } from '../common/lozenge/types';

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
	actionOptions?: CardActionOptions,
	appearance?: CardInnerAppearance,
	origin?: AnalyticsOrigin,
	fireEvent?: FireEventFunction,
	resolve?: ResolveFunction,
	isPreviewPanelAvailable?: (params: { ari: string }) => boolean,
	openPreviewPanel?: (params: {
		ari: string;
		url: string;
		name: string;
		iconUrl: string | undefined;
	}) => void,
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

	const invokePreviewAction = response
		? extractInvokePreviewAction({
				actionOptions,
				appearance,
				fireEvent,
				id,
				onClose: resolve ? () => url && resolve(url, true) : undefined,
				origin,
				response,
				isPreviewPanelAvailable,
				openPreviewPanel,
			})?.invokeAction
		: undefined;

	const details = { id, url, invokePreviewAction };
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
	appearance?: CardInnerAppearance,
	origin?: AnalyticsOrigin,
	fireEvent?: FireEventFunction,
	resolve?: ResolveFunction,
	isPreviewPanelAvailable?: (params: { ari: string }) => boolean,
	openPreviewPanel?: (params: {
		ari: string;
		url: string;
		name: string;
		iconUrl: string | undefined;
	}) => void,
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

	const action = extractAction(
		response,
		id,
		actionOptions,
		appearance,
		origin,
		fireEvent,
		resolve,
		isPreviewPanelAvailable,
		openPreviewPanel,
	);
	return { ...lozenge, action };
};

export default extractState;
