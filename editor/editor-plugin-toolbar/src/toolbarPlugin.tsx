import React from 'react';

import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { createComponentRegistry } from '@atlaskit/editor-toolbar-model/create-registry';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { getSelectionToolbarOpenExperiencePlugin } from './pm-plugins/experiences/selection-toolbar-open-experience';
import { editorToolbarPluginKey } from './pm-plugins/plugin-key';
import type { EditorToolbarPluginState, ToolbarPlugin } from './toolbarPluginType';
import { SelectionToolbarWithErrorBoundary } from './ui/SelectionToolbar';
import { getToolbarComponents } from './ui/toolbar-components';

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
	const refs: { popupsMountPoint?: HTMLElement; toolbarMouseUpEvent?: Event } = {};
	const handleToolbarMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
		refs.toolbarMouseUpEvent = event.nativeEvent;
	};
	const {
		disableSelectionToolbar,
		disableSelectionToolbarWhenPinned,
		contextualFormattingEnabled = 'always-pinned',
		breakpointPreset,
	} = config;

	const registry = createComponentRegistry();

	registry.register(getToolbarComponents(contextualFormattingEnabled, api, breakpointPreset));

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

			// EDITOR-6558: `componentFilter` is evaluated at read time (not at
			// `registerComponents` time) so it can react to runtime state
			// (e.g. the current markdown view mode) without forcing every
			// plugin to re-register its components. Returning a new array on
			// every call means React-tree consumers re-render whenever the
			// underlying filter would change.
			getComponents: () => {
				return config?.componentFilter
					? registry.components.filter(config.componentFilter)
					: registry.components;
			},

			contextualFormattingMode: () => {
				// Returns the config-time mode only. The runtime override
				// (`EditorToolbarPluginState.contextualFormattingModeOverride`)
				// lives in PM state and must be merged in by the React render
				// site — see SelectionToolbar / Section / FullPageToolbarNext for
				// the `runtimeOverride ?? action() ?? 'always-pinned'` pattern.
				// Doing the merge here would require closure-capturing `editorView`,
				// which races with StrictMode double-mount.
				return (
					config?.contextualFormattingModeOverride?.() ??
					contextualFormattingEnabled ??
					'always-pinned'
				);
			},

			getBreakpointPreset: () => {
				return breakpointPreset;
			},
		},

		commands: {
			setContextualFormattingModeOverride: (mode) => {
				return ({ tr }) => {
					tr.setMeta(editorToolbarPluginKey, {
						contextualFormattingModeOverride: mode,
					});
					return tr;
				};
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
						// Tracks mouse-down state to prevent the focus event (first page load)
						// from prematurely showing the toolbar mid-drag
						const mouseState = { isMouseDown: false };

						return new SafePlugin({
							key: editorToolbarPluginKey,
							state: {
								init(_, editorState): EditorToolbarPluginState {
									return {
										shouldShowToolbar: false,
										selectedNode: getSelectedNode(editorState),
										contextualFormattingModeOverride: undefined,
									};
								},
								apply(tr, pluginState: EditorToolbarPluginState, _, newState) {
									const meta = tr.getMeta(editorToolbarPluginKey);
									let newPluginState = { ...pluginState };

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

									if (meta) {
										const { contextualFormattingModeOverride, ...rest } = meta;
										// Only forward the override when the meta actually carries
										// the key — unrelated metas (mouseup / focus / mousedown
										// from the view() listeners) destructure it as `undefined`
										// and would otherwise wipe a previously-set override on
										// every interaction.
										newPluginState = {
											...newPluginState,
											...rest,
											...('contextualFormattingModeOverride' in meta
												? { contextualFormattingModeOverride }
												: {}),
										};
									}

									return newPluginState;
								},
							},
							view(view) {
								const unbind = bind(view.root, {
									type: 'mouseup',
									listener: function (this: Document | ShadowRoot, ev: Event) {
										mouseState.isMouseDown = false;
										const event = ev as MouseEvent;

										// Scope mouseups to this editor and its React-portaled toolbar.
										const isMouseUpInOwnedToolbar = refs.toolbarMouseUpEvent === event;
										const isMouseUpInEditor = event.composedPath().includes(view.dom);
										refs.toolbarMouseUpEvent = undefined;

										// Prevent outside clicks from reopening a blurred editor's toolbar.
										const editorViewModePlugin = api?.editorViewMode?.sharedState.currentState();
										const isViewModeEnabled = editorViewModePlugin?.mode === 'view';
										// Include focus in nested editable islands.
										const hasEditorFocus =
											view.hasFocus() || view.dom.contains(view.root.activeElement);
										const shouldShowToolbar = isViewModeEnabled
											? isMouseUpInEditor || isMouseUpInOwnedToolbar
											: hasEditorFocus || isMouseUpInOwnedToolbar;

										const currentShouldShowToolbar =
											api?.toolbar?.sharedState.currentState()?.shouldShowToolbar;
										if (currentShouldShowToolbar !== shouldShowToolbar) {
											view.dispatch(
												view.state.tr.setMeta(editorToolbarPluginKey, {
													shouldShowToolbar,
												}),
											);
										}
									},
								});

								const unbindEditorViewFocus = bind(view.dom, {
									type: 'focus',
									listener: () => {
										// On first page load, focus fires after mousedown — skip to
										// avoid showing the toolbar mid-drag
										if (mouseState.isMouseDown) {
											return;
										}
										if (
											editorToolbarPluginKey.getState(view.state)?.shouldShowToolbar &&
											isExperimentEnabled('platform_editor_improve_inp')
										) {
											return;
										}
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
										mouseState.isMouseDown = true;
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
				...(!disableSelectionToolbar
					? [
							{
								name: 'selectionToolbarOpenExperience',
								plugin: () =>
									getSelectionToolbarOpenExperiencePlugin({
										refs,
										dispatchAnalyticsEvent: (payload) =>
											api?.analytics?.actions?.fireAnalyticsEvent(payload),
										getCurrentUserIntent: () =>
											api?.userIntent?.sharedState.currentState()?.currentUserIntent,
									}),
							},
						]
					: []),
			];
		},

		contentComponent: !disableSelectionToolbar
			? ({ editorView, popupsMountPoint }) => {
					refs.popupsMountPoint = popupsMountPoint || undefined;

					if (!editorView) {
						return null;
					}

					return (
						<SelectionToolbarWithErrorBoundary
							api={api}
							editorView={editorView}
							mountPoint={popupsMountPoint}
							disableSelectionToolbarWhenPinned={disableSelectionToolbarWhenPinned ?? false}
							onToolbarMouseUp={handleToolbarMouseUp}
						/>
					);
				}
			: undefined,
	};
};
