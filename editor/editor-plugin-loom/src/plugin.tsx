import React from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { LoomIcon } from '@atlaskit/logo';

import { insertLoom, recordVideo, recordVideoFailed } from './commands';
import type { LoomPluginState } from './pm-plugin';
import { createPlugin, loomPluginKey } from './pm-plugin';
import type { LoomPluginOptions, PositionType, VideoMeta } from './types';
import LoomToolbarButton from './ui/ToolbarButton';

export type LoomPlugin = NextEditorPlugin<
	'loom',
	{
		pluginConfiguration: LoomPluginOptions;
		dependencies: [
			// Optional, because works fine without analytics
			OptionalPlugin<AnalyticsPlugin>,
			WidthPlugin,
			HyperlinkPlugin,
			OptionalPlugin<PrimaryToolbarPlugin>,
		];
		sharedState: LoomPluginState | undefined;
		actions: {
			recordVideo: ({
				inputMethod,
				editorAnalyticsAPI,
			}: {
				inputMethod: INPUT_METHOD;
				editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
			}) => EditorCommand;
			/**
			 * Insert loom into the document.
			 *
			 * @param video Video metadata (`sharedUrl` and `title`)
			 * @param positionType {'start' | 'end' | 'current'} Where you want to insert the loom
			 * @returns {boolean} If the loom was successfully inserted
			 */
			insertLoom: (video: VideoMeta, positionType: PositionType) => boolean;
		};
	}
>;

export const loomPlugin: LoomPlugin = ({ config, api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	// Workaround since we want to insert a loom via the `hyperlink` plugin for now.
	// The hyperlink plugin (and the card plugin) are deeply tied into using the Prosemirror Command
	// Ideally one day we refactor those and we can remove this.
	const editorViewRef: Record<'current', EditorView | null> = { current: null };
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({ disabled, appearance }) => {
		if (!config.shouldShowToolbarButton) {
			return null;
		}
		return <LoomToolbarButton disabled={disabled} api={api} appearance={appearance} />;
	};

	return {
		name: 'loom',

		actions: {
			recordVideo,
			insertLoom: (video, positionType) =>
				insertLoom(editorViewRef.current, api, video, positionType),
		},

		pmPlugins: () => [
			{
				name: 'loom',
				plugin: () => createPlugin({ config, api }),
			},
			{
				name: 'loomViewRefWorkaround',
				plugin: () => {
					return new SafePlugin({
						view: (editorView: EditorView) => {
							// Do not cleanup the editorViewRef on destroy
							// because some functions may point to a stale
							// reference and this means we will return null.
							// EditorView is assumed to be stable so we do not need to
							// cleanup.
							// See: #hot-106316
							editorViewRef.current = editorView;
							return {};
						},
					});
				},
			},
		],

		getSharedState(editorState) {
			if (!editorState) {
				return;
			}
			return loomPluginKey.getState(editorState);
		},

		pluginsOptions: {
			// Enable inserting Loom recordings through the slash command
			quickInsert: ({ formatMessage }) => [
				{
					id: 'loom',
					title: formatMessage(toolbarInsertBlockMessages.recordVideo),
					description: formatMessage(toolbarInsertBlockMessages.recordVideoDescription),
					keywords: ['loom', 'record', 'video'],
					priority: 800,
					icon: () => <LoomIcon appearance="brand" />,
					action(insert, editorState) {
						const tr = insert(undefined);

						const loomState = loomPluginKey.getState(editorState);
						if (!loomState?.isEnabled) {
							const errorMessage = loomState?.error;
							logException(new Error(errorMessage), {
								location: 'editor-plugin-loom/quick-insert-record-video',
							});
							return (
								recordVideoFailed({
									inputMethod: INPUT_METHOD.QUICK_INSERT,
									error: errorMessage,
									editorAnalyticsAPI,
								})({
									tr,
								}) ?? false
							);
						}

						return (
							recordVideo({
								inputMethod: INPUT_METHOD.QUICK_INSERT,
								editorAnalyticsAPI,
							})({
								tr,
							}) ?? false
						);
					},
				},
			],
		},

		// Enable inserting Loom recordings through main toolbar
		usePluginHook: () => {
			api?.core?.actions.execute(
				api?.primaryToolbar?.commands.registerComponent({
					name: 'loom',
					component: primaryToolbarComponent,
				}),
			);
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
