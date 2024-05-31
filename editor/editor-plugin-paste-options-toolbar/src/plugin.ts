import { useEffect } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type {
	FloatingToolbarConfig,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PastePlugin } from '@atlaskit/editor-plugin-paste';

import { hideToolbar, showToolbar } from './commands';
import { createPlugin } from './pm-plugins/main';
import { buildToolbar, isToolbarVisible } from './toolbar';
import type { PasteOtionsPluginState } from './types';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from './types';

export const pasteOptionsToolbarPlugin: NextEditorPlugin<
	'pasteOptionsToolbarPlugin',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>, PastePlugin];
	}
> = ({ config, api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	return {
		name: 'pasteOptionsToolbarPlugin',
		pmPlugins() {
			return [
				{
					name: 'pasteOptionsToolbarPlugin',
					plugin: ({ dispatch }) => createPlugin(dispatch),
				},
			];
		},

		pluginsOptions: {
			floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
				const pastePluginState = pasteOptionsPluginKey.getState(state) as PasteOtionsPluginState;

				if (pastePluginState.showToolbar) {
					return buildToolbar(state, intl, editorAnalyticsAPI);
				}

				return;
			},
		},

		usePluginHook({ editorView }) {
			const { pasteState } = useSharedPluginState(api, ['paste']);
			const lastContentPasted = pasteState?.lastContentPasted;

			useEffect(() => {
				if (!lastContentPasted) {
					hideToolbar()(editorView.state, editorView.dispatch);
					return;
				}

				let selectedOption = ToolbarDropdownOption.None;
				if (!lastContentPasted.isPlainText) {
					selectedOption = ToolbarDropdownOption.RichText;
				} else if (lastContentPasted.isShiftPressed) {
					selectedOption = ToolbarDropdownOption.PlainText;
				} else {
					selectedOption = ToolbarDropdownOption.Markdown;
				}

				if (!isToolbarVisible(editorView.state, lastContentPasted)) {
					return;
				}

				showToolbar(lastContentPasted, selectedOption)(editorView.state, editorView.dispatch);
			}, [lastContentPasted, editorView]);
		},
	};
};
