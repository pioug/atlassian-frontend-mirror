import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { EditorProps } from './types';

export type CommentEditorProps = EditorProps & {
	/**
	 * Renders a Save button at the bottom of the editor. Handler is called when this button is clicked.
	 */
	onSave?: (value?: JSONDocNode) => void;
	/**
	 * Renders a Cancel button at the bottom of the editor. Handler is called when this button is clicked.
	 */
	onCancel?: () => void;
};

/**
 * The comment editor provides a contained editor UI with a simple toolbar.
 *
 * @see [CommentEditor](https://developer.atlassian.com/platform/forge/ui-kit/components/comment-editor/) in UI Kit documentation for more information
 */
export type TCommentEditor<T> = (props: CommentEditorProps) => T;
