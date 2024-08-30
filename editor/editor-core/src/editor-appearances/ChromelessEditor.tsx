import React from 'react';

import { CoreEditor } from '../composable-editor/core-editor';
import { type EditorNextProps } from '../types/editor-props';
import Chromeless from '../ui/Appearance/Chromeless';

export type ChromelessEditorProps = Pick<EditorNextProps, 'preset'>;

/**
 * Editor component based on `ComposableEditor` which sets the `appearance` to "chromeless".
 *
 * This has a performance benefit compared with `ComposableEditor` as it doesn't bundle unnecessary appearance code.
 *
 * Docs for `ComposableEditor` are also relevant: https://atlaskit.atlassian.com/packages/editor/editor-core
 *
 * @param props ChromelessEditorProps
 * @returns Editor component
 */
export function ChromelessEditor(props: ChromelessEditorProps) {
	return <CoreEditor {...props} appearance="chromeless" AppearanceComponent={Chromeless} />;
}
