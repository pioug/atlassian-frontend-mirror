import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type EditorOnChangeHandler = (
	editorView: EditorView,
	meta: {
		source: 'local' | 'remote';
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
	},
) => void;
