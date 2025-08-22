import { useMemo } from 'react';

import uuid from 'uuid';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { extractInvokeDownloadAction } from '../../extractors/action/extract-invoke-download-action';
import { extractInvokePreviewAction } from '../../extractors/action/extract-invoke-preview-action';
import { extractInvokeViewAction } from '../../extractors/action/extract-invoke-view-action';
import { messages } from '../../messages';
import { toAction } from '../../utils/actions/to-action';
import type { AnalyticsOrigin } from '../../utils/types';
import type { CardActionOptions, CardInnerAppearance } from '../../view/Card/types';
import useInvokeClientAction from '../hooks/use-invoke-client-action';
import { useSmartCardState as useLinkState } from '../store';

export interface LinkAction {
	/**
	 * Unique ID for the action.
	 * @example `delete-action`
	 */
	id: string;
	/**
	 * Text to render for the action.
	 * @description Use this in tooltips and UI.
	 * @example `Delete`.
	 */
	text: React.ReactNode;
	/**
	 * Promise to invoke on triggering this action.
	 * @example Clicking on `Delete` leading to deletion of content.
	 */
	invoke: () => Promise<any>;
}

export interface UseSmartLinkActionsOpts {
	/**
	 * Smart Link URL for which actions will be invoked.
	 * @example https://start.atlassian.com
	 */
	url: string;
	/**
	 * Appearance under which these actions will be invoked.
	 * @example `block` for card views.
	 */
	appearance: CardInnerAppearance;
	/**
	 * Platform on which actions are being invoked.
	 * @default 'web'
	 */
	platform?: JsonLd.Primitives.Platforms;
	/**
	 * Smart link origin that the action being invoked from.
	 */
	origin?: AnalyticsOrigin;
	/**
	 * Configure the visiblity of actions
	 */
	actionOptions?: CardActionOptions;
}

export function useSmartLinkActions({
	url,
	appearance,
	origin,
	actionOptions,
}: UseSmartLinkActionsOpts) {
	const id: string = useMemo(() => uuid(), []);

	const linkState = useLinkState(url);
	const { fireEvent } = useAnalyticsEvents();
	const { isPreviewPanelAvailable, openPreviewPanel } = useSmartLinkContext();
	const invokeClientAction = useInvokeClientAction({ fireEvent });

	if (linkState.details && !actionOptions?.hide) {
		const actions = [];

		const invokeParam = { actionOptions, appearance, id, response: linkState.details };
		const downloadActionProps = extractInvokeDownloadAction(invokeParam);
		if (downloadActionProps) {
			actions.push(
				toAction(downloadActionProps, invokeClientAction, messages.download, 'download-content'),
			);
		}

		const viewActionProps = extractInvokeViewAction(invokeParam);
		if (viewActionProps) {
			actions.push(toAction(viewActionProps, invokeClientAction, messages.view, 'view-content'));
		}

		const previewActionProps = extractInvokePreviewAction({
			...invokeParam,
			fireEvent,
			origin,
			isPreviewPanelAvailable,
			openPreviewPanel,
		});
		if (previewActionProps) {
			actions.push(
				toAction(
					previewActionProps.invokeAction,
					invokeClientAction,
					messages.preview_improved,
					'preview-content',
				),
			);
		}
		return actions;
	}
	return [];
}
