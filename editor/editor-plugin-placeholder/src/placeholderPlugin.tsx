import React from 'react';

import { cssMap } from '@atlaskit/css';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { isEmptyDocument } from '@atlaskit/editor-common/utils/document';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner/spinner';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PlaceholderPlugin } from './placeholderPluginType';
import createPlugin from './pm-plugins/main';

export const EMPTY_PARAGRAPH_TIMEOUT_DELAY = 2000; // Delay before showing placeholder on empty paragraph

export const pluginKey = new PluginKey('placeholderPlugin');

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
					if (expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && isSSR()) {
						return null;
					}

					// If loading spinner is explicitly disabled (e.g., for DiffEditor/version history), skip
					if (options?.enableLoadingSpinner === false) {
						return null;
					}

					const doc = params.editorView?.state.doc;

					// @ts-ignore fix which needs follow up to use standard apis
					const collabEditPluginState = params.editorView?.state?.collabEditPlugin$;

					if (collabEditPluginState && collabEditPluginState.isReady !== true) {
						if (doc && !isEmptyDocument(doc)) {
							// If we have a document, and it's not empty - we should not show a loading component
							return null;
						}

						// In this scenario
						// - the collab plugin exists - but we don't have a "initial/placeholder" document
						// - and the collab plugin is not yet ready
						// So we show a placeholder spinner to indicate the content is still loading
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
