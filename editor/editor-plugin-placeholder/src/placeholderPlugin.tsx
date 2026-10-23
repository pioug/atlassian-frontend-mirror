import React from 'react';

import { isSSR } from '@atlaskit/editor-common/is-ssr';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { PlaceholderLoadingSpinner } from './PlaceholderLoadingSpinner';
import type { PlaceholderPlugin } from './placeholderPluginType';
import createPlugin from './pm-plugins/main';

export const EMPTY_PARAGRAPH_TIMEOUT_DELAY = 2000; // Delay before showing placeholder on empty paragraph

export const pluginKey: PluginKey = new PluginKey('placeholderPlugin');

export const placeholderPlugin: PlaceholderPlugin = ({ config: options, api }) => {
	let currentPlaceholder = options?.placeholder;

	return {
		name: 'placeholder',

		commands: {
			setPlaceholder:
				(placeholderText: string) =>
				({ tr }) => {
					if (currentPlaceholder !== placeholderText) {
						currentPlaceholder = placeholderText;
						return tr.setMeta(pluginKey, { placeholderText: placeholderText });
					}
					return null;
				},
			setAnimatingPlaceholderPrompts:
				(placeholderPrompts: string[] | null) =>
				({ tr }) => {
					return tr.setMeta(pluginKey, { placeholderPrompts: placeholderPrompts });
				},
			setPlaceholderHidden:
				(isPlaceholderHidden: boolean) =>
				({ tr }) => {
					return tr.setMeta(pluginKey, { isPlaceholderHidden });
				},
		},

		pmPlugins() {
			return [
				{
					name: 'placeholder',
					plugin: ({ getIntl }) =>
						createPlugin(
							getIntl(),
							options && options.placeholder,
							options && options.placeholderBracketHint,
							options && options.emptyLinePlaceholder,
							options && options.placeholderPrompts,
							options?.withEmptyParagraph,
							options?.isPlaceholderHidden,
							options && options.placeholderADF,
							options && options.placeholderPromptAnimationOptions,
							options?.isRovoLLMEnabled,
							api,
						),
				},
			];
		},
		contentComponent: (params) => {
			if (isSSR()) {
				return null;
			}

			// If loading spinner is explicitly disabled (e.g., for DiffEditor/version history), skip
			if (options?.enableLoadingSpinner === false) {
				return null;
			}

			return <PlaceholderLoadingSpinner api={api} editorView={params.editorView} />;
		},
	};
};
