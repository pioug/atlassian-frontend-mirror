import React, { useCallback, useEffect, useState } from 'react';

import applyDevTools from 'prosemirror-dev-tools';

import { PanelType } from '@atlaskit/adf-schema';
import {
	doc,
	expand,
	layoutColumn,
	layoutSection,
	panel,
	p,
	table,
	td,
	th,
	tr,
} from '@atlaskit/adf-utils/builders';
import Button from '@atlaskit/button/new';
import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
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
import { ReplaceStep, type Step } from '@atlaskit/editor-prosemirror/transform';

import type { ColorScheme } from '../src/showDiffPluginType';

const original = doc(
	p('Intro: original paragraph before changes.'),
	table(tr([th()(p('Col A')), th()(p('Col B'))]), tr([td()(p('Cell 1')), td()(p('Cell 2'))])),
	panel({ panelType: PanelType.INFO })(p('Original panel note: please review the draft.')),
	layoutSection()([
		layoutColumn({ width: 50 })([p('Left column original text.')]),
		layoutColumn({ width: 50 })([p('Right column original text.')]),
	]),
	expand({ title: 'Original expand title', __expanded: true })(
		p('Content inside the expand before edits.'),
	),
) as JSONDocNode;

const defaultDoc = doc(
	p('Intro: updated paragraph after changes.'),
	table(
		tr([th()(p('Column 1')), th()(p('Column 2'))]),
		tr([td()(p('Updated A')), td()(p('Updated B'))]),
	),
	panel({ panelType: PanelType.WARNING })(p('Updated panel: draft approved and merged')),
	layoutSection()([
		layoutColumn({ width: 50 })([p('Left column updated text.')]),
		layoutColumn({ width: 50 })([p('Right column updated text.')]),
	]),
	expand({ title: 'Updated expand title', __expanded: true })(
		p('Content inside the expand after edits.'),
	),
) as JSONDocNode;

export default function Editor(): React.JSX.Element {
	const [isShowingDiff, setIsShowingDiff] = useState(false);
	const [colorScheme, setColorScheme] = useState<ColorScheme>('standard');
	const [isInverted, setisInverted] = useState(false);

	const { preset, editorApi } = usePreset(
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
						colorScheme,
						// Diff is shown via editorApi.showDiff.commands.showDiff in useEffect
						steps: [],
						originalDoc: original,
					},
				]),
		[colorScheme],
	);

	const showDiff = useCallback(() => {
		if (!editorApi) {
			return;
		}
		const state = editorApi.core.sharedState.currentState();
		if (!state?.schema) {
			return;
		}
		const schema = state.schema;
		const originalDoc = processRawValue(schema, original);
		const currentDoc = processRawValue(schema, defaultDoc);
		if (!originalDoc || !currentDoc) {
			return;
		}
		const slice = currentDoc.slice(1, currentDoc.content.size);
		const fullReplaceStep = new ReplaceStep(1, originalDoc.content.size, slice);
		const steps: Step[] = [fullReplaceStep];

		editorApi?.core.actions.execute(
			editorApi?.showDiff.commands.showDiff({
				steps,
				originalDoc,
				isInverted,
			}),
		);
		setIsShowingDiff(true);
	}, [editorApi, isInverted]);

	useEffect(() => {
		showDiff();
	}, [editorApi, showDiff]);

	const hideDiff = useCallback(() => {
		editorApi?.core.actions.execute(editorApi?.showDiff.commands.hideDiff);
		setIsShowingDiff(false);
	}, [editorApi]);

	return (
		<>
			<Button
				onClick={() => {
					hideDiff();
					setColorScheme(colorScheme === 'traditional' ? 'standard' : 'traditional');
				}}
			>
				Colour scheme: {colorScheme}
			</Button>
			<Button
				onClick={() => {
					hideDiff();
					setisInverted((prev) => !prev);
				}}
			>
				Inverted: {isInverted ? 'on' : 'off'}
			</Button>
			<Button
				onClick={() => {
					isShowingDiff ? hideDiff() : showDiff();
				}}
			>
				{isShowingDiff ? 'Hide diff' : 'Show diff'}
			</Button>
			<ComposableEditor
				appearance="full-page"
				defaultValue={defaultDoc}
				onChange={(view) => {
					applyDevTools(view);
				}}
				preset={preset}
			/>
		</>
	);
}
