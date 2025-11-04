import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { SyncedBlockRendererDataProviders } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import type {
	SyncBlockInstance,
	SyncBlockDataProvider,
} from '@atlaskit/editor-synced-block-provider';

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
	syncBlockRendererDataProviders: SyncedBlockRendererDataProviders;
	useFetchSyncBlockData: () => SyncBlockInstance | null;
};

export type SyncedBlockPluginOptions = {
	getSyncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
	syncBlockDataProvider: SyncBlockDataProvider;
	syncBlockRendererDataProviders: SyncedBlockRendererDataProviders;
};

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
		};
		commands: {
			insertSyncedBlock: () => EditorCommand;
		};
		dependencies: [
			SelectionPlugin,
			FloatingToolbarPlugin,
			DecorationsPlugin,
			OptionalPlugin<BlockControlsPlugin>,
			OptionalPlugin<BlockMenuPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
		];
		pluginConfiguration: SyncedBlockPluginOptions | undefined;
	}
>;

export type SyncBlockAttrs = {
	localId: string;
	resourceId: string;
};
