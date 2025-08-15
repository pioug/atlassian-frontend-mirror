import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractPreview as extractPreviewData,
	extractSmartLinkEmbed,
	extractSmartLinkProvider,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
} from '@atlaskit/link-extractors';

import { type FireEventFunction } from '../../common/analytics/types';
import { ActionName, CardAction } from '../../index';
import { getExtensionKey } from '../../state/helpers';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { canShowAction } from '../../utils/actions/can-show-action';
import { type AnalyticsOrigin } from '../../utils/types';
import { type EmbedModalProps } from '../../view/EmbedModal/types';
import { openEmbedModal } from '../../view/EmbedModal/utils';
import { extractIsSupportTheming } from '../common/meta/extractIsSupportTheming';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';
import { extractLinkIcon } from '../flexible/icon';

import { extractInvokeDownloadAction } from './extract-invoke-download-action';
import { extractInvokeViewAction } from './extract-invoke-view-action';
import { type ExtractClientActionsParam } from './types';

export type ExtractInvokePreviewActionParam = ExtractClientActionsParam & {
	fireEvent?: FireEventFunction;
	onClose?: EmbedModalProps['onClose'];
	origin?: AnalyticsOrigin;
};

export const extractInvokePreviewAction = (
	param: ExtractInvokePreviewActionParam,
): InvokeClientActionProps | undefined => {
	const { actionOptions, appearance: display, fireEvent, onClose, id, origin, response } = param;
	if (!canShowAction(CardAction.PreviewAction, actionOptions)) {
		return;
	}

	const data = response.data as JsonLd.Data.BaseData;
	const meta = response.meta as JsonLd.Meta.BaseMeta;

	const src = extractPreviewData(data, 'web')?.src;
	if (src) {
		const extensionKey = getExtensionKey(response);
		return {
			actionFn: async () =>
				openEmbedModal({
					fireEvent,
					extensionKey,
					id,
					invokeDownloadAction: extractInvokeDownloadAction(param),
					invokeViewAction: extractInvokeViewAction(param, true),
					isSupportTheming: extractIsSupportTheming(meta),
					isTrusted: extractIsTrusted(meta),
					linkIcon: extractLinkIcon(response),
					providerName: extractSmartLinkProvider(response)?.text,
					onClose,
					origin,
					src: extractSmartLinkEmbed(response)?.src,
					title: extractSmartLinkTitle(response),
					url: extractSmartLinkUrl(response),
				}),
			actionSubjectId: 'invokePreviewScreen',
			actionType: ActionName.PreviewAction,
			display,
			extensionKey,
			id,
		};
	}
};
