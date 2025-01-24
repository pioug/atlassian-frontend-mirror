import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	editorExperiment,
	unstable_editorExperimentParam,
} from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	EditorViewModePlugin,
	EditorViewModePluginConfig,
	EditorViewModePluginState,
	UpdateContentModeAction,
	ViewMode,
} from './editorViewmodePluginType';

const viewModePluginKey = new PluginKey<EditorViewModePluginState>('editorViewMode');

const createPlugin = ({ initialMode }: { initialMode: ViewMode | undefined }) => {
	return new SafePlugin({
		key: viewModePluginKey,
		state: {
			init: () => ({ mode: initialMode ?? 'edit' }),
			apply: (tr, pluginState) => {
				const meta = tr.getMeta(viewModePluginKey);
				if (meta) {
					return meta;
				}

				return pluginState;
			},
		},
		props: {
			// If we set to undefined it respects the previous value.
			// Prosemirror doesn't have this typed correctly for this type of behaviour
			// We will fast-follow to consolidate the logic with `editor-disabled` so we don't
			// need this workaround.
			// @ts-expect-error
			editable: (state: EditorState) => {
				const mode = viewModePluginKey.getState(state)?.mode;
				return mode === 'view' ? false : undefined;
			},
		},
	});
};

function getInitialViewModePluginState(
	pluginConfig: EditorViewModePluginConfig,
	{ isEmptyDoc }: { isEmptyDoc?: boolean } = {},
): EditorViewModePluginState {
	switch (pluginConfig.initialContentMode) {
		case 'live-view-only':
			return {
				contentMode: 'live-view-only' as const,
				mode: 'view' as const,
				isConsumption: true,
				_showTopToolbar: false,
			};
		case 'live-view':
			return {
				contentMode: 'live-view' as const,
				mode: 'view' as const,
				isConsumption: true,
				_showTopToolbar: false,
			};
		case 'live-edit':
			// note: when first setting up the plugin state -- we don't know if the document is empty or not
			// so when the document is empty -- the plugin will jump from isConsumption 'true' to 'false' (as part of the editor load).
			return {
				contentMode: 'live-edit' as const,
				mode: isEmptyDoc
					? 'edit'
					: editorExperiment('live_pages_graceful_edit', 'control')
						? 'edit'
						: editorExperiment('live_pages_graceful_edit', 'initially-hide-toolbar')
							? 'edit'
							: 'view',
				isConsumption: isEmptyDoc
					? false
					: editorExperiment('live_pages_graceful_edit', 'initially-hide-toolbar')
						? false
						: true,
				_showTopToolbar: editorExperiment('live_pages_graceful_edit', 'control') ? true : false,
			};
		case 'edit':
			return {
				contentMode: 'edit' as const,
				mode: 'edit' as const,
				isConsumption: false,
				_showTopToolbar: true,
			};
		case undefined:
			return {
				contentMode: 'edit' as const,
				mode: 'edit' as const,
				isConsumption: false,
				_showTopToolbar: true,
			};
	}
}

