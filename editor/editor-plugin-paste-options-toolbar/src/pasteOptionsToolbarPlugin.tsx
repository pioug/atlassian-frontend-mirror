import React, { useEffect } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { FloatingToolbarConfig } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { hideToolbar, showToolbar } from './editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from './pasteOptionsToolbarPluginType';
import { createPlugin } from './pm-plugins/main';
import type { PasteOptionsPluginState } from './types/types';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from './types/types';
import { PasteActionsMenu } from './ui/on-paste-actions-menu/PasteActionsMenu';
import { getPasteMenuComponents } from './ui/on-paste-actions-menu/PasteMenuComponents';
import { buildToolbar, isToolbarVisible } from './ui/toolbar';

export const pasteOptionsToolbarPlugin: PasteOptionsToolbarPlugin = ({ config, api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	if (config?.usePopupBasedPasteActionsMenu) {
		api?.uiControlRegistry?.actions.register(getPasteMenuComponents({ api }));
	}

	return {
		name: 'pasteOptionsToolbarPlugin',
		pmPlugins() {
			return [
				{
					name: 'pasteOptionsToolbarPlugin',
					plugin: ({ dispatch }) =>
						createPlugin(dispatch, {
							useNewPasteMenu: config?.usePopupBasedPasteActionsMenu,
						}),
				},
			];
		},

		getSharedState(editorState: EditorState | undefined): PasteOptionsToolbarSharedState {
			if (!editorState) {
				return {
					isPlainText: false,
					pasteAncestorNodeNames: [],
					pasteEndPos: 0,
					pasteStartPos: 0,
					plaintextLength: 0,
					selectedOption: ToolbarDropdownOption.None,
					showLegacyOptions: false,
					showToolbar: false,
				};
			}
			const pluginState = pasteOptionsPluginKey.getState(editorState) as
				| PasteOptionsPluginState
				| undefined;
			return {
				isPlainText: pluginState?.isPlainText ?? false,
				pasteAncestorNodeNames: pluginState?.pasteAncestorNodeNames ?? [],
				pasteEndPos: pluginState?.pasteEndPos ?? 0,
				pasteStartPos: pluginState?.pasteStartPos ?? 0,
				plaintextLength: pluginState?.plaintext.length ?? 0,
				selectedOption: pluginState?.selectedOption ?? ToolbarDropdownOption.None,
				showLegacyOptions: pluginState?.showLegacyOptions ?? false,
				showToolbar: pluginState?.showToolbar ?? false,
			};
		},

		pluginsOptions: {
			floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
				if (config?.usePopupBasedPasteActionsMenu) {
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
			if (!config?.usePopupBasedPasteActionsMenu || !editorView) {
				return null;
			}
			return (
				<PasteActionsMenu
					api={api}
					editorView={editorView}
					mountTo={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
				/>
			);
		},

		usePluginHook({ editorView }) {
			const { lastContentPasted } = useSharedPluginStateWithSelector(api, ['paste'], (states) => ({
				lastContentPasted: states.pasteState?.lastContentPasted,
			}));

			useEffect(() => {
				if (config?.usePopupBasedPasteActionsMenu) {
					return;
				}

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
