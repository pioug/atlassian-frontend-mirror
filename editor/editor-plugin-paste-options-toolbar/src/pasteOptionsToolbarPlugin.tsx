import React, { useEffect } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { FloatingToolbarConfig } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { hideToolbar, showToolbar } from './editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from './pasteOptionsToolbarPluginType';
import { createPlugin } from './pm-plugins/main';
import type { PasteOptionsPluginState } from './types/types';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from './types/types';
import { firePasteActionsMenuExperimentExposure } from './ui/on-paste-actions-menu/exposure';
import { firePasteActionsMenuV2ExperimentExposure } from './ui/on-paste-actions-menu/exposure-v2';
import { PasteActionsMenu } from './ui/on-paste-actions-menu/PasteActionsMenu';
import { getPasteMenuComponents } from './ui/on-paste-actions-menu/PasteMenuComponents';
import { buildToolbar, isToolbarVisible } from './ui/toolbar';
import { createPasteMenuRuleFactories } from './ui/utils/paste-menu-rules/rules';

export const pasteOptionsToolbarPlugin: PasteOptionsToolbarPlugin = ({ config, api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	if (
		config?.usePopupBasedPasteActionsMenu &&
		expValEqualsNoExposure('platform_editor_paste_actions_menu', 'isEnabled', true)
	) {
		api?.uiControlRegistry?.actions.register(getPasteMenuComponents({ api }));
	}

	if (config?.pasteMenuButtonsFactory && config?.usePopupBasedPasteActionsMenu) {
		const rules = (() => {
			const getContext = () => {
				const pasteOptsState = api?.pasteOptionsToolbarPlugin?.sharedState.currentState();
				const pasteState = api?.paste?.sharedState.currentState();
				return {
					getPlaintextLength: () => pasteOptsState?.plaintextLength ?? 0,
					getAncestorNodeNames: () => pasteOptsState?.pasteAncestorNodeNames ?? [],
					getPastedText: () => pasteState?.lastContentPasted?.text ?? '',
					getPastedSlice: () => pasteState?.lastContentPasted?.pastedSlice,
					getNodeTypes: () => [],
					getPasteSource: () => pasteState?.lastContentPasted?.pasteSource,
				};
			};
			return createPasteMenuRuleFactories(getContext);
		})();
		const productButtons = config.pasteMenuButtonsFactory(rules);
		api?.uiControlRegistry?.actions.register(productButtons);
	}

	return {
		name: 'pasteOptionsToolbarPlugin',

		actions: {
			getPasteMenuRules: () => {
				const getContext = () => {
					const pasteOptsState = api?.pasteOptionsToolbarPlugin?.sharedState.currentState();
					const pasteState = api?.paste?.sharedState.currentState();
					return {
						getPlaintextLength: () => pasteOptsState?.plaintextLength ?? 0,
						getAncestorNodeNames: () => pasteOptsState?.pasteAncestorNodeNames ?? [],
						getPastedText: () => pasteState?.lastContentPasted?.text ?? '',
						getPastedSlice: () => pasteState?.lastContentPasted?.pastedSlice,
						getNodeTypes: () => [],
						getPasteSource: () => pasteState?.lastContentPasted?.pasteSource,
					};
				};
				return createPasteMenuRuleFactories(getContext);
			},
		},
		pmPlugins() {
			return [
				{
					name: 'pasteOptionsToolbarPlugin',
					plugin: ({ dispatch }) =>
						createPlugin(dispatch, {
							useNewPasteMenu:
								config?.usePopupBasedPasteActionsMenu &&
								expValEqualsNoExposure('platform_editor_paste_actions_menu', 'isEnabled', true),
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
				if (
					config?.usePopupBasedPasteActionsMenu &&
					expValEqualsNoExposure('platform_editor_paste_actions_menu', 'isEnabled', true)
				) {
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
			if (
				!(
					config?.usePopupBasedPasteActionsMenu &&
					expValEqualsNoExposure('platform_editor_paste_actions_menu', 'isEnabled', true)
				) ||
				!editorView
			) {
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
				if (
					config?.usePopupBasedPasteActionsMenu &&
					fg('platform_editor_paste_actions_menu_exposure')
				) {
					firePasteActionsMenuExperimentExposure(
						lastContentPasted?.text?.length ?? 0,
						editorView.state,
						lastContentPasted?.pasteStartPos,
						lastContentPasted?.pasteEndPos,
						lastContentPasted?.text,
						lastContentPasted?.pastedSlice,
					);
				}

				// These two need to be seperate to prevent them being dependant on each other
				if (
					config?.usePopupBasedPasteActionsMenu &&
					fg('platform_editor_paste_actions_menu_v2_exposure')
				) {
					firePasteActionsMenuV2ExperimentExposure(
						lastContentPasted?.text?.length ?? 0,
						editorView.state,
						lastContentPasted?.pasteStartPos,
						lastContentPasted?.pasteEndPos,
						lastContentPasted?.text,
						lastContentPasted?.pastedSlice,
					);
				}

				if (
					config?.usePopupBasedPasteActionsMenu &&
					expValEqualsNoExposure('platform_editor_paste_actions_menu', 'isEnabled', true)
				) {
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