const gracefulEditCreatePMPlugin = ({
	config,
	api,
}: {
	config: EditorViewModePluginConfig;
	api: ExtractInjectionAPI<EditorViewModePlugin> | undefined;
}) => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let lastClickExistingSelection = false;

	const viewModeIntentToEdit = unstable_editorExperimentParam(
		'live_pages_graceful_edit',
		'view-mode-intent-to-edit',
		{
			defaultValue: false,
			typeGuard: (value: unknown): value is boolean => typeof value === 'boolean',
		},
	);

	return new SafePlugin({
		key: viewModePluginKey,
		state: {
			init: (_, editorState) => {
				const initialPluginState = getInitialViewModePluginState(config, {
					// an empty doc has a nodeSize of 4 (the doc and empty paragraph start and end tokens)
					isEmptyDoc: editorState.doc.nodeSize === 4,
				});
				return initialPluginState;
			},
			apply: (tr, pluginState) => {
				if (config.initialContentMode === 'live-view-only') {
					// when in live-view-only mode, we don't allow the editor to change to edit mode
					return pluginState;
				}
				const action = tr.getMeta(viewModePluginKey) as UpdateContentModeAction | undefined;

				if (action) {
					switch (action.type) {
						case 'intent-to-edit': {
							if (pluginState.contentMode === 'live-view' && !viewModeIntentToEdit) {
								// if we are in live-view and the view-mode-intent-to-edit is disabled,
								// we don't do anything with an intent to edit
								return pluginState;
							}

							if (pluginState.isConsumption === false) {
								// if we are already in edit mode, we don't need to do anything
								return pluginState;
							}

							// Set the editor to edit mode and mark the intent to edit as received
							return {
								contentMode: pluginState.contentMode.startsWith('live-') ? 'live-edit' : 'edit',
								mode: 'edit',
								isConsumption: false,
							};
						}
						case 'switch-content-mode': {
							if (action.contentMode === pluginState.contentMode) {
								// if the content mode is the same, we don't need to do anything
								return pluginState;
							}
							switch (action.contentMode) {
								case 'live-edit': {
									// When switching to live-edit, we set it to edit mode, and consider it an intent to edit
									return {
										contentMode: 'live-edit',
										mode: 'edit',
										isConsumption: false,
									};
								}
								case 'live-view': {
									// When switching to live-view, we set it to view mode (but don't change the intent to edit state)
									return {
										contentMode: 'live-view',
										mode: 'view',
										isConsumption: true,
									};
								}
							}
						}
						// eslint-disable-next-line no-fallthrough
						default:
							return pluginState;
					}
				}

				return pluginState;
			},
		},
		props: {
			// If we set to undefined it respects the previous value.
			// Prosemirror doesn't have this typed correctly for this type of behaviour
			// We will fast-follow to consolidate the logic with `editor-disabled` so we don't
			// need this workaround.
			// @ts-expect-error
			editable: (state: EditorState) => {
				const mode = viewModePluginKey.getState(state)?.mode;
				return mode === 'view' ? false : undefined;
			},
			handleDOMEvents: {
				mousedown: (view, event) => {
					const existingSelectionText = window.getSelection()?.toString();

					if (existingSelectionText !== '') {
						lastClickExistingSelection = true;
					} else {
						lastClickExistingSelection = false;
					}
				},
			},
			handleClick: (view: EditorView, pos, event) => {
				const viewModeState = viewModePluginKey.getState(view.state);

				// If this is not available -- there are runtime issues expected -- and there is no safe way to handle this
				if (!viewModeState) {
					throw new Error('editorViewModePlugin: plugin state not found');
				}

				if (viewModeState.contentMode === 'live-view' && !viewModeIntentToEdit) {
					// if we are in live-view and the view-mode-intent-to-edit is disabled,
					// we don't do anything with an intent to edit
					return;
				}

				if (viewModeState.isConsumption === false) {
					// if we are already in edit mode, we don't need to do anything
					return;
				}

				const intentToEdit = checkIntentToEdit(view, pos, event);

				if (!intentToEdit) {
					return;
				}

				if (lastClickExistingSelection) {
					// When there is an existing selection, we don't want to trigger an intent to edit
					return;
				}

				const delayMs =
					!editorExperiment('live_pages_graceful_edit', 'text-click-no-delay') &&
					unstable_editorExperimentParam('live_pages_graceful_edit', 'delay', {
						defaultValue: 200,
						typeGuard: (value: unknown): value is number => typeof value === 'number',
					});

				if (delayMs) {
					if (timer) {
						clearTimeout(timer);
						timer = undefined;
					}

					timer = setTimeout(() => {
						api?.core?.actions.execute(
							api?.editorViewMode.commands.updateContentMode({ type: 'intent-to-edit' }),
						);
						view.focus();
					}, delayMs);

					return false;
				}

				api?.core?.actions.execute(
					api?.editorViewMode.commands.updateContentMode({ type: 'intent-to-edit' }),
				);
				view.focus();

				return false;
			},
			handleDoubleClick: () => {
				if (timer) {
					clearTimeout(timer);
					timer = undefined;
				}
			},
		},
	});
};

