import React from 'react';

import { CoreEditor } from '../composable-editor/core-editor';
import { type EditorNextProps } from '../types/editor-props';
import FullPage from '../ui/Appearance/FullPage';

export type FullWidthEditorProps = Pick<EditorNextProps, 'preset'>;

/**
 * Editor component based on `ComposableEditor` which sets the `appearance` to "full-width".
 *
 * This has a performance benefit as it doesn't bundle unnecessary appearance code.
 *
 * Docs for `ComposableEditor` are also relevant: https://atlaskit.atlassian.com/packages/editor/editor-core
 *
 * @param props FullWidthEditorProps
 * @returns Editor component
 */
export function FullWidthEditor(props: FullWidthEditorProps) {
	return <CoreEditor {...props} appearance="full-width" AppearanceComponent={FullPage} />;
}
