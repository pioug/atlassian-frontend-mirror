import { type JsonLd } from 'json-ld-types';

import { type CopyLinkActionData } from '../../../state/flexible-ui-context/types';
import { extractLink } from '@atlaskit/link-extractors';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import { canShowAction } from '../../../utils/actions/can-show-action';

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
