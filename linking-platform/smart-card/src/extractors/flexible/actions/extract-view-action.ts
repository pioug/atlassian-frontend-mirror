import { type JsonLd } from 'json-ld-types';
import { extractLink } from '@atlaskit/link-extractors';
import { getActionsFromJsonLd } from '../../common/actions/extractActions';
import { type ViewActionData } from '../../../state/flexible-ui-context/types';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import { canShowAction } from '../../../utils/actions/can-show-action';

export const extractViewAction = (
	data: JsonLd.Data.BaseData,
	actionOptions?: CardActionOptions,
): ViewActionData | undefined => {
	if (!canShowAction(CardAction.ViewAction, actionOptions)) {
		return;
	}

	const viewActionExists = getActionsFromJsonLd(data).find(
		(action) => action['@type'] === 'ViewAction',
	);
	if (viewActionExists) {
		return {
			viewUrl: extractLink(data),
		};
	}
	return undefined;
};
