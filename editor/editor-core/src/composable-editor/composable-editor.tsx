import React, { useMemo } from 'react';

import getUiComponent from '../create-editor/get-ui-component';
import { type EditorNextProps } from '../types/editor-props';

import { CoreEditor } from './core-editor';

export function ComposableEditor(props: EditorNextProps) {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const AppearanceComponent = useMemo(() => getUiComponent(props.appearance!), [props.appearance]);
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <CoreEditor {...props} AppearanceComponent={AppearanceComponent} />;
}
