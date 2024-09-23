import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
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
import { type QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { insertLoom, recordVideo, setupLoom } from './commands';
import type { LoomPluginState } from './pm-plugin';
import { createPlugin, loomPluginKey } from './pm-plugin';
import type { LoomPluginOptions, LoomProviderOptions, PositionType, VideoMeta } from './types';
import { loomPrimaryToolbarComponent } from './ui/PrimaryToolbarButton';
import { getQuickInsertItem } from './ui/quickInsert';

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
			OptionalPlugin<QuickInsertPlugin>,
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

			/**
			 * Given loom provider, initialise loom SDK
			 * @returns error message if initialisation failed
			 */
			initLoom: ({
				loomProvider,
			}: {
				loomProvider: LoomProviderOptions;
			}) => Promise<{ error?: string }>;
		};
	}
>;

export const loomPlugin: LoomPlugin = ({ config, api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	// Workaround since we want to insert a loom via the `hyperlink` plugin for now.
	// The hyperlink plugin (and the card plugin) are deeply tied into using the Prosemirror Command
	// Ideally one day we refactor those and we can remove this.
	const editorViewRef: Record<'current', EditorView | null> = { current: null };
	const primaryToolbarComponent: ToolbarUIComponentFactory = loomPrimaryToolbarComponent(
		config,
		api,
	);
	api?.primaryToolbar?.actions.registerComponent({
		name: 'loom',
		component: primaryToolbarComponent,
	});

	return {
		name: 'loom',

		actions: {
			recordVideo,
			insertLoom: (video, positionType) =>
				insertLoom(editorViewRef.current, api, video, positionType),
			initLoom: ({ loomProvider }) => {
				return setupLoom(loomProvider, api, editorViewRef.current, true);
			},
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
			quickInsert: (intl) => {
				if (config.loomProvider) {
					return getQuickInsertItem(editorAnalyticsAPI)(intl);
				}
				return [];
			},
		},

		// Enable inserting Loom recordings through main toolbar
		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
