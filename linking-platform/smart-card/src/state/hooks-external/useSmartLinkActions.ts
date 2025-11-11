import { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { extractInvokeDownloadAction } from '../../extractors/action/extract-invoke-download-action';
import { extractInvokePreviewAction } from '../../extractors/action/extract-invoke-preview-action';
import { extractInvokeViewAction } from '../../extractors/action/extract-invoke-view-action';
import { messages } from '../../messages';
import { toAction } from '../../utils/actions/to-action';
import type { AnalyticsOrigin } from '../../utils/types';
import type { CardActionOptions, CardInnerAppearance } from '../../view/Card/types';
import useInvokeClientAction from '../hooks/use-invoke-client-action';
import useResolve from '../hooks/use-resolve';
import { useSmartCardState as useLinkState } from '../store';

export interface LinkAction {
	/**
	 * Unique ID for the action.
	 * @example `delete-action`
	 */
	id: string;
	/**
	 * Promise to invoke on triggering this action.
	 * @example Clicking on `Delete` leading to deletion of content.
	 */
	invoke: () => Promise<any>;
	/**
	 * Text to render for the action.
	 * @description Use this in tooltips and UI.
	 * @example `Delete`.
	 */
	text: React.ReactNode;
}

export interface UseSmartLinkActionsOpts {
	/**
	 * Configure the visiblity of actions
	 */
	actionOptions?: CardActionOptions;
	/**
	 * Appearance under which these actions will be invoked.
	 * @example `block` for card views.
	 */
	appearance: CardInnerAppearance;
	/**
	 * Smart link origin that the action being invoked from.
	 */
	origin?: AnalyticsOrigin;
	/**
	 * Platform on which actions are being invoked.
	 * @default 'web'
	 */
	platform?: JsonLd.Primitives.Platforms;
	/**
	 * Whether to prefetch the link.
	 * @default false
	 */
	prefetch?: boolean;
	/**
	 * Smart Link URL for which actions will be invoked.
	 * @example https://start.atlassian.com
	 */
	url: string;
}

export function useSmartLinkActions({
	url,
	appearance,
	origin,
	actionOptions,
	prefetch,
}: UseSmartLinkActionsOpts) {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const id: string = useMemo(() => uuid(), []);

	const linkState = useLinkState(url);
	const { fireEvent } = useAnalyticsEvents();
	const { isPreviewPanelAvailable, openPreviewPanel } = useSmartLinkContext();
	const invokeClientAction = useInvokeClientAction({ fireEvent });
	const resolve = useResolve();

	if (
		expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') &&
		prefetch &&
		!linkState.details
	) {
		resolve(url);
	}

	if (linkState.details && !actionOptions?.hide) {
		const actions: LinkAction[] = [];

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
