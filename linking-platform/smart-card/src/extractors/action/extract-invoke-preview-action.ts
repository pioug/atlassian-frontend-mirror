import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractPreview as extractPreviewData,
	extractSmartLinkAri,
	extractSmartLinkEmbed,
	extractSmartLinkProvider,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
} from '@atlaskit/link-extractors';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
	isPreviewPanelAvailable?: (params: { ari: string }) => boolean;
	openPreviewPanel?: (params: { ari: string; url: string; name: string; iconUrl: string | undefined }) => void;
};

type ExtractInvokePreviewActionReturn = {
	invokeAction: InvokeClientActionProps;
	hasPreviewPanel?: boolean;
};

export const extractInvokePreviewAction = (
	param: ExtractInvokePreviewActionParam,
): ExtractInvokePreviewActionReturn | undefined => {
	const { actionOptions, appearance: display, fireEvent, onClose, id, origin, response, isPreviewPanelAvailable, openPreviewPanel } = param;

	const ari = extractSmartLinkAri(response);
	const url = extractSmartLinkUrl(response);
	const name = extractSmartLinkTitle(response);

	const hasPreviewPanelParams = Boolean(
		expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') &&
		isPreviewPanelAvailable &&
		openPreviewPanel &&
		ari &&
		url &&
		name
	);

	const hasPreviewPanel = hasPreviewPanelParams && isPreviewPanelAvailable!({ ari: ari! });

	const data = response.data as JsonLd.Data.BaseData;
	const meta = response.meta as JsonLd.Meta.BaseMeta;

	if (!canShowAction(CardAction.PreviewAction, actionOptions)) {
		return;
	}

	const src = extractPreviewData(data, 'web')?.src;
	if (src) {
		const extensionKey = getExtensionKey(response);
		return {
			invokeAction: {
				actionFn: async () => {
					if (hasPreviewPanel) {
						openPreviewPanel!({
							ari: ari!,
							url: url!,
							name: name!,
							iconUrl: undefined,
						});
					} else {
						await openEmbedModal({
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
							url,
						});
					}
				},
				actionSubjectId: 'invokePreviewScreen',
				actionType: ActionName.PreviewAction,
				display,
				extensionKey,
				id,
			},
			hasPreviewPanel: hasPreviewPanel,
		};
	}
};
