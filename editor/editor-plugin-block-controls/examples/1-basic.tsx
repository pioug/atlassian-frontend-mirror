import React from 'react';

import applyDevTools from 'prosemirror-dev-tools';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { annotationPlugin } from '@atlaskit/editor-plugins/annotation';
import type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { extensionPlugin } from '@atlaskit/editor-plugins/extension';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugins/width';

import { defaultValue } from './default-value';

export default function Editor(): React.JSX.Element {
	const { preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add(blockTypePlugin)
			.add(focusPlugin)
			.add(typeAheadPlugin)
			.add(quickInsertPlugin)
			.add(selectionPlugin)
			.add(decorationsPlugin)
			.add(layoutPlugin)
			.add(listPlugin)
			.add([analyticsPlugin, {}])
			.add(contentInsertionPlugin)
			.add(widthPlugin)
			.add(guidelinePlugin)
			.add(textFormattingPlugin)
			.add([
				tablesPlugin,
				{
					tableOptions: {
						advanced: true,
						allowColumnResizing: true,
						allowHeaderRow: true,
						allowTableResizing: true,
					},
					isTableScalingEnabled: true,
					dragAndDropEnabled: true,
					allowContextualMenu: true,
					fullWidthEnabled: true,
				},
			])
			.add(emojiPlugin)
			.add(panelPlugin)
			.add(rulePlugin)
			.add(tasksAndDecisionsPlugin)
			.add([expandPlugin, { allowInsertion: true, appearance: 'full-page' }])
			.add(editorDisabledPlugin)
			.add(copyButtonPlugin)
			.add(compositionPlugin)
			.add(codeBlockPlugin)
			.add(blockControlsPlugin)
			.add(breakoutPlugin)
			.add(gridPlugin)
			.add(floatingToolbarPlugin)
			.add([selectionToolbarPlugin, { preferenceToolbarAboveSelection: true }])
			.add([
				mediaPlugin,
				{
					allowMediaSingle: { disableLayout: true },
					allowMediaGroup: false,
					allowResizing: true,
					isCopyPasteEnabled: true,
					allowBreakoutSnapPoints: true,
					allowAdvancedToolBarOptions: true,
					allowDropzoneDropLine: true,
					allowMediaSingleEditable: true,
					allowImagePreview: true,
					fullWidthEnabled: true,
					waitForMediaUpload: true,
				},
			])
			.add([
				annotationPlugin,
				{
					inlineComment: {},
				} as AnnotationProviders,
			])
			.add(extensionPlugin),
	);

	return (
		<ComposableEditor
			appearance="full-page"
			onEditorReady={(editorAction) => {
				editorAction.replaceDocument(defaultValue);
			}}
			onChange={(view) => {
				applyDevTools(view);
			}}
			preset={preset}
		/>
	);
}
