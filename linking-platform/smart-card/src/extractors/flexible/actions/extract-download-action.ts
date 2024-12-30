import { type DownloadActionData } from '../../../state/flexible-ui-context/types';
import { extractInvokeDownloadAction } from '../../action/extract-invoke-download-action';
import { type ExtractClientActionsParam } from '../../action/types';

export const extractDownloadClientAction = (
	param: ExtractClientActionsParam,
): DownloadActionData | undefined => {
	const invokeAction = extractInvokeDownloadAction(param);
	return invokeAction ? { invokeAction } : undefined;
};
