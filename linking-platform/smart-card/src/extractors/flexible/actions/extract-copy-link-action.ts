import { type CopyLinkActionData } from '../../../state/flexible-ui-context/types';
import { extractInvokeCopyLinkAction } from '../../action/extract-invoke-copy-link-action';
import { type ExtractClientActionsParam } from '../../action/types';

export const extractCopyLinkClientAction = (
	param: ExtractClientActionsParam,
): CopyLinkActionData | undefined => {
	const invokeAction = extractInvokeCopyLinkAction(param);
	return invokeAction ? { invokeAction } : undefined;
};
