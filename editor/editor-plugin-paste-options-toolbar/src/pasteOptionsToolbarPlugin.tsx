import { useEffect } from 'react';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { FloatingToolbarConfig, ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { hideToolbar, showToolbar } from './editor-commands/commands';
import type { PasteOptionsToolbarPlugin } from './pasteOptionsToolbarPluginType';
import { createPlugin } from './pm-plugins/main';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from './types/types';
import type { PasteOtionsPluginState } from './types/types';
import { buildToolbar, isToolbarVisible } from './ui/toolbar';

const useSharedPasteState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined) => {
		const { lastContentPasted } = useSharedPluginStateWithSelector(api, ['paste'], (states) => ({
			lastContentPasted: states.pasteState?.lastContentPasted,
		}));
		return { lastContentPasted };
	},
	(api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined) => {
		const { pasteState } = useSharedPluginState(api, ['paste']);
		return { lastContentPasted: pasteState?.lastContentPasted };
	},
);

export const pasteOptionsToolbarPlugin: PasteOptionsToolbarPlugin = ({ config, api }) => {
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
			const { lastContentPasted } = useSharedPasteState(api);

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
