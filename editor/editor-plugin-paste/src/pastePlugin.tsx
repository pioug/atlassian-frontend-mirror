import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { PastePlugin } from './pastePluginType';
import { createPlugin } from './pm-plugins/main';
import { createPlugin as createMoveAnalyticsPlugin } from './pm-plugins/move-analytics/plugin';
import { pluginKey } from './pm-plugins/plugin-factory';
import { Flag } from './ui/Flag';

export const pastePlugin: PastePlugin = ({ config, api }) => {
	const { cardOptions, sanitizePrivateContent, isFullPage, pasteWarningOptions } = config ?? {};
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	const editorAnalyticsAPI = api?.analytics?.actions;
	return {
		name: 'paste',

		pmPlugins() {
			return [
				{
					name: 'paste',
					plugin: ({ schema, providerFactory, dispatchAnalyticsEvent, dispatch, getIntl }) =>
						createPlugin(
							schema,
							dispatchAnalyticsEvent,
							dispatch,
							featureFlags,
							api,
							getIntl,
							cardOptions,
							sanitizePrivateContent,
							providerFactory,
							pasteWarningOptions,
						),
				},
				{
					name: 'moveAnalyticsPlugin',
					plugin: ({ dispatch }) => {
						return isFullPage ? createMoveAnalyticsPlugin(dispatch, editorAnalyticsAPI) : undefined;
					},
				},
			];
		},

		contentComponent:
			!editorExperiment('platform_synced_block', true) || !fg('platform_synced_block_dogfooding')
				? undefined
				: () => {
						if (!pasteWarningOptions) {
							return null;
						}

						return (
							<>
								<Flag api={api} />
							</>
						);
				  },

		getSharedState: (editorState) => {
			if (!editorState) {
				return {
					activeFlag: null,
					lastContentPasted: null,
				};
			}

			const pluginState = pluginKey.getState(editorState);

			return {
				activeFlag: pluginState.activeFlag,
				lastContentPasted: pluginState.lastContentPasted,
			};
		},
	};
};
