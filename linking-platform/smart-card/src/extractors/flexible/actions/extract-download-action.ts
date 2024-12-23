import { type JsonLd } from 'json-ld-types';

import { type DownloadActionData } from '../../../state/flexible-ui-context/types';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import { extractInvokeDownloadAction } from '../../action/extract-invoke-download-action';
import { type ExtractClientActionsParam } from '../../action/types';
import { getActionsFromJsonLd } from '../../common/actions/extractActions';
import { extractDownloadUrl } from '../../common/download/extractDownloadUrl';

/**
 * TODO: Remove on cleanup of platform-smart-card-migrate-embed-modal-analytics
 * Replaced with extractDownloadClientAction()
 */
export const extractDownloadAction = (
	data: JsonLd.Data.BaseData,
	actionOptions?: CardActionOptions,
): DownloadActionData | undefined => {
	if (!canShowAction(CardAction.DownloadAction, actionOptions)) {
		return;
	}

	const downloadActionExists = getActionsFromJsonLd(data).find(
		(action) => action['@type'] === 'DownloadAction',
	);

	if (downloadActionExists) {
		return {
			downloadUrl: extractDownloadUrl(data as JsonLd.Data.Document),
		};
	}

	return;
};

export const extractDownloadClientAction = (
	param: ExtractClientActionsParam,
): DownloadActionData | undefined => {
	const invokeAction = extractInvokeDownloadAction(param);
	return invokeAction ? { invokeAction } : undefined;
};
