import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
	EditorCommand,
	ExtractInjectionAPI,
	LongPressSelectionPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
	SyncBlockDataProvider,
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
	syncBlockFetchResult: UseFetchSyncBlockDataResult;
};

export interface SyncedBlockPluginOptions extends LongPressSelectionPluginOptions {
	enableSourceCreation?: boolean;
	syncBlockDataProvider: SyncBlockDataProvider;
	syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
}

export type SyncedBlockPlugin = NextEditorPlugin<
	'syncedBlock',
	{
		actions: {
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
			copySyncedBlockReferenceToClipboard: () => EditorCommand;
			insertSyncedBlock: () => EditorCommand;
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
			OptionalPlugin<EditorViewModePlugin>,
		];
		pluginConfiguration: SyncedBlockPluginOptions | undefined;
		sharedState: SyncedBlockSharedState | undefined;
	}
>;
