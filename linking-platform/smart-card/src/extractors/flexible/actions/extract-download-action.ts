import { type JsonLd } from 'json-ld-types';

import { type DownloadActionData } from '../../../state/flexible-ui-context/types';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import { getActionsFromJsonLd } from '../../common/actions/extractActions';
import { extractDownloadUrl } from '../../common/detail';

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
