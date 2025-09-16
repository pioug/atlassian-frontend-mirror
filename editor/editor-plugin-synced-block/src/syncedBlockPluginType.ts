import type { DocNode } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { SyncBlockDataProvider } from '@atlaskit/editor-common/sync-block';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';

export type SyncedBlockEditorProps = {
	boundariesElement: HTMLElement;
	defaultDocument: JSONDocNode;
	mountPoint: HTMLElement;
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
};

export type SyncedBlockRendererProps = {
	docNode: DocNode;
};

export type SyncedBlockPluginOptions = {
	dataProvider?: SyncBlockDataProvider;
	getSyncedBlockEditor?: (props: SyncedBlockEditorProps) => React.JSX.Element;
	getSyncedBlockRenderer?: (props: SyncedBlockRendererProps) => React.JSX.Element;
};

export type SyncedBlockPlugin = NextEditorPlugin<
	'syncedBlock',
	{
		pluginConfiguration: SyncedBlockPluginOptions | undefined;
	}
>;
