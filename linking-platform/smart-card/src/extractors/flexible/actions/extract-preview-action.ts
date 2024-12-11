import { type JsonLd } from 'json-ld-types';

import {
	extractLink,
	extractPreview as extractPreviewData,
	extractProvider,
	extractTitle,
} from '@atlaskit/link-extractors';

import { type PreviewActionData } from '../../../state/flexible-ui-context/types';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import {
	extractInvokePreviewAction,
	type ExtractInvokePreviewActionParam,
} from '../../action/extract-invoke-preview-action';
import { extractDownloadUrl } from '../../common/detail';
import { extractIsSupportTheming } from '../../common/meta/extractIsSupportTheming';
import { extractIsTrusted } from '../../common/meta/extractIsTrusted';
import { extractLinkIcon } from '../icon';

/**
 * TODO: Remove on cleanup of platform-smart-card-migrate-embed-modal-analytics
 * Replaced with extractPreviewClientAction()
 */
export const extractPreviewAction = (
	response: JsonLd.Response,
	actionOptions?: CardActionOptions,
): PreviewActionData | undefined => {
	if (!canShowAction(CardAction.PreviewAction, actionOptions)) {
		return;
	}

	const data = response.data as JsonLd.Data.BaseData;
	const meta = response.meta as JsonLd.Meta.BaseMeta;

	const src = extractPreviewData(data, 'web')?.src;
	if (src) {
		return {
			downloadUrl: extractDownloadUrl(data as JsonLd.Data.Document),
			providerName: extractProvider(data)?.text,
			src,
			title: extractTitle(data),
			linkIcon: extractLinkIcon(response),
			url: extractLink(data),
			isSupportTheming: extractIsSupportTheming(meta),
			isTrusted: extractIsTrusted(meta),
		};
	}
};

export const extractPreviewClientAction = (
	param: ExtractInvokePreviewActionParam,
): PreviewActionData | undefined => {
	const invokeAction = extractInvokePreviewAction(param);
	return invokeAction ? { invokeAction } : undefined;
};
