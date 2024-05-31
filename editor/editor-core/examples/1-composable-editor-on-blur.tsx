import React, { useEffect } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { listPlugin } from '@atlaskit/editor-plugins/list';

function Editor() {
	const { editorApi, preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add([analyticsPlugin, {}])
			.add(blockTypePlugin)
			.add(focusPlugin)
			.add(listPlugin),
	);

	const { focusState } = useSharedPluginState(editorApi, ['focus']);

	useEffect(() => {
		if (!focusState?.hasFocus) {
			// on blur condition
			console.log('Editor is bluring!');
		}
	}, [focusState]);

	return (
		<>
			{!focusState?.hasFocus && <div>Editor does not have focus!</div>}
			<ComposableEditor preset={preset} />
		</>
	);
}

export default function Example() {
	return (
		<EditorContext>
			<Editor />
		</EditorContext>
	);
}
