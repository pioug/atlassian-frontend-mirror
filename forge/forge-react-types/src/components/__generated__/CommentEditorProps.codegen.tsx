/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CommentEditorProps
 *
 * @codegen <<SignedSource::7feb6d6879f66c9163e6e50b187fad98>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/editor/comment-editor/index.tsx <<SignedSource::64840977063c8586939cff78dea5b19a>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { EditorProps } from './types.codegen';

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