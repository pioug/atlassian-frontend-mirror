import { type JsonLd } from 'json-ld-types';

import { fg } from '@atlaskit/platform-feature-flags';

import { type FireEventFunction } from '../../../common/analytics/types';
import { ActionName, InternalActionName } from '../../../constants';
import { type FlexibleUiActions } from '../../../state/flexible-ui-context/types';
import { type AISummaryConfig } from '../../../state/hooks/use-ai-summary-config/types';
import { type AnalyticsOrigin } from '../../../utils/types';
import { type CardActionOptions, type CardInnerAppearance } from '../../../view/Card/types';

import { extractAISummaryAction } from './extract-ai-summary-action';
import { extractAutomationAction } from './extract-automation-action';
import { extractCopyLinkAction, extractCopyLinkClientAction } from './extract-copy-link-action';
import { extractDownloadAction, extractDownloadClientAction } from './extract-download-action';
import extractFollowAction from './extract-follow-action';
import { extractPreviewAction, extractPreviewClientAction } from './extract-preview-action';
import { extractViewRelatedLinksAction } from './extract-view-related-links-action';

export type ExtractActionsParam = {
	response: JsonLd.Response;
	url?: string;
	actionOptions?: CardActionOptions;
	id?: string;
	aiSummaryConfig?: AISummaryConfig;
	appearance?: CardInnerAppearance;
	origin?: AnalyticsOrigin;
	fireEvent?: FireEventFunction;
};

export const extractFlexibleCardActions = ({
	actionOptions,
	aiSummaryConfig,
	appearance,
	fireEvent,
	id,
	origin,
	response,
	url,
}: ExtractActionsParam): FlexibleUiActions | undefined => {
	const action = {
		[ActionName.CopyLinkAction]: extractCopyLinkClientAction({
			actionOptions,
			appearance,
			id,
			response,
		}),
		[ActionName.DownloadAction]: extractDownloadClientAction({
			actionOptions,
			appearance,
			id,
			response,
		}),
		[ActionName.FollowAction]: extractFollowAction(response, actionOptions, id),
		[ActionName.PreviewAction]: extractPreviewClientAction({
			actionOptions,
			appearance,
			fireEvent,
			id,
			origin,
			response,
		}),
		[ActionName.AutomationAction]: extractAutomationAction(response),
		[InternalActionName.AISummaryAction]: extractAISummaryAction(
			response,
			url,
			actionOptions,
			aiSummaryConfig,
		),
		...(fg('platform-smart-card-view-related-urls-action')
			? {
					[InternalActionName.ViewRelatedLinksAction]: extractViewRelatedLinksAction(response),
				}
			: {}),
	};

	return Object.values(action).some((value) => Boolean(value)) ? action : undefined;
};

/**
 * TODO: Remove on cleanup of platform-smart-card-migrate-embed-modal-analytics
 * Replaced with extractFlexibleCardActions()
 */
const extractActions = (
	response: JsonLd.Response,
	url?: string,
	actionOptions?: CardActionOptions,
	id?: string,
	aiSummaryConfig?: AISummaryConfig,
): FlexibleUiActions | undefined => {
	const data = response.data as JsonLd.Data.BaseData;

	const action = {
		[ActionName.CopyLinkAction]: extractCopyLinkAction(data, actionOptions),
		[ActionName.DownloadAction]: extractDownloadAction(data, actionOptions),
		[ActionName.FollowAction]: extractFollowAction(response, actionOptions, id),
		[ActionName.PreviewAction]: extractPreviewAction(response, actionOptions),
		[ActionName.AutomationAction]: extractAutomationAction(response),
		[InternalActionName.AISummaryAction]: extractAISummaryAction(
			response,
			url,
			actionOptions,
			aiSummaryConfig,
		),
		...(fg('platform-smart-card-view-related-urls-action')
			? {
					[InternalActionName.ViewRelatedLinksAction]: extractViewRelatedLinksAction(response),
				}
			: {}),
	};

	return Object.values(action).some((value) => Boolean(value)) ? action : undefined;
};

export default extractActions;
