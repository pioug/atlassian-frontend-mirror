/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useEffect, useState } from 'react';

import applyDevTools from 'prosemirror-dev-tools';

import { PanelType } from '@atlaskit/adf-schema/panel';
import {
	blockCard,
	blockQuote,
	codeBlock,
	decisionItem,
	decisionList,
	doc,
	expand,
	heading,
	layoutColumn,
	layoutSection,
	media,
	mediaSingle,
	panel,
	p,
	table,
	taskItem,
	taskList,
	td,
	text,
	th,
	tr,
} from '@atlaskit/adf-utils/builders';
import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownItemRadioGroup from '@atlaskit/dropdown-menu/dropdown-item-radio-group';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
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
import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';
import { getParticipantColor } from '@atlaskit/editor-shared-styles/utils';
// eslint-disable-next-line no-restricted-imports -- This development example must enable the experiment before the editor initializes.
import { UNSAFE_overrideExperiment } from '@atlaskit/platform-feature-experiments/dev-override';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';
import { Text } from '@atlaskit/primitives/compiled';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { token } from '@atlaskit/tokens';

import {
	PARTICIPANT_COLOR_SCHEMES,
	type AdsAccentColor,
} from '../src/pm-plugins/decorations/colorSchemes/types';
import type {
	ColorScheme,
	DiffContributorProfile,
	DiffStepAttribution,
	DiffType,
	StepWithAttribution,
} from '../src/showDiffPluginType';

const diffTypes: DiffType[] = ['inline', 'block', 'step'];
type ColorSchemeMode = Exclude<ColorScheme, `agent-brand-${string}`> | 'attribution';

const COLOR_SCHEME_LABELS: Record<ColorSchemeMode, string> = {
	standard: 'Standard',
	traditional: 'Traditional',
	attribution: 'Attribution',
	red: 'Red',
	blue: 'Blue',
	green: 'Green',
	yellow: 'Yellow',
	purple: 'Purple',
	magenta: 'Magenta',
	teal: 'Teal',
	orange: 'Orange',
	lime: 'Lime',
	gray: 'Gray',
};

// This example intentionally enables attribution colours and contributor tags so they can be
// exercised without a Confluence host application.
// eslint-disable-next-line @atlaskit/platform/no-module-level-eval
setBooleanFeatureFlagResolver(
	(flagKey) =>
		flagKey === 'confluence_ncs_step_diffing_version_history' ||
		flagKey === 'platform_editor_reduce_diff_attr_sensitivity',
);
// eslint-disable-next-line @atlaskit/platform/no-module-level-eval
UNSAFE_overrideExperiment('platform_editor_show_diff_color_scheme_refactor', {
	isEnabled: true,
});
// Only the extended diff pipeline renders contributor tags.
setupEditorExperiments('test', { platform_editor_diff_plugin_extended: true }, undefined, {
	disableTestOverrides: true,
});

const EXAMPLE_USER_ID = '70121:ba36f99a-cdb4-453d-8f80-fd8186963f3e';
const OFFLINE_USER_ID = 'offline-example-user';
// A first-party `agentType` with no profile of its own, so the plugin presents it as "Rovo".
const ROVO_AGENT_ID = '712020:e2807db6-b795-41c5-8f0a-272bae594861';
const STEP_ATTRIBUTIONS: DiffStepAttribution[] = [
	{ userId: EXAMPLE_USER_ID },
	{ userId: EXAMPLE_USER_ID, agentType: 'claude', agentId: '' },
	{ userId: EXAMPLE_USER_ID, agentType: 'chatgpt', agentId: '' },
	{
		userId: EXAMPLE_USER_ID,
		agentType: 'convo-ai',
		agentId: ROVO_AGENT_ID,
	},
	{ userId: OFFLINE_USER_ID, wasOffline: true },
];

const findExampleUserIdForParticipantColor = (colorScheme: AdsAccentColor): string => {
	const targetIndex = PARTICIPANT_COLOR_SCHEMES.indexOf(colorScheme);

	for (let attempt = 0; attempt < 10_000; attempt++) {
		const userId = `show-diff-${colorScheme}-${attempt}`;
		if (getParticipantColor(userId).index === targetIndex) {
			return userId;
		}
	}

	throw new Error(`Could not create an example contributor for ${colorScheme}.`);
};

