import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import { type QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type { LoomPluginState } from './pm-plugins/main';
import type { LoomPluginOptions, LoomProviderOptions, PositionType, VideoMeta } from './types';

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
