import { type JsonLd } from 'json-ld-types';

import { ActionName } from '../../constants';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { downloadUrl } from '../../utils';
import { type ExtractActionsProps } from '../common/actions/types';
import { extractDownloadAction as extractDownloadActionData } from '../flexible/actions/extract-download-action';

export const extractDownloadActionProps = ({
	response,
	actionOptions,
	extensionKey = 'empty-object-provider',
	source = 'block',
}: ExtractActionsProps): InvokeClientActionProps | undefined => {
	const data = extractDownloadActionData(response.data as JsonLd.Data.BaseData, actionOptions);

	if (data) {
		return {
			actionType: ActionName.DownloadAction,
			actionFn: () => downloadUrl(data.downloadUrl),
			display: source,
			extensionKey,
		};
	}
};
