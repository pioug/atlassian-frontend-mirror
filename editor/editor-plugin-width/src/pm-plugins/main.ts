import {
	type DispatchAnalyticsEvent,
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';
import { akEditorDefaultLayoutWidth, VIEWPORT_SIZES } from '@atlaskit/editor-shared-styles/consts';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { pluginKey } from './plugin-key';

export function createPlugin(
	dispatch: Dispatch<WidthPluginState>,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
): SafePlugin | undefined {
	let hasSentInitialEditorWidthAnalytics = false;

	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => {
				if (editorExperiment('platform_editor_stop_width_reflows', true)) {
					return {
						// Optimise for default laptop MDPI width - this will update with the resize observer
						width: VIEWPORT_SIZES.laptopMDPI.width,
						// Use the default width - if full width or small it will update with resize observer
						lineLength: akEditorDefaultLayoutWidth,
					};
				} else {
					return {
						width: document.body.offsetWidth,
					};
				}
			},
			apply(tr, pluginState: WidthPluginState) {
				const meta: WidthPluginState | undefined = tr.getMeta(pluginKey);

				if (!meta) {
					return pluginState;
				}

				const newPluginState: WidthPluginState = editorExperiment(
					'platform_editor_stop_width_reflows',
					true,
				)
					? {
							width: meta.width ?? pluginState?.width,
							lineLength: meta.lineLength ?? pluginState?.lineLength,
						}
					: {
							...pluginState,
							...meta,
						};

				if (
					newPluginState &&
					(pluginState.width !== newPluginState.width ||
						pluginState.lineLength !== newPluginState.lineLength)
				) {
					if (
						!hasSentInitialEditorWidthAnalytics &&
						expValEquals('platform_editor_editor_width_analytics', 'isEnabled', true)
					) {
						hasSentInitialEditorWidthAnalytics = true;

						dispatchAnalyticsEvent({
							eventType: EVENT_TYPE.OPERATIONAL,
							action: ACTION.INITIAL_EDITOR_WIDTH,
							actionSubject: ACTION_SUBJECT.EDITOR,
							attributes: { width: newPluginState.width },
						});
					}

					dispatch(pluginKey, newPluginState);
					return newPluginState;
				}
				return pluginState;
			},
		},
	});
}
