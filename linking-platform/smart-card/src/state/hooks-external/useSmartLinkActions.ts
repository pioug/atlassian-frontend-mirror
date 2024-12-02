import { useMemo } from 'react';

import { type JsonLd } from 'json-ld-types';
import uuid from 'uuid';

import { extractDownloadActionProps } from '../../extractors/action/extractDownloadActionProps';
import { extractPreviewActionProps } from '../../extractors/action/extractPreviewActionProps';
import { extractViewActionProps } from '../../extractors/action/extractViewActionProps';
import { messages } from '../../messages';
import { toAction } from '../../utils/actions/to-action';
import type { AnalyticsOrigin } from '../../utils/types';
import type { CardActionOptions, CardInnerAppearance } from '../../view/Card/types';
import { useSmartLinkAnalytics as useLinkAnalytics } from '../analytics';
import { getExtensionKey } from '../helpers';
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
	const linkAnalytics = useLinkAnalytics(url, id);
	const invokeClientAction = useInvokeClientAction({ analytics: linkAnalytics });

	if (linkState.details && !actionOptions?.hide) {
		const opts = {
			response: linkState.details,
			handleInvoke: invokeClientAction,
			analytics: linkAnalytics,
			origin,
			extensionKey: getExtensionKey(linkState.details),
			source: appearance,
			actionOptions,
		};

		const actions = [];

		const downloadActionProps = extractDownloadActionProps(opts);
		if (downloadActionProps) {
			actions.push(
				toAction(downloadActionProps, invokeClientAction, messages.download, 'download-content'),
			);
		}

		const viewActionProps = extractViewActionProps(opts);
		if (viewActionProps) {
			actions.push(toAction(viewActionProps, invokeClientAction, messages.view, 'view-content'));
		}

		const previewActionProps = extractPreviewActionProps(opts);
		if (previewActionProps) {
			actions.push(
				toAction(
					previewActionProps,
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
