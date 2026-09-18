import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
	EditorCommand,
	ExtractInjectionAPI,
	LongPressSelectionPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
	SyncBlockDataProviderInterface,
	UseFetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';

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
