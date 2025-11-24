import React from 'react';

import { bind } from 'bind-event-listener';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Command,
	FloatingToolbarItem,
	SelectionToolbarGroup,
	SelectionToolbarHandler,
	ToolbarUIComponentFactory,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/types';
import {
	calculateToolbarPositionAboveSelection,
	calculateToolbarPositionOnCellSelection,
	calculateToolbarPositionTrackHead,
} from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	setToolbarDocking,
	toggleToolbar,
	updateToolbarDocking,
	forceToolbarDockingWithoutAnalytics,
} from './pm-plugins/commands';
import { selectionToolbarPluginKey } from './pm-plugins/plugin-key';
import type { SelectionToolbarPlugin } from './selectionToolbarPluginType';
import type { ToolbarDocking } from './types';
import { PageVisibilityWatcher } from './ui/PageVisibilityWatcher';
import { getPinOptionToolbarConfig } from './ui/pin-toolbar-config';
import { PrimaryToolbarComponent } from './ui/PrimaryToolbarComponent';
import { getToolbarComponents } from './ui/toolbar-components';

type SelectionToolbarPluginState = {
	hide: boolean;
	isBlockMenuOpen?: boolean;
	selectionStable: boolean;
	toolbarDocking: ToolbarDocking;
};

const getToolbarDocking = (
	contextualFormattingEnabled: boolean | undefined,
	userPreferencesProvider: UserPreferencesProvider | undefined,
): ToolbarDocking => {
	if (contextualFormattingEnabled && editorExperiment('platform_editor_controls', 'variant1')) {
		return userPreferencesProvider?.getPreference('toolbarDockingInitialPosition') ?? 'none';
	}
	return 'top';
};

const getToolbarDockingV2 = (
	contextualFormattingEnabled: boolean | undefined,
	dockingPreference: ToolbarDocking | undefined,
) => {
	if (contextualFormattingEnabled && editorExperiment('platform_editor_controls', 'variant1')) {
		return dockingPreference ?? 'none';
	}
	return 'top';
};

