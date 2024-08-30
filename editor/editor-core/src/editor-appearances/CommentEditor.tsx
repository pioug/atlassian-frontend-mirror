import React from 'react';

import { CoreEditor } from '../composable-editor/core-editor';
import { type EditorNextProps } from '../types/editor-props';
import Comment from '../ui/Appearance/Comment';

export type CommentEditorProps = Pick<EditorNextProps, 'preset'>;

/**
 * Editor component based on `ComposableEditor` which sets the `appearance` to "comment".
 *
 * This has a performance benefit compared with `ComposableEditor` as it doesn't bundle unnecessary appearance code.
 *
 * Docs for `ComposableEditor` are also relevant: https://atlaskit.atlassian.com/packages/editor/editor-core
 *
 * @param props CommentEditorProps
 * @returns Editor component
 */
export function CommentEditor(props: CommentEditorProps) {
	return <CoreEditor {...props} appearance="comment" AppearanceComponent={Comment} />;
}
