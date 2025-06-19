import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractLink,
	extractPreview as extractPreviewData,
	extractProvider,
	extractSmartLinkEmbed,
	extractSmartLinkProvider,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractTitle,
} from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

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
		const url = extractLink(data);
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
					providerName: fg('smart_links_noun_support')
						? extractSmartLinkProvider(response)?.text
						: extractProvider(data)?.text,
					onClose,
					origin,
					src: fg('smart_links_noun_support') ? extractSmartLinkEmbed(response)?.src : src,
					title: fg('smart_links_noun_support')
						? extractSmartLinkTitle(response)
						: extractTitle(data),
					url: fg('smart_links_noun_support') ? extractSmartLinkUrl(response) : url,
				}),
			actionSubjectId: 'invokePreviewScreen',
			actionType: ActionName.PreviewAction,
			display,
			extensionKey,
			id,
		};
	}
};
