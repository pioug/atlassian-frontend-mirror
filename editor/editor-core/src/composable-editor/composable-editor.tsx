import React, { useMemo } from 'react';

import getUiComponent from '../create-editor/get-ui-component';
import { type EditorNextProps } from '../types/editor-props';

import { CoreEditor } from './core-editor';

export function ComposableEditor(props: EditorNextProps) {
	const AppearanceComponent = useMemo(() => getUiComponent(props.appearance!), [props.appearance]);
	return <CoreEditor {...props} AppearanceComponent={AppearanceComponent} />;
}
