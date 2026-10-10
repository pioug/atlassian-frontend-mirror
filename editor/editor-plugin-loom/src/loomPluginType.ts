// oxlint-disable-next-line import/no-duplicates
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink/hyperlinkPluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert/quick-insert-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width/width-plugin-type';

import type { LoomPluginState } from './pm-plugins/main';
import type { LoomPluginOptions, LoomProviderOptions, PositionType, VideoMeta } from './types';

export type LoomPlugin = NextEditorPlugin<
	'loom',
	{
		actions: {
			/**
			 * Given loom provider, initialise loom SDK
			 * @returns error message if initialisation failed
			 */
			initLoom: ({
				loomProvider,
			}: {
				loomProvider: LoomProviderOptions;
			}) => Promise<{ error?: string }>;
			/**
			 * Insert loom into the document.
			 *
			 * @param video Video metadata (`sharedUrl` and `title`)
			 * @param positionType {'start' | 'end' | 'current'} Where you want to insert the loom
			 * @returns {boolean} If the loom was successfully inserted
			 */
			insertLoom: (video: VideoMeta, positionType: PositionType) => boolean;

			recordVideo: ({
				inputMethod,
				editorAnalyticsAPI,
			}: {
				editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
				inputMethod: INPUT_METHOD;
			}) => EditorCommand;
		};
		dependencies: [
			// Optional, because works fine without analytics
			OptionalPlugin<AnalyticsPlugin>,
			WidthPlugin,
			HyperlinkPlugin,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<QuickInsertPlugin>,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<UiControlRegistryPlugin>,
		];
		pluginConfiguration: LoomPluginOptions;
		sharedState: LoomPluginState | undefined;
	}
>;
