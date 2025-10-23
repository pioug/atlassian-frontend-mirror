import React from 'react';

import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { createComponentRegistry } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import selectionToolbarOpenExperience from './pm-plugins/experiences/SelectionToolbarOpenExperience';
import { editorToolbarPluginKey } from './pm-plugins/plugin-key';
import type { EditorToolbarPluginState, ToolbarPlugin } from './toolbarPluginType';
import { DEFAULT_POPUP_SELECTORS } from './ui/consts';
import { SelectionToolbar, SelectionToolbarWithErrorBoundary } from './ui/SelectionToolbar';
import { getToolbarComponents } from './ui/toolbar-components';
import { isEventInContainer } from './ui/utils/toolbar';

function getSelectedNode(editorState: EditorState): EditorToolbarPluginState['selectedNode'] {
	const { selection } = editorState;

	if (selection instanceof NodeSelection) {
		return {
			node: selection.node,
			pos: selection.from,
			nodeType: selection.node.type.name,
			marks: selection.node.marks.map((mark) => `${mark.type.name}:${JSON.stringify(mark.attrs)}`),
		};
	}

	const { nodes } = editorState.schema;
	const selectedNode = findSelectedNodeOfType([
		nodes.paragraph,
		nodes.heading,
		nodes.blockquote,
		nodes.panel,
		nodes.codeBlock,
	])(selection);

	if (selectedNode) {
		return {
			node: selectedNode.node,
			pos: selectedNode.pos,
			nodeType: selectedNode.node.type.name,
			marks: selectedNode.node.marks.map(
				(mark) => `${mark.type.name}:${JSON.stringify(mark.attrs)}`,
			),
		};
	}

	const parentNode = findParentNodeOfType([
		nodes.paragraph,
		nodes.heading,
		nodes.blockquote,
		nodes.panel,
		nodes.listItem,
		nodes.taskItem,
	])(selection);

	if (parentNode) {
		return {
			node: parentNode.node,
			pos: parentNode.pos,
			nodeType: parentNode.node.type.name,
			marks: parentNode.node.marks.map((mark) => `${mark.type.name}:${JSON.stringify(mark.attrs)}`),
		};
	}

	const $pos = selection.$from;
	return {
		node: $pos.parent,
		pos: $pos.pos,
		nodeType: $pos.parent.type.name,
		marks: $pos.marks().map((mark) => `${mark.type.name}:${JSON.stringify(mark.attrs)}`),
	};
}

export const toolbarPlugin: ToolbarPlugin = ({
	api,
	config = {
		disableSelectionToolbar: false,
		disableSelectionToolbarWhenPinned: false,
	},
}) => {
	const popupsMountPointRef: { current?: HTMLElement } = {};
	const editorViewDomRef: { current?: HTMLElement } = {};
	const {
		disableSelectionToolbar,
		disableSelectionToolbarWhenPinned,
		contextualFormattingEnabled = 'always-pinned',
	} = config;

	const registry = createComponentRegistry();

	registry.register(
		getToolbarComponents(contextualFormattingEnabled, api, disableSelectionToolbar),
	);

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

			contextualFormattingMode: () => {
				return contextualFormattingEnabled;
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
								init(_, editorState): EditorToolbarPluginState {
									return {
										shouldShowToolbar: false,
										selectedNode: getSelectedNode(editorState),
									};
								},
								apply(tr, pluginState: EditorToolbarPluginState, _, newState) {
									const meta = tr.getMeta(editorToolbarPluginKey);
									let newPluginState = { ...pluginState };

									if (expValEquals('platform_editor_toolbar_aifc_patch_5', 'isEnabled', true)) {
										const shouldUpdateNode = tr.docChanged || tr.selectionSet;

										if (shouldUpdateNode) {
											const newSelectedNode = getSelectedNode(newState);
											const oldNode = pluginState.selectedNode;

											const hasNodeChanged =
												!oldNode ||
												!newSelectedNode ||
												oldNode.nodeType !== newSelectedNode.nodeType ||
												oldNode.pos !== newSelectedNode.pos ||
												JSON.stringify(oldNode.marks) !== JSON.stringify(newSelectedNode.marks);

											if (hasNodeChanged) {
												newPluginState.selectedNode = newSelectedNode;
											}
										}
									}

									if (meta) {
										newPluginState = {
											...newPluginState,
											...meta,
										};
									}

									return newPluginState;
								},
							},
							view(view) {
								editorViewDomRef.current = view.dom;

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
				...(expValEquals('platform_editor_experience_tracking', 'isEnabled', true)
					? [
							{
								name: 'selectionToolbarOpenExperience',
								plugin: () =>
									selectionToolbarOpenExperience({ popupsMountPointRef, editorViewDomRef }),
							},
						]
					: []),
			];
		},

		contentComponent: !disableSelectionToolbar
			? ({ editorView, popupsMountPoint }) => {
					popupsMountPointRef.current = popupsMountPoint;

					if (!editorView) {
						return null;
					}

					if (fg('platform_editor_toolbar_aifc_patch_7')) {
						return (
							<SelectionToolbarWithErrorBoundary
								api={api}
								editorView={editorView}
								mountPoint={popupsMountPoint}
								disableSelectionToolbarWhenPinned={disableSelectionToolbarWhenPinned ?? false}
							/>
						);
					}

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
