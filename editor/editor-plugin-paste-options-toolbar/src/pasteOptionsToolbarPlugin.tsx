import React, { useEffect } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { FloatingToolbarConfig } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { hideToolbar, showToolbar } from './editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from './pasteOptionsToolbarPluginType';
import { createPlugin } from './pm-plugins/main';
import type { PasteOptionsPluginState } from './types/types';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from './types/types';
import { PasteActionsMenu } from './ui/on-paste-actions-menu/PasteActionsMenu';
import { buildToolbar, isToolbarVisible } from './ui/toolbar';

export const pasteOptionsToolbarPlugin: PasteOptionsToolbarPlugin = ({ api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const getSharedState = (editorState: EditorState | undefined): PasteOptionsToolbarSharedState => {
		if (!editorState) {
			return {
				isPlainText: false,
				plaintextLength: 0,
				selectedOption: ToolbarDropdownOption.None,
				showToolbar: false,
			};
		}
		const pluginState = pasteOptionsPluginKey.getState(editorState) as
			| PasteOptionsPluginState
			| undefined;
		return {
			isPlainText: pluginState?.isPlainText ?? false,
			plaintextLength: pluginState?.plaintext.length ?? 0,
			selectedOption: pluginState?.selectedOption ?? ToolbarDropdownOption.None,
			showToolbar: pluginState?.showToolbar ?? false,
		};
	};

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

		...(expValEquals('platform_editor_paste_actions_menu', 'isEnabled', true)
			? { getSharedState }
			: {}),

		pluginsOptions: {
			floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
				if (expValEquals('platform_editor_paste_actions_menu', 'isEnabled', true)) {
					return;
				}
				const pastePluginState = pasteOptionsPluginKey.getState(state) as PasteOptionsPluginState;

				if (pastePluginState.showToolbar) {
					return buildToolbar(state, intl, editorAnalyticsAPI);
				}

				return;
			},
		},

		contentComponent({
			editorView,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
		}) {
			if (!expValEquals('platform_editor_paste_actions_menu', 'isEnabled', true) || !editorView) {
				return null;
			}
			return (
				<PasteActionsMenu
					api={api}
					editorView={editorView}
					mountTo={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					editorAnalyticsAPI={editorAnalyticsAPI}
				/>
			);
		},

		usePluginHook({ editorView }) {
			const { lastContentPasted } = useSharedPluginStateWithSelector(api, ['paste'], (states) => ({
				lastContentPasted: states.pasteState?.lastContentPasted,
			}));

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
