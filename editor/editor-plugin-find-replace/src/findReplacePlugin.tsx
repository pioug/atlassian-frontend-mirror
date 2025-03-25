import React from 'react';

import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	type PMPlugin,
	ToolbarSize,
	type ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { FindReplacePlugin } from './findReplacePluginType';
import { activate } from './pm-plugins/commands';
import { activateWithAnalytics } from './pm-plugins/commands-with-analytics';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { findReplacePluginKey } from './pm-plugins/plugin-key';
import type { FindReplaceToolbarButtonActionProps } from './types';
import FindReplaceDropDownOrToolbarButtonWithState from './ui/FindReplaceDropDownOrToolbarButtonWithState';

export const findReplacePlugin: FindReplacePlugin = ({ config: props, api }) => {
	const editorViewRef: Record<'current', EditorView | null> = { current: null };

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsBoundariesElement,
		popupsMountPoint,
		popupsScrollableElement,
		isToolbarReducedSpacing,
		toolbarSize,
		editorView,
		containerElement,
		dispatchAnalyticsEvent,
	}) => {
		const isButtonHidden = fg('platform_editor_toolbar_responsive_fixes')
			? toolbarSize < ToolbarSize.XL
			: false;
		if (props?.twoLineEditorToolbar) {
			return null;
		} else {
			return (
				<FindReplaceDropDownOrToolbarButtonWithState
					popupsBoundariesElement={popupsBoundariesElement}
					popupsMountPoint={popupsMountPoint}
					popupsScrollableElement={popupsScrollableElement}
					isToolbarReducedSpacing={isToolbarReducedSpacing}
					editorView={editorView}
					containerElement={containerElement}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					takeFullWidth={props?.takeFullWidth}
					api={api}
					isButtonHidden={isButtonHidden}
				/>
			);
		}
	};
	api?.primaryToolbar?.actions.registerComponent({
		name: 'findReplace',
		component: primaryToolbarComponent,
	});

	return {
		name: 'findReplace',

		pmPlugins() {
			const plugins: Array<PMPlugin> = [
				{
					name: 'findReplace',
					plugin: ({ dispatch }) => createPlugin(dispatch),
				},
				{
					name: 'findReplaceKeymap',
					plugin: () => keymapPlugin(api?.analytics?.actions),
				},
			];

			if (editorExperiment('platform_editor_controls', 'variant1', { exposure: false })) {
				plugins.push({
					name: 'findReplaceEditorViewReferencePlugin',
					plugin: () => {
						return new SafePlugin({
							view: (editorView: EditorView) => {
								editorViewRef.current = editorView;
								return {
									destroy: () => {
										editorViewRef.current = null;
									},
								};
							},
						});
					},
				});
			}

			return plugins;
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return findReplacePluginKey.getState(editorState) || undefined;
		},

		actions: {
			getToolbarButton: ({
				popupsBoundariesElement,
				popupsMountPoint,
				popupsScrollableElement,
				editorView,
				containerElement,
				dispatchAnalyticsEvent,
				isToolbarReducedSpacing,
			}: FindReplaceToolbarButtonActionProps) => {
				return (
					<FindReplaceDropDownOrToolbarButtonWithState
						popupsBoundariesElement={popupsBoundariesElement}
						popupsMountPoint={popupsMountPoint}
						popupsScrollableElement={popupsScrollableElement}
						editorView={editorView}
						containerElement={containerElement}
						dispatchAnalyticsEvent={dispatchAnalyticsEvent}
						isToolbarReducedSpacing={isToolbarReducedSpacing}
						api={api}
					/>
				);
			},
			activateFindReplace: (
				triggerMethod?: TRIGGER_METHOD.SHORTCUT | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.EXTERNAL,
			) => {
				if (!editorViewRef.current) {
					return false;
				}

				const { state, dispatch } = editorViewRef.current;

				if (api?.analytics?.actions) {
					activateWithAnalytics(api?.analytics?.actions)({
						triggerMethod: triggerMethod || TRIGGER_METHOD.EXTERNAL,
					})(state, dispatch);
				} else {
					activate()(state, dispatch);
				}
				return true;
			},
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,

		contentComponent: editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
			? ({
					editorView,
					containerElement,
					popupsMountPoint,
					popupsBoundariesElement,
					popupsScrollableElement,
					wrapperElement,
					dispatchAnalyticsEvent,
				}) => {
					const popupsMountPointEl =
						popupsMountPoint ||
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(wrapperElement?.querySelector("[data-editor-container='true']") as HTMLElement);

					return (
						<FindReplaceDropDownOrToolbarButtonWithState
							popupsBoundariesElement={popupsBoundariesElement}
							popupsMountPoint={popupsMountPointEl}
							popupsScrollableElement={popupsScrollableElement || containerElement || undefined}
							isToolbarReducedSpacing={false}
							editorView={editorView}
							containerElement={containerElement}
							dispatchAnalyticsEvent={dispatchAnalyticsEvent}
							takeFullWidth={props?.takeFullWidth}
							api={api}
							doesNotHaveButton={true}
						/>
					);
				}
			: undefined,
	};
};