function checkIntentToEdit(view: EditorView, pos: number, event: MouseEvent) {
	const viewModeIntentMode = unstable_editorExperimentParam(
		'live_pages_graceful_edit',
		'intent-mode',
		{
			defaultValue: 'text',
			typeGuard: (value: unknown): value is 'text' | 'nodes' =>
				typeof value === 'string' && ['text', 'nodes'].includes(value),
		},
	);

	if (!(event.target instanceof HTMLElement)) {
		// if the target is not an HTMLElement, we can't determine the intent to edit
		return false;
	}

	const hasPointerCursor = window.getComputedStyle(event.target).cursor === 'pointer';

	if (hasPointerCursor) {
		return false;
	}

	const clickTargetBasedOnPos = view.state.doc.nodeAt(pos);

	if (clickTargetBasedOnPos && clickTargetBasedOnPos.type.isText) {
		// clicks on text nodes are always an intent to edit

		if (event.target instanceof HTMLElement && event.target.closest('.inlineNodeView')) {
			// Clicks on the edges of inline nodes result in unexpected positions being detected
			// by prosemirror (where prosemirror calls handleClick with the position following the inline node).
			return false;
		}

		return true;
	}

	if (viewModeIntentMode === 'text') {
		return false;
	}

	const clickPosition = view.posAtDOM(event.target, 0, -1);
	const resolvedPos = view.state.doc.resolve(clickPosition);
	const clickTargetBasedOnTarget = resolvedPos.node(resolvedPos.depth);

	if (!clickTargetBasedOnTarget) {
		return false;
	}

	if (!clickTargetBasedOnTarget.isAtom) {
		// clicks on non atom nodes are considered as an intent to edit
		return true;
	}

	return false;
}

const gracefulEditTopToolbarCreatePMPlugin = (config: EditorViewModePluginConfig) => {
	return new SafePlugin({
		key: viewModePluginKey,
		state: {
			init: (_, editorState) => {
				const initialPluginState = getInitialViewModePluginState(config, {
					// an empty doc has a nodeSize of 4 (the doc and empty paragraph start and end tokens)
					isEmptyDoc: editorState.doc.nodeSize === 4,
				});
				return initialPluginState;
			},
			apply: (tr, pluginState) => {
				if (config.initialContentMode === 'live-view-only') {
					// when in live-view-only mode, we don't allow the editor to change to edit mode
					return pluginState;
				}
				const action = tr.getMeta(viewModePluginKey) as UpdateContentModeAction | undefined;

				if (action) {
					switch (action.type) {
						case 'intent-to-edit': {
							if (pluginState._showTopToolbar === false) {
								return { ...pluginState, _showTopToolbar: true };
							}
							return pluginState;
						}
						case 'switch-content-mode': {
							if (action.contentMode === pluginState.contentMode) {
								// if the content mode is the same, we don't need to do anything
								return pluginState;
							}
							switch (action.contentMode) {
								case 'live-edit': {
									// When switching to live-edit, we set it to edit mode, and consider it an intent to edit
									return {
										contentMode: 'live-edit',
										mode: 'edit',
										isConsumption: false,
										_showTopToolbar: true,
									};
								}
								case 'live-view': {
									// When switching to live-view, we set it to view mode (but don't change the intent to edit state)
									return {
										contentMode: 'live-view',
										mode: 'view',
										isConsumption: true,
										_showTopToolbar: false,
									};
								}
							}
						}
						// eslint-disable-next-line no-fallthrough
						default:
							return pluginState;
					}
				}

				return pluginState;
			},
		},
		props: {
			// If we set to undefined it respects the previous value.
			// Prosemirror doesn't have this typed correctly for this type of behaviour
			// We will fast-follow to consolidate the logic with `editor-disabled` so we don't
			// need this workaround.
			// @ts-expect-error
			editable: (state: EditorState) => {
				const mode = viewModePluginKey.getState(state)?.mode;
				return mode === 'view' ? false : undefined;
			},
			handleClick: (view, pos, event) => {
				const viewModeState = viewModePluginKey.getState(view.state);

				// If this is not available -- there are runtime issues expected -- and there is no safe way to handle this
				if (!viewModeState) {
					throw new Error('editorViewModePlugin: plugin state not found');
				}

				if (viewModeState._showTopToolbar === true) {
					// if we are already in _showTopToolbar mode, we don't need to do anything
					return;
				}

				const clickTarget = view.state.doc.nodeAt(pos);

				if (!clickTarget || !clickTarget.type.isText) {
					// We only treat clicking on inline nodes as an intent to edit
					return;
				}
				if (event.target instanceof HTMLElement && event.target.closest('.inlineNodeView')) {
					// Clicks on the edges of inline nodes result in unexpected positions being detected
					// by prosemirror (where prosemirror calls handleClick with the position following the inline node).
					return;
				}

				const tr = view.state.tr;
				tr.setMeta(viewModePluginKey, { type: 'intent-to-edit' });
				view.dispatch(tr);
			},
		},
	});
};