const SINGLE_COLOR_USER_IDS = Object.fromEntries(
	PARTICIPANT_COLOR_SCHEMES.map((colorScheme) => [
		colorScheme,
		findExampleUserIdForParticipantColor(colorScheme),
	]),
) as Record<AdsAccentColor, string>;

const SINGLE_COLOR_ATTRIBUTIONS = Object.fromEntries(
	Object.entries(SINGLE_COLOR_USER_IDS).map(([colorScheme, userId]) => [colorScheme, { userId }]),
) as Record<AdsAccentColor, DiffStepAttribution>;

/**
 * What a host hands over: identities, not resolved contributors. The plugin drops every tag if any
 * user actor is unnamed, so every `userId` used above needs an entry here.
 *
 * Agent profiles are deliberately absent: `convo-ai` resolves to Rovo, while `claude` resolves
 * to the Claude name and logo even with an empty `agentId`. `chatgpt` resolves to the ChatGPT
 * name and logo the same way.
 */
const EXAMPLE_CONTRIBUTOR_PROFILES: readonly DiffContributorProfile[] = [
	{ accountId: EXAMPLE_USER_ID, name: 'Priya Sharma' },
	{ accountId: OFFLINE_USER_ID, name: 'Dana Whitfield' },
	// One per participant colour, so the single-colour modes can name their contributors too.
	...Object.entries(SINGLE_COLOR_USER_IDS).map(([colorScheme, accountId]) => ({
		accountId,
		name: COLOR_SCHEME_LABELS[colorScheme as AdsAccentColor],
	})),
];

const isParticipantColorMode = (
	colorSchemeMode: ColorSchemeMode,
): colorSchemeMode is AdsAccentColor =>
	colorSchemeMode !== 'standard' &&
	colorSchemeMode !== 'traditional' &&
	colorSchemeMode !== 'attribution';

/**
 * Builds independent top-level replacements from the end of the document towards the start.
 * Applying them in reverse document order keeps every position valid while giving the example
 * enough distinct steps to exercise attribution-aware simplification and colouring.
 */
