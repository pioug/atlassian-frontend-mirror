import React from 'react';

import type { Command, FloatingToolbarCustom } from '@atlaskit/editor-common/types';

import type {
	SelectionExtensionPlugin,
	SelectionExtensionContract,
} from './selectionExtensionPluginType';
import { SelectionExtensionItems } from './ui/toolbar/SelectionExtensionItems';

export const selectionExtensionPlugin: SelectionExtensionPlugin = ({ api, config }) => {
	return {
		name: 'selectionExtension',
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

				const handleOnExtensionClick = (extension: SelectionExtensionContract) => {
					const { selection } = state;
					const { from, to } = selection;

					const text = state.doc.textBetween(from, to, '\n');

					// TODO: Probably some validator logic here
					extension.onClick({ text, selection: { from, to } });
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
								onExtensionClick={handleOnExtensionClick}
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
	};
};
