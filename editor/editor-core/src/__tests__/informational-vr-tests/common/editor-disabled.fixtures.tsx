import React from 'react';

import { testSetupPlugin } from '@af/editor-libra/setup-plugin';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugins/selection-marker';

import { editorDisabledAdf } from './editor-disabled.adf';

export function Editor() {
	const { preset } = usePreset(() => {
		return new EditorPresetBuilder()
			.add(basePlugin)
			.add(focusPlugin)
			.add(selectionMarkerPlugin)
			.add(testSetupPlugin);
	});
	return (
		<ComposableEditor
			appearance="full-page"
			defaultValue={editorDisabledAdf}
			disabled={true}
			preset={preset}
		/>
	);
}
