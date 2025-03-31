import { type JsonLd } from '@atlaskit/json-ld-types';

import { type AISummaryActionData } from '../../../state/flexible-ui-context/types';
import { type AISummaryConfig } from '../../../state/hooks/use-ai-summary-config/types';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { getIsAISummaryEnabled } from '../../../utils/ai-summary';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';

export const extractAISummaryAction = (
	response: JsonLd.Response,
	url?: string,
	actionOptions?: CardActionOptions,
	aiSummaryConfig?: Pick<AISummaryConfig, 'isAdminHubAIEnabled'>,
): AISummaryActionData | undefined => {
	if (
		!canShowAction(CardAction.AISummaryAction, actionOptions) ||
		!getIsAISummaryEnabled(aiSummaryConfig?.isAdminHubAIEnabled, response) ||
		!url
	) {
		return;
	}

	return { url };
};
