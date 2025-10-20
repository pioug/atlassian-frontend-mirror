import React, { useState } from 'react';

import applyDevTools from 'prosemirror-dev-tools';

import Button from '@atlaskit/button/new';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { annotationPlugin } from '@atlaskit/editor-plugins/annotation';
import type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';
import { captionPlugin } from '@atlaskit/editor-plugins/caption';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { editorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { extensionPlugin } from '@atlaskit/editor-plugins/extension';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { mentionsPlugin } from '@atlaskit/editor-plugins/mentions';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { statusPlugin } from '@atlaskit/editor-plugins/status';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugins/unsupported-content';
import { widthPlugin } from '@atlaskit/editor-plugins/width';

const step1 = {
	userId: 'ari:cloud:identity::user/123',
	clientId: 123,
	from: 1,
	to: 5,
	stepType: 'replace',
	slice: {
		content: [{ type: 'text', text: 'abc', content: [], attrs: {}, marks: [] }],
		openStart: 0,
		openEnd: 0,
	},
};

export default function Editor() {
	const [colourScheme, setColourScheme] = useState<'standard' | 'traditional'>('traditional');
	const { preset } = usePreset(
		(builder) =>
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
				.add(statusPlugin)
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
				.add(hyperlinkPlugin)
				.add(unsupportedContentPlugin)
				.add(mentionsPlugin)
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
				.add([cardPlugin, { allowBlockCards: true, allowEmbeds: true }])
				.add([editorViewModePlugin, { mode: 'view' }])
				.add([
					mediaPlugin,
					{
						allowMediaSingle: { disableLayout: false },
						allowMediaGroup: true,
						allowResizing: true,
						isCopyPasteEnabled: true,
						allowBreakoutSnapPoints: true,
						allowAdvancedToolBarOptions: true,
						allowDropzoneDropLine: true,
						allowMediaSingleEditable: true,
						allowImagePreview: true,
						fullWidthEnabled: true,
						waitForMediaUpload: true,
						allowCaptions: true,
					},
				])
				.add(captionPlugin)
				.add([
					annotationPlugin,
					{
						inlineComment: {},
					} as AnnotationProviders,
				])
				.add(extensionPlugin)
				.add([
					showDiffPlugin,
					{
						steps: [step1],
						colourScheme: colourScheme,
						originalDoc: {
							type: 'doc',
							version: 1,
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'uiod' }],
								},
							],
						},
					},
				]),
		[colourScheme],
	);

	return (
		<>
			<Button
				onClick={() => {
					setColourScheme(colourScheme === 'traditional' ? 'standard' : 'traditional');
				}}
			>
				Colour scheme: {colourScheme}
			</Button>
			<ComposableEditor
				appearance="full-page"
				onChange={(view) => {
					applyDevTools(view);
				}}
				preset={preset}
				defaultValue={{
					type: 'doc',
					version: 1,
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'abc',
								},
							],
						},
					],
				}}
			/>
		</>
	);
}
