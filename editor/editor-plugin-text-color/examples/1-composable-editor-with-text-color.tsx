import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { historyPlugin } from '@atlaskit/editor-plugins/history';
import { textColorPlugin } from '@atlaskit/editor-plugins/text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';

const Editor = (): React.JSX.Element => {
	const { preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add(historyPlugin)
			.add([analyticsPlugin, {}])
			.add(typeAheadPlugin)
			.add(primaryToolbarPlugin)
			.add(undoRedoPlugin)
			.add(textFormattingPlugin)
			.add(textColorPlugin),
	);

	return <ComposableEditor appearance="full-page" preset={preset} />;
};

export default Editor;
