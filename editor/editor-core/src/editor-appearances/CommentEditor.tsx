import React from 'react';

import { CoreEditor } from '../composable-editor/core-editor';
import { type EditorNextProps } from '../types/editor-props';
import { CommentEditorWithIntl as Comment } from '../ui/Appearance/Comment/Comment';

export type CommentEditorProps = Pick<
	EditorNextProps,
	| 'preset'
	| 'defaultValue'
	| 'assistiveLabel'
	| 'disabled'
	| 'shouldFocus'
	| 'quickInsert'
	| 'performanceTracking'
	| 'secondaryToolbarComponents'
	| 'featureFlags'
	| 'onChange'
	| 'onDestroy'
	| 'onEditorReady'
	| 'onSave'
	| 'onCancel'
	| 'mentionProvider'
	| 'contextIdentifierProvider'
	| 'searchProvider'
	| 'extensionProviders'
>;

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
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <CoreEditor {...props} appearance="comment" AppearanceComponent={Comment} />;
}
