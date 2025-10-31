import React from 'react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { selectionExtensionMessages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Command,
	FloatingToolbarOverflowDropdown,
	OverflowDropdownHeading,
	OverflowDropdownOption,
} from '@atlaskit/editor-common/types';
import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { insertAdfAtEndOfDoc } from './pm-plugins/actions/insertAdfAtEndOfDoc';
import { replaceWithAdf } from './pm-plugins/actions/replaceWithAdf';
import { createPlugin, selectionExtensionPluginKey } from './pm-plugins/main';
import {
	getFragmentInfoFromSelection,
	getSelectionAdfInfo,
	getSelectionTextInfo,
} from './pm-plugins/utils';
import type { SelectionExtensionPlugin } from './selectionExtensionPluginType';
import {
	SelectionExtensionActionTypes,
	type SelectionExtension,
	type SelectionExtensionCallbackOptions,
} from './types';
import { SelectionExtensionComponentWrapper } from './ui/extension/SelectionExtensionComponentWrapper';
import { getMenuItemExtensions, getToolbarItemExtensions } from './ui/extensions';
import { LegacyPrimaryToolbarComponent } from './ui/LegacyToolbarComponent';
import { selectionToolbar } from './ui/selectionToolbar';
import { getToolbarComponents } from './ui/toolbar-components';
import { registerBlockMenuItems } from './ui/utils/registerBlockMenuItems';

