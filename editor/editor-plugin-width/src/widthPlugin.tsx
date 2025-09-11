import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import {
	useResizeWidthObserver,
	useResizeWidthObserverLegacy,
} from './ui/hooks/useResizeWidthObserver';
import { type WidthPlugin } from './widthPluginType';

const useResizeWidthObserverHook = conditionalHooksFactory(
	() => editorExperiment('platform_editor_stop_width_reflows', true, { exposure: true }),
	useResizeWidthObserver,
	useResizeWidthObserverLegacy,
);

/**
 * Width plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const widthPlugin: WidthPlugin = () => {
	return {
		name: 'width',

		pmPlugins: () => [
			{
				name: 'width',
				plugin: ({ dispatch, dispatchAnalyticsEvent }) =>
					createPlugin(dispatch, dispatchAnalyticsEvent),
			},
		],

		getSharedState: (editorState) => {
			if (!editorState) {
				return undefined;
			}

			return pluginKey.getState(editorState);
		},

		usePluginHook: useResizeWidthObserverHook,
	};
};
