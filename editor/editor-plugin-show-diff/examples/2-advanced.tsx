/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */
import React, { useCallback, useEffect, useState } from 'react';

import applyDevTools from 'prosemirror-dev-tools';

import { PanelType } from '@atlaskit/adf-schema';
import {
	blockCard,
	decisionItem,
	decisionList,
	doc,
	expand,
	layoutColumn,
	layoutSection,
	media,
	mediaSingle,
	panel,
	p,
	table,
	td,
	text,
	th,
	tr,
} from '@atlaskit/adf-utils/builders';
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
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
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { ColorScheme, DiffType } from '../src/showDiffPluginType';

const styles = cssMap({
	toolbar: {
		position: 'sticky',
		top: token('space.100'),
		zIndex: 800,
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.100'),
		alignItems: 'center',
		paddingTop: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
		backgroundColor: token('elevation.surface'),
		borderBottomWidth: token('border.width'),
		borderBottomStyle: 'solid',
		borderBottomColor: token('color.border'),
	},
});

const original = doc(
	p('Intro: original paragraph before changes.'),
	p(
		'Below: decision list (two items — one will be edited, one removed), blockCard, mediaSingle, then table / panel / layout / expand. Scroll to exercise the sticky toolbar.',
	),
	decisionList({ localId: 'diff-adv-decisions' })(
		decisionItem({ localId: 'diff-adv-di-a', state: 'DECIDED' })(
			text('Decision A: original wording (will be updated).'),
		),
		decisionItem({ localId: 'diff-adv-di-b', state: 'DECIDED' })(
			text('Decision B: this item is removed in the new document.'),
		),
	),
	blockCard({
		localId: 'diff-adv-block-card',
		url: 'https://example.com/original-page',
	}),
	mediaSingle({ layout: 'center' })(
		media({
			id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
			type: 'file',
			collection: 'MediaServicesSample',
			width: 5845,
			height: 1243,
		}),
	),
	table(tr([th()(p('Col A')), th()(p('Col B'))]), tr([td()(p('Cell 1')), td()(p('Cell 2'))])),
	panel({ panelType: PanelType.INFO })(p('Original panel note: please review the draft.')),
	layoutSection()([
		layoutColumn({ width: 50 })([p('Left column original text.')]),
		layoutColumn({ width: 50 })([p('Right column original text.')]),
	]),
	expand({ title: 'Original expand title', __expanded: true })(
		p('Content inside the expand before edits.'),
	),
	p(
		'Filler paragraphs so the page scrolls: the toolbar above stays sticky while you review diff decorations on decisions, cards, and media.',
	),
	p(
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
	),
) as JSONDocNode;

const defaultDoc = doc(
	p('Intro: updated paragraph after changes.'),
	p(
		'Below: decision list (edited first item, removed second, added third), blockCard URL change, different mediaSingle asset, then table / panel / layout / expand.',
	),
	decisionList({ localId: 'diff-adv-decisions' })(
		decisionItem({ localId: 'diff-adv-di-a', state: 'DECIDED' })(
			text('Decision A: updated wording after review.'),
		),
		decisionItem({ localId: 'diff-adv-di-c', state: 'DECIDED' })(
			text('Decision C: newly added decision item.'),
		),
	),
	blockCard({
		localId: 'diff-adv-block-card',
		url: 'https://www.atlassian.com/software',
	}),
	mediaSingle({ layout: 'center' })(
		media({
			id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
			type: 'file',
			collection: 'MediaServicesSample',
			width: 300,
			height: 150,
		}),
	),
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
	p(
		'Filler paragraphs so the page scrolls: the toolbar above stays sticky while you review diff decorations on decisions, cards, and media.',
	),
	p(
		'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	),
) as JSONDocNode;

export default function Editor(): React.JSX.Element {
	const [isShowingDiff, setIsShowingDiff] = useState(false);
	const [colorScheme, setColorScheme] = useState<ColorScheme>('standard');
	const [isInverted, setisInverted] = useState(false);
	const [diffType, setDiffType] = useState<DiffType>('inline');

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

	const { numberOfChanges, activeIndex } = useSharedPluginStateWithSelector(
		editorApi,
		['showDiff'],
		({ showDiffState }) => ({
			numberOfChanges: showDiffState?.numberOfChanges ?? 0,
			activeIndex: showDiffState?.activeIndex,
		}),
	);

	const handleScrollToNext = useCallback(() => {
		editorApi?.core?.actions.execute(editorApi?.showDiff?.commands.scrollToNext);
	}, [editorApi]);

	const handleScrollToPrevious = useCallback(() => {
		editorApi?.core?.actions.execute(editorApi?.showDiff?.commands.scrollToPrevious);
	}, [editorApi]);

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
				diffType,
			}),
		);
		setIsShowingDiff(true);
	}, [editorApi, isInverted, diffType]);

	useEffect(() => {
		showDiff();
	}, [editorApi, showDiff]);

	const hideDiff = useCallback(() => {
		editorApi?.core.actions.execute(editorApi?.showDiff.commands.hideDiff);
		setIsShowingDiff(false);
	}, [editorApi]);

	return (
		<>
			<div css={styles.toolbar}>
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
						hideDiff();
						setDiffType(diffType === 'inline' ? 'block' : 'inline');
					}}
				>
					Type: {diffType}
				</Button>
				<Button
					onClick={() => {
						isShowingDiff ? hideDiff() : showDiff();
					}}
				>
					{isShowingDiff ? 'Hide diff' : 'Show diff'}
				</Button>
				<Button onClick={handleScrollToPrevious} isDisabled={numberOfChanges === 0}>
					Previous
				</Button>
				<Button onClick={handleScrollToNext} isDisabled={numberOfChanges === 0}>
					Next
				</Button>
				<Text color="color.text.subtle">
					{numberOfChanges > 0
						? `Change ${(activeIndex ?? 0) + 1} of ${numberOfChanges}`
						: 'No changes'}
				</Text>
			</div>
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
