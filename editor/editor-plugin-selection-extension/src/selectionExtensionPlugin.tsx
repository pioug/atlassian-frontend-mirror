import React from 'react';

import type { Command, FloatingToolbarCustom } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { selectionExtensionPluginKey, createPlugin } from './pm-plugins/main';
import type { SelectionExtensionPlugin } from './selectionExtensionPluginType';
import type { SelectionExtensionContract } from './types';
import { SelectionExtensionComponentWrapper } from './ui/extension/SelectionExtensionComponentWrapper';
import { getBoundingBoxFromSelection } from './ui/getBoundingBoxFromSelection';
import { SelectionExtensionItems } from './ui/toolbar/SelectionExtensionItems';

export const selectionExtensionPlugin: SelectionExtensionPlugin = ({ api, config }) => {
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
			return <SelectionExtensionComponentWrapper editorView={editorView} api={api} />;
		},
		pluginsOptions: {
			selectionToolbar: (state) => {
				if (!config) {
					return;
				}

				const { pageModes, extensions } = config;

				/**
				 * Extensions Config Validation
				 *
				 * Check whether plugin contains any selection extensions
				 */
				if (!extensions || extensions.length === 0) {
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

				const handleOnExtensionClick =
					(view: EditorView) => (extension: SelectionExtensionContract) => {
						const { selection: currentSelection } = state;
						const { from, to } = currentSelection;

						const text = state.doc.textBetween(from, to, '\n');
						const coords = getBoundingBoxFromSelection(view, from, to);
						const selection = { text, selection: { from, to }, coords };

						// Render component here
						if (extension.component) {
							api?.core.actions.execute(
								api?.selectionExtension.commands.setActiveExtension({
									extension,
									selection,
								}),
							);
						}

						if (extension.onClick) {
							extension.onClick(selection);
						}
					};

				/**
				 * Renders custom dropdown menu with active selection extensions
				 */
				const selectionExtensionDropdown: FloatingToolbarCustom<Command> = {
					type: 'custom',
					supportsViewMode: true,
					render: (view) => {
						if (!view) {
							return;
						}

						return (
							<SelectionExtensionItems
								api={api}
								editorView={view}
								editorAnalyticsAPI={api?.analytics?.actions}
								extensions={extensions}
								onExtensionClick={handleOnExtensionClick(view)}
							/>
						);
					},
					fallback: [],
				};

				return {
					isToolbarAbove: true,
					items: [selectionExtensionDropdown],
					rank: -6,
				};
			},
		},
		pmPlugins: () => [
			{
				name: 'selectionExtension',
				plugin: () => createPlugin(),
			},
		],
	};
};
