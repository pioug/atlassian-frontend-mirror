import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	ExtractInjectionAPI,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types/selection';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls/blockControlsPluginType';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format/contentFormatPluginType';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar/floatingToolbarPluginType';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus/focusPluginType';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history/historyPluginType';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockDataProviderInterface } from '@atlaskit/editor-synced-block-provider/providers/types';
import type { UseFetchSyncBlockDataResult } from '@atlaskit/editor-synced-block-provider/useFetchSyncBlockData';

import type { SyncedBlockSharedState } from './types';

export type SyncedBlockEditorProps = {
	defaultDocument: JSONDocNode;
	onChange: (
		editorView: EditorView,
		meta: {
			/**
			 * Indicates whether or not the change may be unnecessary to listen to (dirty
			 * changes can generally be ignored).
			 *
			 * This might be changes to media attributes for example when it gets updated
			 * due to initial setup.
			 *
			 * We still fire these events however to avoid a breaking change.
			 */
			isDirtyChange: boolean;
			source: 'local' | 'remote';
		},
	) => void;
	onEditorReady: ({
		editorView,
		eventDispatcher,
	}: {
		editorView: EditorView;
		eventDispatcher: EventDispatcher;
	}) => void;
	popupsBoundariesElement: HTMLElement;
	popupsMountPoint: HTMLElement;
};

export type SyncedBlockRendererProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	/**
	 * `localId` of the reference node being rendered.
	 *
	 * Products may use this to namespace ids generated inside the synced block
	 * content (for example heading anchor ids), so that the same source block
	 * embedded more than once on a page still produces distinct, stable ids.
	 */
	localId?: string;
	syncBlockFetchResult: UseFetchSyncBlockDataResult;
};

export type SyncedBlockFeedbackContext = {
	blockType: 'source' | 'reference';
	entryPoint: 'overflow-menu' | 'prompted-delete' | 'prompted-undo';
};

export interface SyncedBlockPluginOptions extends LongPressSelectionPluginOptions {
	/**
	 * Enables Live Page specific behaviour for the synced block plugin.
	 *
	 * It is only supported for use by Confluence.
	 *
	 * @default false
	 */
	__livePage?: boolean;
	enableSourceCreation?: boolean;
	/**
	 * Persists that a prompted feedback invitation was displayed.
	 * Called after the shared flag UI renders.
	 */
	onFeedbackPromptShown?: () => Promise<void> | void;
	/**
	 * Opens the host product's synced-block feedback collector.
	 * The editor plugin owns the menu affordance; the product owns the collector
	 * configuration and lifecycle.
	 */
	onGiveFeedback?: (context: SyncedBlockFeedbackContext) => Promise<void> | void;
	/**
	 * Checks whether a prompted feedback invitation is eligible to be shown.
	 * Products own the persistence scope; the editor owns the shared flag UI.
	 */
	shouldShowFeedbackPrompt?: () => Promise<boolean> | boolean;
	syncBlockDataProvider: SyncBlockDataProviderInterface;
	syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
}

export type SyncedBlockPlugin = NextEditorPlugin<
	'syncedBlock',
	{
		actions: {
			/**
			 * Delete all source sync blocks with 'unpublished' status.
			 * Used to clean up orphaned blocks when a user cancels editing
			 * without saving.
			 *
			 * @returns true if all deletions succeeded, false otherwise
			 */
			discardUnpublishedSyncBlocks: () => Promise<boolean>;
			/**
			 * Save content of bodiedSyncBlock nodes in local cache to backend.
			 * This action allows bodiedSyncBlock to be saved in sync with product saving experience
			 * as per {@link https://hello.atlassian.net/wiki/spaces/egcuc/pages/5932393240/Synced+Blocks+Save+refresh+principles}
			 *
			 * @returns true if saving all nodes successfully, false if fail to save some/all nodes
			 */
			flushBodiedSyncBlocks: () => Promise<boolean>;
			/**
			 * Save reference synced blocks on the document (tracked by local cache)to the backend.
			 * This action allows syncBlock on the document to be saved in sync with product saving experience
			 * as per {@link https://hello.atlassian.net/wiki/spaces/egcuc/pages/5932393240/Synced+Blocks+Save+refresh+principles}
			 *
			 * @returns true if flushing all syncBlocks successfully, false otherwise
			 */
			flushSyncedBlocks: () => Promise<boolean>;
		};
		commands: {
			copySyncedBlockReferenceToClipboard: (inputMethod: INPUT_METHOD) => EditorCommand;
			/**
			 * Insert a new source synced block. `inputMethod` records the creating
			 * surface for the `syncedBlockCreate` event; optional so existing callers
			 * keep working.
			 */
			insertSyncedBlock: (inputMethod?: INPUT_METHOD) => EditorCommand;
		};
		dependencies: [
			SelectionPlugin,
			FloatingToolbarPlugin,
			DecorationsPlugin,
			OptionalPlugin<BlockControlsPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<BlockMenuPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<ContentFormatPlugin>,
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<FocusPlugin>,
			OptionalPlugin<HistoryPlugin>,
			OptionalPlugin<UiControlRegistryPlugin>,
		];
		pluginConfiguration: SyncedBlockPluginOptions | undefined;
		sharedState: SyncedBlockSharedState | undefined;
	}
>;
