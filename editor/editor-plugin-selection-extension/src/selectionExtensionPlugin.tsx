import React from 'react';

import { selectionExtensionMessages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Command,
	OverflowDropdownHeading,
	OverflowDropdownOption,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { createPlugin, selectionExtensionPluginKey } from './pm-plugins/main';
import type { SelectionExtensionPlugin } from './selectionExtensionPluginType';
import type { SelectionExtension } from './types';
import { SelectionExtensionComponentWrapper } from './ui/extension/SelectionExtensionComponentWrapper';
import { getBoundingBoxFromSelection } from './ui/getBoundingBoxFromSelection';

export const selectionExtensionPlugin: SelectionExtensionPlugin = ({ api, config }) => {
	const editorViewRef: Record<'current', EditorView | null> = { current: null };

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
					const { selection: currentSelection } = fg(
						'platform_editor_extension_toolbar_use_view_state',
					)
						? view.state
						: state;
					const { from, to } = currentSelection;
					const text = state.doc.textBetween(from, to, '\n');
					const coords = getBoundingBoxFromSelection(view, from, to);
					return { text, from, to, coords };
				};

				const handleOnExtensionClick = (view: EditorView) => (extension: SelectionExtension) => {
					const selection = getSelection(view);

					if (extension.component) {
						api?.core.actions.execute(
							api?.selectionExtension.commands.setActiveExtension({
								extension,
								selection,
							}),
						);
					}

					if (extension.onClick) {
						extension.onClick({ selection });
					}
				};

				const convertExtensionToDropdownMenuItem = (
					extension: SelectionExtension,
					rank?: number,
				) => {
					return {
						title: extension.name,
						icon: extension.icon ? <extension.icon label={''} /> : undefined,
						disabled: extension?.isDisabled?.({
							selection: editorViewRef.current ? getSelection(editorViewRef.current) : undefined,
						}),
						rank,
						onClick: () => {
							editorViewRef.current && handleOnExtensionClick(editorViewRef.current)(extension);
							return true;
						},
					} as OverflowDropdownOption<Command>;
				};

				const getFirstPartyExtensions = (extensions: SelectionExtension[]) => {
					return extensions.map((ext) => convertExtensionToDropdownMenuItem(ext, 30));
				};

				/**
				 * Add a heading to the external extensions
				 */
				const getExternalExtensions = (extensions: SelectionExtension[]) => {
					let externalExtensions: (OverflowDropdownOption<Command> | OverflowDropdownHeading)[] =
						[];
					if (extensions?.length) {
						externalExtensions = extensions.map((ext, index) =>
							convertExtensionToDropdownMenuItem(ext),
						);

						const externalExtensionsHeading: OverflowDropdownHeading = {
							type: 'overflow-dropdown-heading',
							title: intl.formatMessage(selectionExtensionMessages.externalExtensionsHeading),
						};
						externalExtensions.unshift(externalExtensionsHeading);
					}
					return externalExtensions;
				};
				const groupedExtensionsArray = [
					...getFirstPartyExtensions(extensions.firstParty || []),
					...getExternalExtensions(extensions.external || []),
				];

				const overflowMenu = {
					type: 'overflow-dropdown' as const,
					dropdownWidth: 240,
					supportsViewMode: true,
					options: groupedExtensionsArray,
				};
				return {
					isToolbarAbove: true,
					items: [
						{
							type: 'separator',
							fullHeight: true,
							supportsViewMode: true,
						},
						overflowMenu,
					],
					rank: -6,
				};
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
