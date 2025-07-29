import React from 'react';

import { selectionExtensionMessages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Command,
	FloatingToolbarOverflowDropdown,
	OverflowDropdownHeading,
	OverflowDropdownOption,
} from '@atlaskit/editor-common/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { insertSmartLinks } from './pm-plugins/actions';
import { replaceWithAdf } from './pm-plugins/actions/replaceWithAdf';
import { createPlugin, selectionExtensionPluginKey } from './pm-plugins/main';
import { getSelectionInfo } from './pm-plugins/utils';
import type { SelectionExtensionPlugin } from './selectionExtensionPluginType';
import {
	type DynamicSelectionExtension,
	SelectionExtensionActionTypes,
	type SelectionExtension,
	type SelectionExtensionCallbackOptions,
	type SelectionExtensionConfig,
} from './types';
import { SelectionExtensionComponentWrapper } from './ui/extension/SelectionExtensionComponentWrapper';
import { getBoundingBoxFromSelection } from './ui/getBoundingBoxFromSelection';
import { selectionToolbar } from './ui/selectionToolbar';

type SelectionExtensionStaticOrDynamic = SelectionExtension | DynamicSelectionExtension;

export const selectionExtensionPlugin: SelectionExtensionPlugin = ({ api, config }) => {
	const editorViewRef: Record<'current', EditorView | null> = { current: null };
	let cachedSelection: Selection;
	let cachedOverflowMenuOptions: FloatingToolbarOverflowDropdown<Command>['options'] | undefined;

	return {
		name: 'selectionExtension',
		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			return selectionExtensionPluginKey.getState(editorState) || null;
		},
		commands: {
			setActiveExtension:
				(extension) =>
				({ tr }) => {
					return tr.setMeta(selectionExtensionPluginKey, {
						type: 'set-active-extension',
						extension,
					});
				},
			clearActiveExtension:
				() =>
				({ tr }) => {
					return tr.setMeta(selectionExtensionPluginKey, { type: 'clear-active-extension' });
				},
		},
		actions: {
			insertSmartLinks: (linkInsertionOptions, selectedNodeAdf) => {
				if (!editorViewRef.current) {
					return { status: 'error', message: 'Editor view is not available' };
				}
				const { state, dispatch } = editorViewRef.current;
				return insertSmartLinks(linkInsertionOptions, selectedNodeAdf)(state, dispatch);
			},
			replaceWithAdf: (modifiedNodeAdf) => {
				if (!editorViewRef.current) {
					return { status: 'failed-to-replace' };
				}
				const { state, dispatch } = editorViewRef.current;
				return replaceWithAdf(modifiedNodeAdf)(state, dispatch);
			},
		},
		contentComponent: ({ editorView }) => {
			return (
				<SelectionExtensionComponentWrapper
					editorView={editorView}
					api={api}
					editorAnalyticsAPI={api?.analytics?.actions}
				/>
			);
		},
		pluginsOptions: {
			selectionToolbar: (state, intl) => {
				if (!config) {
					return;
				}

				const { pageModes, extensions } = config;

				/**
				 * Extensions Config Validation
				 *
				 * Check whether plugin contains any selection extensions
				 */
				if (
					(!extensions?.firstParty || extensions.firstParty.length === 0) &&
					(!extensions?.external || extensions.external.length === 0)
				) {
					return;
				}

				/**
				 * Content Mode Validation
				 *
				 * Check if pageModes is provided and matches against current content mode
				 *
				 * TODO: This will eventially transition from mode to contentMode
				 */
				const editorContentMode = api?.editorViewMode?.sharedState.currentState()?.mode;

				if (pageModes) {
					// Early Exit: consumer has set pageModes but editorContentMode is undefined
					if (!editorContentMode) {
						return;
					}

					// Simplify traversion of pageModes which can be string or array of strings
					const showOnModesCollection = Array.isArray(pageModes) ? pageModes : [pageModes];

					// Early Exit: consumer has set pageModes but current editorContentMode is not in the collection
					if (!showOnModesCollection.includes(editorContentMode)) {
						return;
					}
				}

				/**
				 * Active Extension
				 *
				 * Check if there is an active extension and hide the selection extension dropdown
				 */
				const selectionExtensionState = selectionExtensionPluginKey.getState(state);
				if (selectionExtensionState?.activeExtension) {
					return;
				}

				const getSelection = (view: EditorView) => {
					// ensure the same document state is applied to editor view to avoid mismatches
					const { selection: currentSelection } = view.state;

					const { from, to } = currentSelection;
					const text = view.state.doc.textBetween(from, to, '\n');
					const coords = getBoundingBoxFromSelection(view, from, to);
					return { text, from, to, coords };
				};

				const handleOnExtensionClick =
					(view: EditorView) => (extension: SelectionExtensionStaticOrDynamic) => {
						const selection = getSelection(view);

						if (extension.component) {
							api?.core.actions.execute(
								api?.selectionExtension.commands.setActiveExtension({
									extension,
									selection,
								}),
							);
						}

						let onClickCallbackOptions: SelectionExtensionCallbackOptions = { selection };

						if (fg('platform_editor_selection_extension_api_v2')) {
							const { selectedNodeAdf, selectionRanges, selectedNode, nodePos } = getSelectionInfo(
								view.state,
							);
							onClickCallbackOptions = { selectedNodeAdf, selectionRanges };
							extension.onClick?.(onClickCallbackOptions);

							api?.core?.actions.execute(({ tr }) => {
								tr.setMeta(selectionExtensionPluginKey, {
									type: SelectionExtensionActionTypes.SET_SELECTED_NODE,
									selectedNode,
									nodePos,
								});
								return tr;
							});
						} else {
							if (extension.onClick) {
								extension.onClick(onClickCallbackOptions);
							}
						}
					};

				const convertExtensionToDropdownMenuItem = (
					extension: SelectionExtensionStaticOrDynamic,
					rank?: number,
				) => {
					const disabled =
						extension?.isDisabled instanceof Function
							? extension?.isDisabled?.({
									selection: editorViewRef.current
										? getSelection(editorViewRef.current)
										: undefined,
								})
							: extension?.isDisabled;
					return {
						title: extension.name,
						icon: extension.icon ? <extension.icon label={''} /> : undefined,
						disabled,
						rank,
						onClick: () => {
							editorViewRef.current && handleOnExtensionClick(editorViewRef.current)(extension);
							return true;
						},
					} as OverflowDropdownOption<Command>;
				};

				const getConfigFromExtensionCallback = (extension: SelectionExtensionConfig) => {
					if (typeof extension === 'function') {
						const { selectedNodeAdf, selectionRanges } = getSelectionInfo(state);
						return extension({
							selectedNodeAdf,
							selectionRanges,
						});
					}
					return extension;
				};

				const prefilterExtensions = (
					extensions: SelectionExtensionConfig[],
				): SelectionExtensionConfig[] => {
					// this is to prevent integration issues when passing in a function as an extension
					// but not having platform_editor_selection_extension_api_v2 FG on
					if (!fg('platform_editor_selection_extension_api_v2')) {
						return extensions.filter((ext) => typeof ext !== 'function');
					}
					return extensions;
				};

				const getFirstPartyExtensions = (extensions: SelectionExtensionConfig[]) => {
					const prefilteredExtensions = prefilterExtensions(extensions);

					return prefilteredExtensions.map((extension) => {
						const ext = fg('platform_editor_selection_extension_api_v2')
							? getConfigFromExtensionCallback(extension)
							: extension;
						return convertExtensionToDropdownMenuItem(ext, 30);
					});
				};

				/**
				 * Add a heading to the external extensions
				 */
				const getExternalExtensions = (extensions: SelectionExtensionConfig[]) => {
					const prefilteredExtensions = prefilterExtensions(extensions);

					let externalExtensions: (OverflowDropdownOption<Command> | OverflowDropdownHeading)[] =
						[];
					if (prefilteredExtensions?.length) {
						externalExtensions = prefilteredExtensions.map((extension) => {
							const ext = fg('platform_editor_selection_extension_api_v2')
								? getConfigFromExtensionCallback(extension)
								: extension;
							return convertExtensionToDropdownMenuItem(ext);
						});

						const externalExtensionsHeading: OverflowDropdownHeading = {
							type: 'overflow-dropdown-heading',
							title: intl.formatMessage(selectionExtensionMessages.externalExtensionsHeading),
						};
						externalExtensions.unshift(externalExtensionsHeading);
					}
					return externalExtensions;
				};

				if (
					cachedOverflowMenuOptions &&
					state.selection.eq(cachedSelection) &&
					fg('platform_editor_selection_extension_api_v2')
				) {
					return selectionToolbar(cachedOverflowMenuOptions);
				}

				const groupedExtensionsArray = [
					...getFirstPartyExtensions(extensions.firstParty || []),
					...getExternalExtensions(extensions.external || []),
				];

				cachedOverflowMenuOptions = groupedExtensionsArray;
				cachedSelection = state.selection;

				return selectionToolbar(groupedExtensionsArray);
			},
		},
		pmPlugins: () => [
			{
				name: 'selectionExtension',
				plugin: () => createPlugin(),
			},
			{
				name: 'selectionExtensionGetEditorViewReferencePlugin',
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
			},
		],
	};
};
