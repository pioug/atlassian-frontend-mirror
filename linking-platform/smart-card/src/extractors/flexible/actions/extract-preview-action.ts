import { type PreviewActionData } from '../../../state/flexible-ui-context/types';
import {
	extractInvokePreviewAction,
	type ExtractInvokePreviewActionParam,
} from '../../action/extract-invoke-preview-action';

export const extractPreviewClientAction = (
	param: ExtractInvokePreviewActionParam,
): PreviewActionData | undefined => {
	const result = extractInvokePreviewAction(param);

	return result ? result : undefined;
};
