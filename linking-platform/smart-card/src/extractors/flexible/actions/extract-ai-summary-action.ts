import { type JsonLd } from 'json-ld-types';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import { canShowAction } from '../../../utils/actions/can-show-action';
import { getIsAISummaryEnabled } from '../../../utils/ai-summary';
import { type AISummaryActionData } from '../../../state/flexible-ui-context/types';
import { type AISummaryConfig } from '../../../state/hooks/use-ai-summary-config/types';
import { extractAri } from '@atlaskit/link-extractors';

export const extractAISummaryAction = (
	response: JsonLd.Response,
	url?: string,
	actionOptions?: CardActionOptions,
	aiSummaryConfig?: AISummaryConfig,
): AISummaryActionData | undefined => {
	if (
		!canShowAction(CardAction.AISummaryAction, actionOptions) ||
		!getIsAISummaryEnabled(aiSummaryConfig?.isAdminHubAIEnabled, response) ||
		!aiSummaryConfig?.product ||
		!url
	) {
		return;
	}

	return {
		url,
		ari: extractAri(response.data as JsonLd.Data.BaseData),
		product: aiSummaryConfig?.product,
	};
};
