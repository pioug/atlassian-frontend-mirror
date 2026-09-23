import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractPreview as extractPreviewData } from '@atlaskit/link-extractors/extract-preview';
import { extractSmartLinkAri } from '@atlaskit/link-extractors/extract-smart-link-ari';
import { extractSmartLinkEmbed } from '@atlaskit/link-extractors/extract-smart-link-embed';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider';
import { extractSmartLinkTitle } from '@atlaskit/link-extractors/extract-smart-link-title';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import { isWithinPreviewPanelIFrame } from '@atlaskit/linking-common/utils/is-within-preview-panel-iframe';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { type FireEventFunction } from '../../common/analytics/types';
import { ActionName, CardAction } from '../../constants';
import { getExtensionKey } from '../../state/getExtensionKey';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { canShowAction } from '../../utils/actions/can-show-action';
import { type AnalyticsOrigin } from '../../utils/types';
import { type EmbedModalProps } from '../../view/EmbedModal/types';
import { openEmbedModal } from '../../view/EmbedModal/utils';
import { extractIsSupportTheming } from '../common/meta/extractIsSupportTheming';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';
import { extractLinkIcon } from '../flexible/icon/extract-link-icon';
import { extractSmartLinkIcon } from '../flexible/icon/extract-smart-link-icon';
import { extractInvokeDownloadAction } from './extract-invoke-download-action';
import { extractInvokeViewAction } from './extract-invoke-view-action';
import { type ExtractClientActionsParam, type TransformUrlFn } from './types';

export type ExtractInvokePreviewActionParam = ExtractClientActionsParam & {
	fireEvent?: FireEventFunction;
	isPreviewPanelAvailable?: (params: { ari: string }) => boolean;
	isPreviewRestricted?: (params: { ari: string }) => boolean;
	onClose?: EmbedModalProps['onClose'];
	openPreviewPanel?: (params: {
		ari: string;
		iconUrl: string | undefined;
		name: string;
		panelData: { embedUrl?: string };
		url: string;
	}) => void;
	origin?: AnalyticsOrigin;
	transformUrl?: TransformUrlFn;
};

type ExtractInvokePreviewActionReturn = {
	hasPreviewPanel?: boolean;
	invokeAction: InvokeClientActionProps;
};

export const extractInvokePreviewAction = (
	param: ExtractInvokePreviewActionParam,
): ExtractInvokePreviewActionReturn | undefined => {
	const {
		actionOptions,
		appearance: display,
		fireEvent,
		onClose,
		id,
		origin,
		response,
		isPreviewPanelAvailable,
		isPreviewRestricted,
		openPreviewPanel,
	} = param;

	const ari = extractSmartLinkAri(response);
	const url = extractSmartLinkUrl(response);
	const name = extractSmartLinkTitle(response);

	const hasPreviewPanelParams = Boolean(
		expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') &&
		isPreviewPanelAvailable &&
		openPreviewPanel &&
		ari &&
		url &&
		name,
	);

	const hasPreviewPanel = hasPreviewPanelParams && isPreviewPanelAvailable!({ ari: ari! });

	const isInPreviewPanel =
		expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') &&
		isWithinPreviewPanelIFrame();

	const data = response.data as JsonLd.Data.BaseData;
	const meta = response.meta as JsonLd.Meta.BaseMeta;

	if (!canShowAction(CardAction.PreviewAction, actionOptions)) {
		return;
	}

	// Restricted (e.g. cross-unit) resources must not be previewed at all — suppress
	// the action so it does not fall back to a preview modal.
	if (ari && isPreviewRestricted?.({ ari }) && fg('preview_panel_unit_check')) {
		return;
	}

	/* Analytics UI event for preview action created to support tracking of preview actions as the experiment rolls out */
	const firePreviewActionUIEvent = ({ previewType }: { previewType: 'panel' | 'modal' }) => {
		if (
			!expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') ||
			origin !== 'smartLinkPreviewHoverCard' ||
			!fireEvent
		) {
			return;
		}

		fireEvent('ui.smartLink.clicked.previewHoverCard', {
			id: id || '',
			display: 'hoverCardPreview',
			previewType,
		});
	};

	const src = extractPreviewData(data, 'web')?.src;

	// disallow preview modals within preview panels
	if (!hasPreviewPanel && isInPreviewPanel) {
		return;
	}

	if (src) {
		const extensionKey = getExtensionKey(response);
		return {
			hasPreviewPanel,
			invokeAction: {
				actionFn: async () => {
					if (hasPreviewPanel) {
						let resolvedUrl = url!;
						if (expValEquals('platform_hover_card_preview_panel', 'cohort', 'test')) {
							const responseUrl =
								response.data && 'url' in response.data
									? (response.data as { url?: string }).url
									: undefined;
							resolvedUrl = responseUrl || url!;
						}

						openPreviewPanel!({
							ari: ari!,
							url: resolvedUrl,
							name: name!,
							iconUrl: undefined,
							panelData: {
								embedUrl: expValEquals('platform_hover_card_preview_panel', 'cohort', 'test')
									? extractSmartLinkEmbed(response)?.src
									: undefined,
							},
						});
						expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') &&
							firePreviewActionUIEvent({ previewType: 'panel' });
					} else {
						await openEmbedModal({
							fireEvent,
							extensionKey,
							id,
							invokeDownloadAction: extractInvokeDownloadAction(param),
							invokeViewAction: extractInvokeViewAction(param, true),
							isSupportTheming: extractIsSupportTheming(meta),
							isTrusted: extractIsTrusted(meta),
							linkIcon: fg('platform_lp_use_generator_icon_for_provider')
								? extractSmartLinkIcon(response)
								: extractLinkIcon(response),
							providerName: extractSmartLinkProvider(response)?.text,
							onClose,
							origin,
							src: extractSmartLinkEmbed(response)?.src,
							title: extractSmartLinkTitle(response),
							url,
							size: actionOptions?.previewAction?.size,
							isBlanketHidden: actionOptions?.previewAction?.hideBlanket,
							...(expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') && {
								isInPreviewPanel,
							}),
						});
						expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') &&
							firePreviewActionUIEvent({ previewType: 'modal' });
					}
				},
				actionSubjectId: 'invokePreviewScreen',
				actionType: ActionName.PreviewAction,
				display,
				extensionKey,
				id,
			},
		};
	}
};
