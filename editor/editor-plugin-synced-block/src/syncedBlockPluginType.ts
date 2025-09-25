import type { DocNode } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import type {
	SyncBlockDataProvider,
	SyncedBlockProvider,
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
	useFetchDocNode: () => DocNode;
};

export type SyncedBlockPluginOptions = {
	dataProvider?: SyncBlockDataProvider;
	getSyncedBlockEditor?: (props: SyncedBlockEditorProps) => React.JSX.Element;
	getSyncedBlockRenderer?: (props: SyncedBlockRendererProps) => React.JSX.Element;
	syncedBlockProvider?: SyncedBlockProvider;
};

export type SyncedBlockPlugin = NextEditorPlugin<
	'syncedBlock',
	{
		dependencies: [SelectionPlugin, FloatingToolbarPlugin, DecorationsPlugin];
		pluginConfiguration: SyncedBlockPluginOptions | undefined;
	}
>;

export type SyncBlockAttrs = {
	localId: string;
	resourceId: string;
};