export const editorViewModeWithGracefulEditPlugin: EditorViewModePlugin = ({ config, api }) => {
	if (!config) {
		config = {
			initialContentMode: 'edit',
		};
	}

	return {
		name: 'editorViewMode',

		getSharedState(editorState): EditorViewModePluginState {
			if (!editorState) {
				const initialState = getInitialViewModePluginState(config);
				return initialState;
			}

			const pluginState = viewModePluginKey.getState(editorState);

			if (!pluginState) {
				// If this is not available -- there are runtime issues expected -- and there is no safe way to handle this
				throw new Error('editorViewModePlugin: plugin state not found');
			}

			// This is a subset of the prosemirror plugin state.
			return {
				mode: pluginState.mode,
				contentMode: pluginState.contentMode,
				isConsumption: pluginState.isConsumption,
				_showTopToolbar: pluginState._showTopToolbar,
			};
		},

		commands: {
			updateContentMode:
				(action: UpdateContentModeAction) =>
				({ tr }) => {
					return tr.setMeta(viewModePluginKey, action);
				},
			updateViewMode:
				(mode: ViewMode) =>
				({ tr }) => {
					return tr.setMeta(viewModePluginKey, {
						type: 'switch-content-mode',
						contentMode: `live-${mode}`,
					} as UpdateContentModeAction);
				},
		},

		pmPlugins() {
			return [
				{
					name: 'editorViewMode',
					plugin: () => {
						if (editorExperiment('live_pages_graceful_edit', 'initially-hide-toolbar')) {
							return gracefulEditTopToolbarCreatePMPlugin(config);
						}
						return gracefulEditCreatePMPlugin({ config, api });
					},
				},
			];
		},
	};
};

/**
 * View Mode plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const editorViewModePlugin: EditorViewModePlugin = ({ config: options, api }) => {
	if (!editorExperiment('live_pages_graceful_edit', 'control', { exposure: true })) {
		return editorViewModeWithGracefulEditPlugin({ config: options, api });
	}

	return {
		name: 'editorViewMode',

		getSharedState(editorState): EditorViewModePluginState {
			if (!editorState) {
				return {
					mode: options?.mode === 'view' ? 'view' : 'edit',
				} as EditorViewModePluginState; // Skipping type safety for the deprecated mode property
			}

			return {
				mode: viewModePluginKey.getState(editorState)?.mode ?? 'edit',
			} as EditorViewModePluginState; // Skipping type safety for the deprecated mode property
		},

		commands: {
			updateContentMode:
				(action: UpdateContentModeAction) =>
				({ tr }) => {
					// if the feature gate is not on -- this is a no op
					return null;
				},
			updateViewMode:
				(mode: ViewMode) =>
				({ tr }) => {
					return tr.setMeta(viewModePluginKey, { mode });
				},
		},

		pmPlugins() {
			return [
				{
					name: 'editorViewMode',
					plugin: () => createPlugin({ initialMode: options?.mode }),
				},
			];
		},
	};
};
