import React from 'react';

import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugins/width';

import { ChromelessEditor } from '../src/editor-appearances/ChromelessEditor';

export default function Editor() {
	const { preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add(editorDisabledPlugin)
			.add([analyticsPlugin, {}])
			.add(blockTypePlugin)
			.add(copyButtonPlugin)
			.add(decorationsPlugin)
			.add(floatingToolbarPlugin)
			.add(typeAheadPlugin)
			.add(quickInsertPlugin)
			.add(selectionPlugin)
			.add(widthPlugin)
			.add(contentInsertionPlugin)
			.add(guidelinePlugin)
			.add(tablesPlugin),
	);

	return <ChromelessEditor preset={preset} />;
}
