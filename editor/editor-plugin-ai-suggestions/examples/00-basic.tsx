import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { historyPlugin } from '@atlaskit/editor-plugin-history';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { toolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';

import { aiSuggestionsPlugin } from '../src';

const createPreset = () =>
	new EditorPresetBuilder()
		.add(basePlugin)
		.add(typeAheadPlugin)
		.add(widthPlugin)
		.add(compositionPlugin)
		.add([analyticsPlugin, {}])
		.add(editorDisabledPlugin)
		.add(contentInsertionPlugin)
		.add(guidelinePlugin)
		.add(selectionPlugin)
		.add(decorationsPlugin)
		.add(hyperlinkPlugin)
		.add(listPlugin)
		.add(blockTypePlugin)
		.add(quickInsertPlugin)
		.add(focusPlugin)
		.add(copyButtonPlugin)
		.add(floatingToolbarPlugin)
		.add(primaryToolbarPlugin)
		.add(toolbarPlugin)
		.add(textFormattingPlugin)
		.add(historyPlugin)
		.add(aiSuggestionsPlugin);

function Editor(): React.JSX.Element {
	const { preset } = usePreset(createPreset);

	return (
		<IntlProvider locale="en">
			<ComposableEditor preset={preset} appearance="full-page" />
		</IntlProvider>
	);
}

export default Editor;
