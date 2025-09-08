import React from 'react';

import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createComponentRegistry } from '@atlaskit/editor-toolbar-model';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { editorToolbarPluginKey } from './pm-plugins/plugin-key';
import type { ToolbarPlugin } from './toolbarPluginType';
import { DEFAULT_POPUP_SELECTORS } from './ui/consts';
import { SelectionToolbar } from './ui/SelectionToolbar';
import { getToolbarComponents } from './ui/toolbar-components';
import { isEventInContainer } from './ui/utils/toolbar';

export type EditorToolbarPluginState = {
	shouldShowToolbar: boolean;
};

export const toolbarPlugin: ToolbarPlugin = ({
	api,
	config = {
		disableSelectionToolbar: false,
		disableSelectionToolbarWhenPinned: false,
		enableNewToolbarExperience: true,
	},
}) => {
	const { disableSelectionToolbar, disableSelectionToolbarWhenPinned } = config;

	const registry = createComponentRegistry();

	registry.register(getToolbarComponents(api, disableSelectionToolbar));

	return {
		name: 'toolbar',

		actions: {
			registerComponents: (toolbarComponents: RegisterComponent[], replaceItems = false) => {
				if (replaceItems) {
					registry.safeRegister(toolbarComponents);
				} else {
					registry.register(toolbarComponents);
				}
			},

			getComponents: () => {
				return registry.components;
			},
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return editorToolbarPluginKey.getState(editorState);
		},
		pmPlugins() {
			return [
				{
					name: 'editor-toolbar-selection',
					plugin: () => {
						return new SafePlugin({
							key: editorToolbarPluginKey,
							state: {
								init(): EditorToolbarPluginState {
									return {
										shouldShowToolbar: false,
									};
								},
								apply(tr, pluginState: EditorToolbarPluginState) {
									const meta = tr.getMeta(editorToolbarPluginKey);
									const newPluginState = pluginState;
									if (meta) {
										return {
											...newPluginState,
											...meta,
										};
									}

									return newPluginState;
								},
							},
							view(view) {
								const unbind = bind(view.root, {
									type: 'mouseup',
									listener: function (this: Document | ShadowRoot, ev: Event) {
										const event = ev as MouseEvent;
										const isInToolbar = isEventInContainer(
											event,
											DEFAULT_POPUP_SELECTORS.toolbarContainer,
										);
										const isInPortal = isEventInContainer(event, DEFAULT_POPUP_SELECTORS.portal);

										// We only want to set selectionStable to true if the editor has focus
										// to prevent the toolbar from showing when the editor is blurred
										// due to a click outside the editor.
										const editorViewModePlugin = api?.editorViewMode?.sharedState.currentState();
										const isViewModeEnabled = editorViewModePlugin?.mode === 'view';
										view.dispatch(
											view.state.tr.setMeta(editorToolbarPluginKey, {
												shouldShowToolbar: !isViewModeEnabled
													? view.hasFocus() || isInToolbar || isInPortal
													: true,
											}),
										);
									},
								});

								const unbindEditorViewFocus = bind(view.dom, {
									type: 'focus',
									listener: () => {
										view.dispatch(
											view.state.tr.setMeta(editorToolbarPluginKey, { shouldShowToolbar: true }),
										);
									},
								});

								return {
									destroy() {
										unbind();
										unbindEditorViewFocus();
									},
								};
							},
							props: {
								handleDOMEvents: {
									mousedown: (view) => {
										view.dispatch(
											view.state.tr.setMeta(editorToolbarPluginKey, {
												shouldShowToolbar: false,
											}),
										);
										return false;
									},
								},
							},
						});
					},
				},
			];
		},

		contentComponent: !disableSelectionToolbar
			? ({ editorView, popupsMountPoint }) => {
					return (
						<SelectionToolbar
							api={api}
							editorView={editorView}
							mountPoint={popupsMountPoint}
							disableSelectionToolbarWhenPinned={disableSelectionToolbarWhenPinned ?? false}
						/>
					);
				}
			: undefined,
	};
};