export const selectionToolbarPlugin: SelectionToolbarPlugin = ({ api, config }) => {
	const __selectionToolbarHandlers: SelectionToolbarHandler[] = [];
	let primaryToolbarComponent: ToolbarUIComponentFactory | undefined;
	const isToolbarAIFCEnabled = Boolean(api?.toolbar);

	const { userPreferencesProvider, contextualFormattingEnabled } = config;

	if (isToolbarAIFCEnabled) {
		if (fg('platform_editor_toolbar_aifc_placement_config')) {
			/**
			 * If toolbar is set to always-pinned or always-inline, there is no control over toolbar placement
			 */
			if (api?.toolbar?.actions.contextualFormattingMode() === 'controlled') {
				api?.toolbar?.actions.registerComponents(getToolbarComponents(api, true));
			}
		} else {
			api?.toolbar?.actions.registerComponents(
				getToolbarComponents(api, contextualFormattingEnabled),
			);
		}
	} else {
		if (editorExperiment('platform_editor_controls', 'variant1', { exposure: true })) {
			primaryToolbarComponent = ({ disabled }) => {
				return <PrimaryToolbarComponent api={api} disabled={disabled} />;
			};

			api?.primaryToolbar?.actions.registerComponent({
				name: 'pinToolbar',
				component: primaryToolbarComponent,
			});
		}
	}

	let previousToolbarDocking: ToolbarDocking | null =
		userPreferencesProvider?.getPreference('toolbarDockingInitialPosition') || null;
	let isPreferenceInitialized = false;

	return {
		name: 'selectionToolbar',

		actions: {
			suppressToolbar: () => {
				return api?.core.actions.execute(toggleToolbar({ hide: true })) ?? false;
			},
			unsuppressToolbar: () => {
				return api?.core.actions.execute(toggleToolbar({ hide: false })) ?? false;
			},
			setToolbarDocking: (toolbarDocking: ToolbarDocking) => {
				if (fg('platform_editor_use_preferences_plugin')) {
					return (
						api?.core.actions.execute(
							api?.userPreferences?.actions.updateUserPreference(
								'toolbarDockingPosition',
								toolbarDocking,
							),
						) ?? false
					);
				}

				return (
					api?.core.actions.execute(
						setToolbarDocking({
							toolbarDocking,
							userPreferencesProvider,
							editorAnalyticsApi: api?.analytics?.actions,
						}),
					) ?? false
				);
			},
			forceToolbarDockingWithoutAnalytics: (toolbarDocking: ToolbarDocking) => {
				if (fg('platform_editor_use_preferences_plugin')) {
					if (fg('platform_editor_lcm_toolbar_docking_fix')) {
						// to avoid nested gate. Will remove when cleaning up platform_editor_lcm_toolbar_docking_fix
						return (
							api?.core.actions.execute(
								api?.userPreferences?.actions.updateUserPreference(
									'toolbarDockingPosition',
									toolbarDocking,
								),
							) ?? false
						);
					}
				}

				return (
					api?.core.actions.execute(
						forceToolbarDockingWithoutAnalytics({
							toolbarDocking,
							userPreferencesProvider,
						}),
					) ?? false
				);
			},
			refreshToolbarDocking: () => {
				if (userPreferencesProvider) {
					const userToolbarDockingPref = getToolbarDocking(
						contextualFormattingEnabled,
						userPreferencesProvider,
					);
					return (
						api?.core.actions.execute(
							updateToolbarDocking({ toolbarDocking: userToolbarDockingPref }),
						) ?? false
					);
				}
				return false;
			},
		},

		getSharedState(editorState) {
			if (!editorState) {
				return;
			}

			return selectionToolbarPluginKey.getState(editorState);
		},

		pmPlugins(selectionToolbarHandlers: Array<SelectionToolbarHandler>) {
			if (selectionToolbarHandlers) {
				__selectionToolbarHandlers.push(...selectionToolbarHandlers);
			}

			const initialToolbarDocking = fg('platform_editor_use_preferences_plugin')
				? getToolbarDockingV2(
						contextualFormattingEnabled,
						api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition,
					)
				: getToolbarDocking(contextualFormattingEnabled, userPreferencesProvider);

			return [
				{
					name: 'selection-tracker',
					plugin: () => {
						return new SafePlugin({
							key: selectionToolbarPluginKey,
							state: {
								init(): SelectionToolbarPluginState {
									return {
										selectionStable: false,
										hide: false,
										toolbarDocking: initialToolbarDocking,
									};
								},
								apply(tr, pluginState: SelectionToolbarPluginState) {
									const meta = tr.getMeta(selectionToolbarPluginKey);
									let newPluginState = pluginState;
									if (meta) {
										return {
											...newPluginState,
											...meta,
										};
									}

									if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
										const isBlockMenuOpen =
											api?.userIntent?.sharedState.currentState()?.currentUserIntent ===
											'blockMenuOpen';
										newPluginState = { ...newPluginState, isBlockMenuOpen };
									}

									// if the toolbarDockingInitialPosition preference has changed
									// update the toolbarDocking state
									if (!previousToolbarDocking) {
										// we currently only check for the initial value
										const toolbarDockingPreference = userPreferencesProvider?.getPreference(
											'toolbarDockingInitialPosition',
										);
										if (
											toolbarDockingPreference &&
											toolbarDockingPreference !== previousToolbarDocking
										) {
											previousToolbarDocking = toolbarDockingPreference;
											const userToolbarDockingPref = getToolbarDocking(
												contextualFormattingEnabled,
												userPreferencesProvider,
											);
											if (pluginState.toolbarDocking !== userToolbarDockingPref) {
												return {
													...newPluginState,
													toolbarDocking: userToolbarDockingPref,
												};
											}
										}
									}

									return newPluginState;
								},
							},
							view(view) {
								const unbind = bind(view.root, {
									type: 'mouseup',
									listener: (event) => {
										// We only want to set selectionStable to true if the editor has focus
										// to prevent the toolbar from showing when the editor is blurred
										// due to a click outside the editor.

										const editorViewModePlugin = api?.editorViewMode?.sharedState.currentState();
										const isViewModeEnabled = editorViewModePlugin?.mode === 'view';

										if (fg('platform_editor_ai_generic_prep_for_aifc')) {
											const target = event.target as Element;
											const isRovoChangeToneButton =
												(target?.tagName === 'BUTTON' &&
													hasNestedSpanWithText(target, 'Change tone')) ||
												target.getAttribute('aria-label') === 'Change tone' ||
												target.innerHTML === 'Change tone';

											const isRovoTranslateButton =
												(target?.tagName === 'BUTTON' &&
													hasNestedSpanWithText(target, 'Translate options')) ||
												target.getAttribute('aria-label') === 'Translate options' ||
												target.innerHTML === 'Translate options';

											if (isRovoChangeToneButton || isRovoTranslateButton) {
												return null;
											}
										}

										view.dispatch(
											view.state.tr.setMeta(selectionToolbarPluginKey, {
												selectionStable: !isViewModeEnabled ? view.hasFocus() : true,
											}),
										);
									},
								});

								const unbindEditorViewFocus = bind(view.dom, {
									type: 'focus',
									listener: () => {
										view.dispatch(
											view.state.tr.setMeta(selectionToolbarPluginKey, { selectionStable: true }),
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
							appendTransaction(_transactions, _oldState, newState) {
								if (fg('platform_editor_use_preferences_plugin')) {
									return null;
								}

								if (
									!isPreferenceInitialized &&
									editorExperiment('platform_editor_controls', 'variant1')
								) {
									const toolbarDockingPreference = userPreferencesProvider?.getPreference(
										'toolbarDockingInitialPosition',
									);

									if (toolbarDockingPreference !== undefined) {
										isPreferenceInitialized = true;

										const userToolbarDockingPref = getToolbarDocking(
											contextualFormattingEnabled,
											userPreferencesProvider,
										);

										const tr = newState.tr;

										api?.analytics?.actions.attachAnalyticsEvent({
											action: ACTION.INITIALISED,
											actionSubject: ACTION_SUBJECT.USER_PREFERENCES,
											actionSubjectId: ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
											attributes: { toolbarDocking: userToolbarDockingPref },
											eventType: EVENT_TYPE.OPERATIONAL,
										})(tr);

										return tr;
									}
								}

								return null;
							},
							props: {
								handleDOMEvents: {
									mousedown: (view) => {
										view.dispatch(
											view.state.tr.setMeta(selectionToolbarPluginKey, {
												selectionStable: false,
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

		pluginsOptions: isToolbarAIFCEnabled
			? {}
			: {
					floatingToolbar(state, intl, providerFactory) {
						const { selectionStable, hide, toolbarDocking, isBlockMenuOpen } =
							selectionToolbarPluginKey.getState(state) as SelectionToolbarPluginState;

						const isCellSelection = '$anchorCell' in state.selection;
						const isEditorControlsEnabled = editorExperiment(
							'platform_editor_controls',
							'variant1',
						);
						if (
							state.selection.empty ||
							!selectionStable ||
							hide ||
							state.selection instanceof NodeSelection ||
							// $anchorCell is only available in CellSelection, this check is to
							// avoid importing CellSelection from @atlaskit/editor-tables
							(isCellSelection && !isEditorControlsEnabled) // for Editor Controls we want to show the toolbar on CellSelection
						) {
							// If there is no active selection, or the selection is not stable, or the selection is a node selection,
							// do not show the toolbar.
							return;
						}

						if (isCellSelection && isEditorControlsEnabled) {
							const isSelectedViaDragHandle =
								api?.blockControls?.sharedState.currentState()?.isSelectedViaDragHandle;
							if (isSelectedViaDragHandle) {
								return;
							}
						}

						if (
							isBlockMenuOpen &&
							isEditorControlsEnabled &&
							expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
						) {
							// If the block menu is open, do not show the selection toolbar.
							return;
						}

						// Resolve the selectionToolbarHandlers to a list of SelectionToolbarGroups
						// and filter out any handlers which returned undefined
						const resolved = __selectionToolbarHandlers
							.map((selectionToolbarHandler) =>
								selectionToolbarHandler(state, intl, providerFactory),
							)
							.filter((resolved) => resolved !== undefined) as SelectionToolbarGroup[];
						// Sort the groups by rank
						// This is intended to allow different plugins to control the order of the groups
						// they add to the selection toolbar.
						// ie. if you want to have your plugin's group appear first, set rank to -10 if there is currently another
						// plugin you expect to be run at the same time as with an rank of -9
						resolved.sort(({ rank: rankA = 0 }, { rank: rankB = 0 }) => {
							if (rankA < rankB) {
								return 1;
							}
							return -1;
						});

						const items: FloatingToolbarItem<Command>[] = [];

						// This flattens the groups passed into the floating toolbar into a single list of items
						for (let i = 0; i < resolved.length; i++) {
							// add a seperator icon after each group except the last
							if (Array.isArray(resolved[i]?.items)) {
								items.push(...resolved[i].items);
							}

							if (editorExperiment('platform_editor_controls', 'variant1')) {
								if (resolved[i] && resolved[i + 1]) {
									if (resolved[i + 1]?.pluginName === 'annotation') {
										items.push({ type: 'separator', fullHeight: true });
									}
								}
							} else {
								if (i !== resolved.length - 1) {
									items.push({ type: 'separator' });
								}
							}
						}

						if (items.length > 0 && contextualFormattingEnabled && isEditorControlsEnabled) {
							const toolbarDockingPref =
								api?.userPreferences && fg('platform_editor_use_preferences_plugin')
									? api?.userPreferences?.sharedState.currentState()?.preferences
											?.toolbarDockingPosition
									: toolbarDocking;

							items.push(
								...getPinOptionToolbarConfig({ api, toolbarDocking: toolbarDockingPref, intl }),
							);
						}

						let onPositionCalculated;
						const toolbarTitle = 'Selection toolbar';

						if (isCellSelection && isEditorControlsEnabled) {
							onPositionCalculated = calculateToolbarPositionOnCellSelection(toolbarTitle);
						} else {
							const calcToolbarPosition = config.preferenceToolbarAboveSelection
								? calculateToolbarPositionAboveSelection
								: calculateToolbarPositionTrackHead;

							onPositionCalculated = calcToolbarPosition(toolbarTitle);
						}

						const nodeType = getSelectionNodeTypes(state);

						return {
							title: 'Selection toolbar',
							nodeType: nodeType,
							items: items,
							...(isEditorControlsEnabled && { scrollable: true }),
							onPositionCalculated,
						};
					},
				},

		contentComponent:
			editorExperiment('platform_editor_controls', 'variant1') &&
			!fg('platform_editor_use_preferences_plugin') &&
			fg('platform_editor_user_preferences_provider_update')
				? () => (
						<PageVisibilityWatcher api={api} userPreferencesProvider={userPreferencesProvider} />
					)
				: undefined,

		primaryToolbarComponent:
			!api?.primaryToolbar &&
			editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
				? primaryToolbarComponent
				: undefined,
	};
};

function getSelectionNodeTypes(state: EditorState) {
	const selectionNodeTypes: NodeType[] = [];
	state.doc.nodesBetween(state.selection.from, state.selection.to, (node, _pos, parent) => {
		if (selectionNodeTypes.indexOf(node.type) !== 0) {
			selectionNodeTypes.push(node.type);
		}
	});
	return selectionNodeTypes;
}

const hasNestedSpanWithText = (element: Element, text: string): boolean => {
	if (element.tagName === 'SPAN' && element.innerHTML === text) {
		return true;
	}
	for (const child of Array.from(element.children)) {
		if (hasNestedSpanWithText(child, text)) {
			return true;
		}
	}
	return false;
};