const createAttributedSteps = (
	originalDoc: ProseMirrorNode,
	currentDoc: ProseMirrorNode,
	participantColorScheme?: AdsAccentColor,
): Array<StepWithAttribution<Step>> => {
	if (originalDoc.childCount !== currentDoc.childCount) {
		throw new Error('The advanced attribution fixture requires matching top-level node counts.');
	}

	const steps: Step[] = [];
	let originalPosition = 0;
	let currentPosition = 0;

	for (let index = 0; index < originalDoc.childCount; index++) {
		const originalNode = originalDoc.child(index);
		const currentNode = currentDoc.child(index);
		const originalTo = originalPosition + originalNode.nodeSize;
		const currentTo = currentPosition + currentNode.nodeSize;

		if (!originalNode.eq(currentNode)) {
			steps.push(
				new ReplaceStep(originalPosition, originalTo, currentDoc.slice(currentPosition, currentTo)),
			);
		}

		originalPosition = originalTo;
		currentPosition = currentTo;
	}

	const orderedSteps = steps.reverse();
	if (!participantColorScheme) {
		return orderedSteps.map((step, index) => ({
			step,
			stepAttribution: STEP_ATTRIBUTIONS[index % STEP_ATTRIBUTIONS.length],
		}));
	}

	if (orderedSteps.length < 2) {
		throw new Error('The single-colour attribution fixture requires at least two changed nodes.');
	}

	const participantColorIndex = PARTICIPANT_COLOR_SCHEMES.indexOf(participantColorScheme);
	const fallbackColorScheme =
		PARTICIPANT_COLOR_SCHEMES[(participantColorIndex + 1) % PARTICIPANT_COLOR_SCHEMES.length];
	if (!fallbackColorScheme) {
		throw new Error(`Could not find a fallback contributor for ${participantColorScheme}.`);
	}

	return orderedSteps.map((step, index) => ({
		step,
		// Keep the final change on a second contributor so attribution colouring does not take the
		// single-contributor fallback path. Every other change uses the selected participant colour.
		stepAttribution:
			index === orderedSteps.length - 1
				? SINGLE_COLOR_ATTRIBUTIONS[fallbackColorScheme]
				: SINGLE_COLOR_ATTRIBUTIONS[participantColorScheme],
	}));
};

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
	heading({ level: 1 })(text('Show Diff Advanced Example')),
	p('Intro: original paragraph before changes.'),
	blockQuote(
		p('Original quote: requirements are still under review.'),
		p('Second quoted line in the original document.'),
	),
	codeBlock({ language: 'ts' })(
		text('const status = "draft";'),
		text('\n'),
		text('console.log(status);'),
	),
	taskList({ localId: 'diff-adv-task-list' })(
		taskItem({ localId: 'diff-adv-task-a', state: 'TODO' })(
			text('Task A: validate assumptions in design review.'),
		),
		taskItem({ localId: 'diff-adv-task-b', state: 'DONE' })(
			text('Task B: capture original acceptance criteria.'),
		),
	),
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
	heading({ level: 1 })(text('Show Diff Advanced Example (Updated)')),
	p('Intro: updated paragraph after changes.'),
	blockQuote(
		p('Updated quote: requirements are approved for implementation.'),
		p('Second quoted line was refined in the updated document.'),
	),
	codeBlock({ language: 'ts' })(
		text('const status = "approved";'),
		text('\n'),
		text('console.log(status.toUpperCase());'),
	),
	taskList({ localId: 'diff-adv-task-list' })(
		taskItem({ localId: 'diff-adv-task-a', state: 'DONE' })(
			text('Task A: assumptions validated in design review.'),
		),
		taskItem({ localId: 'diff-adv-task-c', state: 'TODO' })(
			text('Task C: publish rollout notes for stakeholders.'),
		),
	),
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
	const [colorSchemeMode, setColorSchemeMode] = useState<ColorSchemeMode>('attribution');
	const [isInverted, setisInverted] = useState(false);
	const [hideDeletedDiffs, setHideDeletedDiffs] = useState(false);
	const [diffType, setDiffType] = useState<DiffType>('inline');
	const [showIndicators, setShowIndicators] = useState(false);
	const colorScheme: ColorScheme = colorSchemeMode === 'traditional' ? 'traditional' : 'standard';

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
		const participantColorScheme = isParticipantColorMode(colorSchemeMode)
			? colorSchemeMode
			: undefined;
		const stepsWithAttribution = createAttributedSteps(
			originalDoc,
			currentDoc,
			participantColorScheme,
		);
		const showDiffSteps =
			colorSchemeMode === 'attribution' || participantColorScheme
				? // Contributor tags only render for attributed diffs, and only once the plugin can
					// name every actor behind them.
					{ stepsWithAttribution, contributorProfiles: EXAMPLE_CONTRIBUTOR_PROFILES }
				: { steps: stepsWithAttribution.map(({ step }) => step) };

		editorApi?.core.actions.execute(
			editorApi?.showDiff.commands.showDiff({
				...showDiffSteps,
				originalDoc,
				isInverted,
				hideDeletedDiffs,
				diffType,
				showIndicators,
			}),
		);
		setIsShowingDiff(true);
	}, [editorApi, isInverted, hideDeletedDiffs, diffType, showIndicators, colorSchemeMode]);

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
				<DropdownMenu
					label="Choose diff colour scheme"
					shouldRenderToParent
					trigger={`Colour scheme: ${COLOR_SCHEME_LABELS[colorSchemeMode]}`}
				>
					<DropdownItemRadioGroup id="show-diff-colour-scheme" title="Colour scheme">
						{(Object.entries(COLOR_SCHEME_LABELS) as Array<[ColorSchemeMode, string]>).map(
							([value, label]) => (
								<DropdownItemRadio
									key={value}
									id={`show-diff-colour-scheme-${value}`}
									isSelected={colorSchemeMode === value}
									onClick={() => {
										hideDiff();
										setColorSchemeMode(value);
									}}
								>
									{label}
								</DropdownItemRadio>
							),
						)}
					</DropdownItemRadioGroup>
				</DropdownMenu>
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
						setHideDeletedDiffs((prev) => !prev);
					}}
				>
					Deleted diffs: {hideDeletedDiffs ? 'hidden' : 'visible'}
				</Button>
				<Button
					onClick={() => {
						hideDiff();
						const nextIndex = (diffTypes.indexOf(diffType) + 1) % diffTypes.length;
						setDiffType(diffTypes[nextIndex] ?? 'inline');
					}}
				>
					Type: {diffType}
				</Button>
				<Button
					onClick={() => {
						hideDiff();
						setShowIndicators((prev) => !prev);
					}}
				>
					Indicators: {showIndicators ? 'on' : 'off'}
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
