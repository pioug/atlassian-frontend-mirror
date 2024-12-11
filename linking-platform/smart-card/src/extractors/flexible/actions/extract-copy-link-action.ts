import { type JsonLd } from 'json-ld-types';

import { extractLink } from '@atlaskit/link-extractors';

import { type CopyLinkActionData } from '../../../state/flexible-ui-context/types';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import { extractInvokeCopyLinkAction } from '../../action/extract-invoke-copy-link-action';
import { type ExtractClientActionsParam } from '../../action/types';

/**
 * TODO: Remove on cleanup of platform-smart-card-migrate-embed-modal-analytics
 * Replaced with extractCopyLinkClientAction()
 */
export const extractCopyLinkAction = (
	data: JsonLd.Data.BaseData,
	actionOptions?: CardActionOptions,
): CopyLinkActionData | undefined => {
	if (!canShowAction(CardAction.CopyLinkAction, actionOptions)) {
		return;
	}

	const url = extractLink(data);

	if (!url) {
		return;
	}

	return {
		url,
	};
};

export const extractCopyLinkClientAction = (
	param: ExtractClientActionsParam,
): CopyLinkActionData | undefined => {
	const invokeAction = extractInvokeCopyLinkAction(param);
	return invokeAction ? { invokeAction } : undefined;
};
