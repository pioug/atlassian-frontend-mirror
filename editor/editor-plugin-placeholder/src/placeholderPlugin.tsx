import React from 'react';

import { cssMap } from '@atlaskit/css';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner/spinner';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PlaceholderPlugin } from './placeholderPluginType';
import createPlugin from './pm-plugins/main';
import { placeholderPluginLegacy } from './pm-plugins/placeholderPluginLegacy';

export const EMPTY_PARAGRAPH_TIMEOUT_DELAY = 2000; // Delay before showing placeholder on empty paragraph

export const pluginKey = new PluginKey('placeholderPlugin');

export const placeholderPlugin: PlaceholderPlugin = ({ config: options, api }) => {
	if (!fg('platform_editor_placeholder_plugin_tidying')) {
		return placeholderPluginLegacy({ config: options, api });
	}

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
							options && options.placeholderADF,
							api,
						),
				},
			];
		},
		contentComponent: expValEquals(
			'confluence_load_editor_title_on_transition',
			'contentPlaceholder',
			true,
		)
			? (params) => {
					// @ts-ignore fix which needs follow up to use standard apis
					const collabEditPluginState = params.editorView?.state?.collabEditPlugin$;
					if (collabEditPluginState && collabEditPluginState.isReady !== true) {
						return (
							<Box xcss={spinnerContainerStyles.spinnerContainer}>
								<Spinner interactionName="live-pages-loading-spinner" size="medium" />
							</Box>
						);
					}

					return null;
				}
			: undefined,
	};
};

const spinnerContainerStyles = cssMap({
	spinnerContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
});