export const selectionExtensionPlugin: SelectionExtensionPlugin = ({ api, config }) => {
	const editorViewRef: Record<'current', EditorView | null> = { current: null };
	let cachedSelection: Selection;
	let cachedOverflowMenuOptions: FloatingToolbarOverflowDropdown<Command>['options'] | undefined;
	const isToolbarAIFCEnabled = Boolean(api?.toolbar);

	const { extensionList = [], extensions = {} } = config || {};
	const { firstParty = [], external = [] } = extensions || {};

	if (!isToolbarAIFCEnabled) {
		const primaryToolbarItemExtensions = getToolbarItemExtensions(extensionList, 'primaryToolbar');

		if (primaryToolbarItemExtensions?.length) {
			api?.primaryToolbar?.actions?.registerComponent({
				name: 'selectionExtension',
				component: () => (
					<LegacyPrimaryToolbarComponent
						primaryToolbarItemExtensions={primaryToolbarItemExtensions}
					/>
				),
			});
		}
	}

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
			replaceWithAdf: (nodeAdf) => {
				if (!editorViewRef.current) {
					return { status: 'failed-to-replace' };
				}
				const { state, dispatch } = editorViewRef.current;
				return replaceWithAdf(nodeAdf)(state, dispatch);
			},
			insertAdfAtEndOfDoc: (nodeAdf) => {
				if (!editorViewRef.current) {
					return { status: 'failed' };
				}
				const { state, dispatch } = editorViewRef.current;
				return insertAdfAtEndOfDoc(nodeAdf)(state, dispatch);
			},
			getSelectionAdf: () => {
				if (!editorViewRef.current) {
					return null;
				}
				const { state } = editorViewRef.current;

				const { selectionRanges, selectedNodeAdf } = getSelectionAdfInfo(state);

				return {
					selectedNodeAdf,
					selectionRanges,
				};
			},
			getDocumentFromSelection: () => {
				if (!editorViewRef.current) {
					return null;
				}
				const { state } = editorViewRef.current;
				const { selectedNodeAdf } = getFragmentInfoFromSelection(state);

				return { selectedNodeAdf };
			},
		},
		usePluginHook: () => {
			usePluginStateEffect(api, ['userIntent', 'selection'], ({ userIntentState }) => {
				if (expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && isSSR()) {
					return;
				}
				if (
					userIntentState?.currentUserIntent === 'blockMenuOpen' &&
					expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
				) {
					registerBlockMenuItems(extensionList, api);
				}

				if (
					isToolbarAIFCEnabled &&
					expValEquals('platform_editor_toolbar_aifc_selection_extension', 'isEnabled', true)
				) {
					api?.toolbar?.actions.registerComponents(getToolbarComponents({ api, config }), true);
				}
			});
		},
		contentComponent: ({ editorView }) => {
			if (
				!editorView ||
				(expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && isSSR())
			) {
				return null;
			}

			return (
				<SelectionExtensionComponentWrapper
					editorView={editorView}
					api={api}
					editorAnalyticsAPI={api?.analytics?.actions}
				/>
			);
		},
		pluginsOptions: {
			selectionToolbar: isToolbarAIFCEnabled
				? undefined
				: (state, intl) => {
						if (!config) {
							return;
						}

						const { pageModes } = config;

						// Extensions Config Validation
						// Check whether plugin contains any selection extensions
						if (!firstParty?.length && !external?.length && !extensionList?.length) {
							return;
						}

						// Content Mode Validation
						// Check if pageModes is provided and matches against current content mode
						// This will eventually transition from mode to viewMode
						const editorViewMode = api?.editorViewMode?.sharedState.currentState()?.mode;

						if (pageModes) {
							// Early Exit: consumer has set pageModes but editorViewMode is undefined
							if (!editorViewMode) {
								return;
							}

							// Simplify traversion of pageModes which can be string or array of strings
							const showOnModesCollection = Array.isArray(pageModes) ? pageModes : [pageModes];

							// Early Exit: consumer has set pageModes but current editorViewMode is not in the collection
							if (!showOnModesCollection.includes(editorViewMode)) {
								return;
							}
						}

						// Active Extension
						// Check if there is an active extension and hide the selection extension dropdown
						const selectionExtensionState = selectionExtensionPluginKey.getState(state);
						if (selectionExtensionState?.activeExtension) {
							return;
						}

						const handleOnExtensionClick =
							(view: EditorView) => (extension: SelectionExtension) => {
								const selection = getSelectionTextInfo(view, api);

								if (extension.component) {
									api?.core.actions.execute(
										api?.selectionExtension.commands.setActiveExtension({
											extension,
											selection,
										}),
									);
								}

								const { selectedNodeAdf, selectionRanges, selectedNode, nodePos } =
									getSelectionAdfInfo(view.state);
								const onClickCallbackOptions: SelectionExtensionCallbackOptions = {
									selectedNodeAdf,
									selectionRanges,
								};
								extension.onClick?.(onClickCallbackOptions);

								api?.core?.actions.execute(({ tr }) => {
									tr.setMeta(selectionExtensionPluginKey, {
										type: SelectionExtensionActionTypes.SET_SELECTED_NODE,
										selectedNode,
										nodePos,
									});
									return tr;
								});
							};

						const convertExtensionToDropdownMenuItem = (
							extension: SelectionExtension,
							rank?: number,
						) => {
							const disabled =
								extension?.isDisabled instanceof Function
									? extension?.isDisabled?.({
											selection: editorViewRef.current
												? getSelectionTextInfo(editorViewRef.current, api)
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

						const getFirstPartyExtensions = (extensions: SelectionExtension[]) => {
							return extensions.map((extension) => {
								return convertExtensionToDropdownMenuItem(extension, 30);
							});
						};

						// Add a heading to the external extensions
						const getExternalExtensions = (extensions: SelectionExtension[]) => {
							let externalExtensions: (
								| OverflowDropdownOption<Command>
								| OverflowDropdownHeading
							)[] = [];
							if (extensions?.length) {
								externalExtensions = extensions.map((extension) => {
									return convertExtensionToDropdownMenuItem(extension);
								});

								const externalExtensionsHeading: OverflowDropdownHeading = {
									type: 'overflow-dropdown-heading',
									title: intl.formatMessage(selectionExtensionMessages.externalExtensionsHeading),
								};
								externalExtensions.unshift(externalExtensionsHeading);
							}
							return externalExtensions;
						};

						// NEXT PR: Make sure we cache the whole generated selection toolbar
						// also debug this to make sure it's actually preventing unnecessary re-renders / work
						if (cachedOverflowMenuOptions && state.selection.eq(cachedSelection)) {
							return selectionToolbar({
								overflowOptions: cachedOverflowMenuOptions,
								extensionList,
							});
						}

						const allFirstParty = [
							...firstParty,
							...getMenuItemExtensions(extensionList, 'first-party'),
						];
						const allExternal = [...external, ...getMenuItemExtensions(extensionList, 'external')];

						const groupedExtensionsArray = [
							...getFirstPartyExtensions(allFirstParty),
							...getExternalExtensions(allExternal),
						];

						cachedOverflowMenuOptions = groupedExtensionsArray;
						cachedSelection = state.selection;

						return selectionToolbar({ overflowOptions: cachedOverflowMenuOptions, extensionList });
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
