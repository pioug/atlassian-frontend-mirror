/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useEffect, useMemo, useState } from 'react';

import { PanelType } from '@atlaskit/adf-schema/schema';
import {
	blockQuote,
	bulletList,
	codeBlock,
	doc,
	expand,
	heading,
	layoutColumn,
	layoutSection,
	li,
	panel,
	p,
	strong,
	table,
	td,
	text,
	th,
	tr,
} from '@atlaskit/adf-utils/builders';
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownItemCheckbox from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import DropdownItemCheckboxGroup from '@atlaskit/dropdown-menu/dropdown-item-checkbox-group';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
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
import { editorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { showDiffPlugin } from '@atlaskit/editor-plugins/show-diff';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import {
	Fragment,
	type Node as PMNode,
	type Schema as PMSchema,
	Slice,
} from '@atlaskit/editor-prosemirror/model';
import {
	AddMarkStep,
	Mapping,
	ReplaceStep,
	type Step,
	StepMap,
} from '@atlaskit/editor-prosemirror/transform';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type {
	ColorScheme,
	DeletedDiffPlacement,
	DiffType,
	InlineDeletedDiffPlacement,
} from '../src/showDiffPluginType';

// `smart` is the star of this example; the others are kept so you can compare.
const diffTypes: DiffType[] = ['smart', 'inline', 'block', 'step'];

// Default smart thresholds — shown explicitly so they are discoverable/tunable.
const smartThresholds = {
	sentence: { ratio: 0.4, minChanged: 2 },
	paragraph: { ratio: 0.4, minChanged: 2 },
	node: { ratio: 0.6, textBearingRatio: 0.6 },
};

const styles = cssMap({
	page: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	controls: {
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'center',
		flexWrap: 'wrap',
		position: 'sticky',
		top: token('space.0'),
		zIndex: 100,
		backgroundColor: token('elevation.surface'),
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		borderBottomWidth: token('border.width'),
		borderBottomStyle: 'solid',
		borderBottomColor: token('color.border'),
	},
	// Row that lays out one or more diff panels side by side.
	panelRow: {
		display: 'flex',
		gap: token('space.200'),
		alignItems: 'flex-start',
	},
	// A single diff panel: flexes to share the row width and scrolls independently.
	panel: {
		flex: '1 1 0',
		minWidth: '0',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		paddingTop: token('space.100'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.150'),
	},
	panelControls: {
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'center',
		flexWrap: 'wrap',
		marginBottom: token('space.100'),
	},
	// The kitchen-sink scenario rendered in its own editor below the merged gallery.
	scenario: {
		marginTop: token('space.300'),
		borderTopWidth: token('border.width'),
		borderTopStyle: 'solid',
		borderTopColor: token('color.border'),
		paddingTop: token('space.200'),
	},
});

/**
 * Context handed to a scenario's `buildSteps` factory. All positions are in the scenario's
 * OWN coordinate space — i.e. as if `beforeDoc` were the whole document. The merge logic
 * offsets everything into the merged document for you, so authors never think about the
 * surrounding scenarios.
 */
type ScenarioStepContext = {
	/** The scenario's before doc, resolved against the real editor schema. */
	beforeDoc: PMNode;
	/** The editor schema (for creating marks, nodes, slices, etc.). */
	schema: PMSchema;
};

/**
 * A predefined smart-diff scenario: an independent before doc and after doc.
 *
 * By default the diff is a single ReplaceStep that swaps the whole `before` body for the
 * whole `after` body. Real edits, though, are usually a *sequence* of steps touching
 * different parts of the document. A scenario can therefore optionally provide `buildSteps`
 * to declare exactly which steps it wants — any number of `ReplaceStep`s, `AddMarkStep`s,
 * etc. — expressed in the scenario's own coordinate space. When `buildSteps` is provided,
 * `after` is only used to render the final editor content, not to derive the steps.
 */
type Scenario = {
	after: JSONDocNode;
	before: JSONDocNode;
	/**
	 * Optional: declare the exact steps for this scenario (in scenario-local coordinates).
	 * Return steps in the order they were applied. If omitted, a single whole-body
	 * ReplaceStep (before → after) is used.
	 */
	buildSteps?: (ctx: ScenarioStepContext) => Step[];
	label: string;
	/**
	 * Debug helper: set `only: true` on one (or more) scenarios to render ONLY those and skip
	 * the rest — like Jest's `.only`. Remove it to restore the full gallery.
	 */
	only?: boolean;
};

// A long sentence — used to demonstrate that changing 3-4 words in a LONG sentence stays
// inline (denominator large → ratio below sentence threshold).
const LONG =
	'This is a deliberately long sentence with many many words so that changing only a handful of them keeps the change ratio comfortably below the sentence promotion threshold.';

/**
 * Each scenario is a self-contained before/after pair. The diff is expressed as a single
 * ReplaceStep that replaces the whole `before` body with the whole `after` body — no LCS,
 * no per-block step derivation. This makes it trivial to author changes where the node
 * shape differs wildly between before and after (e.g. one paragraph → two paragraphs + a
 * table).
 *
 * Legend: BELOW = below threshold (fine-grained diff expected);
 *         ABOVE = at/above threshold (promotion to the next level expected).
 */
const scenarios: Scenario[] = [
	// ── SENTENCE level ──────────────────────────────────────────────────────────
	{
		label: '1a. Sentence BELOW threshold → inline word diff',
		// First sentence: 4 words swapped; sixth: one word removed. 2 of 6 sentences (33%),
		// each below the sentence ratio → inline word diffs, no promotion.
		before: doc(
			p(
				'The quick brown fox jumps over the lazy dog near the river every single morning without fail. The second sentence is completely untouched. The third sentence stays exactly the same. The fourth sentence also stays the same. The fifth sentence remains identical. The sixth sentence is also left unchanged.',
			),
		) as JSONDocNode,
		after: doc(
			p(
				'The quick red cat leaps across the lazy dog near the river every single morning without fail. The second sentence is completely untouched. The third sentence stays exactly the same. The fourth sentence also stays the same. The fifth sentence remains identical. The sentence is there.',
			),
		) as JSONDocNode,
	},
	{
		label: '1b. Sentence ABOVE threshold → whole-sentence diff',
		// Short sentence, most words changed → promote to sentence-level.
		before: doc(p('A short crisp line.')) as JSONDocNode,
		after: doc(p('A tiny bold phrase.')) as JSONDocNode,
	},

	// ── PARAGRAPH level ─────────────────────────────────────────────────────────
	{
		label: '2a. Paragraph BELOW threshold → per-sentence diff',
		// 1 of 4 sentences changed (25% < 40%) → sentence-level diff within paragraph.
		before: doc(
			p(
				'First sentence stays the same. Second sentence stays the same. Third sentence stays the same. Only this fourth sentence will be edited.',
			),
		) as JSONDocNode,
		after: doc(
			p(
				'First sentence stays the same. Second sentence stays the same. Third sentence stays the same. Now the fourth sentence reads completely differently.',
			),
		) as JSONDocNode,
	},
	{
		label: '2b. Paragraph ABOVE threshold → whole-paragraph diff',
		// 3 of 3 sentences changed (100% >= 40%) → whole-paragraph diff.
		before: doc(p('Alpha one here. Beta two here. Gamma three here.')) as JSONDocNode,
		after: doc(p('Delta one gone. Epsilon two gone. Zeta three gone.')) as JSONDocNode,
	},

	// ── NODE type change (short-circuit) ────────────────────────────────────────
	{
		label: '3. Type change → node-level (paragraph → heading)',
		before: doc(
			p('This exact text becomes a heading; content identical, only the type changes.'),
		) as JSONDocNode,
		after: doc(
			heading({ level: 2 })(
				text('This exact text becomes a heading; content identical, only the type changes.'),
			),
		) as JSONDocNode,
	},

	// ── ONE PARAGRAPH → TWO PARAGRAPHS + TABLE (multi-node replace) ──────────────
	{
		label: '3b. One paragraph → two paragraphs + a table (node-shape change)',
		before: doc(
			p('A single paragraph that will be expanded into much more content.'),
		) as JSONDocNode,
		after: doc(
			p('The first replacement paragraph introduces the new content.'),
			p('The second replacement paragraph adds more detail before the table.'),
			table(
				tr([th()(p('Name')), th()(p('Value'))]),
				tr([td()(p('alpha')), td()(p('1'))]),
				tr([td()(p('beta')), td()(p('2'))]),
			),
		) as JSONDocNode,
	},

	// ── TABLE ───────────────────────────────────────────────────────────────────
	{
		label: '4a. Table BELOW threshold → in-cell diff',
		// 1 of 8 body cells changed (<60%) → in-cell diff only.
		before: doc(
			table(
				tr([th()(p('H1')), th()(p('H2')), th()(p('H3')), th()(p('H4'))]),
				tr([td()(p('r1c1')), td()(p('r1c2')), td()(p('r1c3')), td()(p('r1c4'))]),
				tr([td()(p('r2c1')), td()(p('r2c2')), td()(p('r2c3')), td()(p('r2c4'))]),
			),
		) as JSONDocNode,
		after: doc(
			table(
				tr([th()(p('H1')), th()(p('H2')), th()(p('H3')), th()(p('H4'))]),
				tr([td()(p('r1c1')), td()(p('r1c2 EDITED')), td()(p('r1c3')), td()(p('r1c4'))]),
				tr([td()(p('r2c1')), td()(p('r2c2')), td()(p('r2c3')), td()(p('r2c4'))]),
			),
		) as JSONDocNode,
	},
	{
		label: '4b. Table ABOVE threshold → node-level diff',
		// Most cells changed (>=60%) → whole-table node-level diff.
		before: doc(
			table(
				tr([th()(p('A')), th()(p('B')), th()(p('C'))]),
				tr([td()(p('1')), td()(p('2')), td()(p('3'))]),
				tr([td()(p('4')), td()(p('5')), td()(p('6'))]),
			),
		) as JSONDocNode,
		after: doc(
			table(
				tr([th()(p('A')), th()(p('B*')), th()(p('C*'))]),
				tr([td()(p('1*')), td()(p('2*')), td()(p('3*'))]),
				tr([td()(p('4*')), td()(p('5*')), td()(p('6*'))]),
			),
		) as JSONDocNode,
	},

	// ── LIST ──────────────────────────────────────────────────────────────────--
	{
		label: '5a. List BELOW threshold → per-item diff',
		// 1 of 5 items changed (<40%) → per-item diff.
		before: doc(
			bulletList(
				li([p('Apples in the basket')]),
				li([p('Bananas in the basket')]),
				li([p('Cherries in the basket')]),
				li([p('Dates in the basket')]),
				li([p('Elderberries in the basket')]),
			),
		) as JSONDocNode,
		after: doc(
			bulletList(
				li([p('Apples in the basket')]),
				li([p('Bananas in the crate')]),
				li([p('Cherries in the basket')]),
				li([p('Dates in the basket')]),
				li([p('Elderberries in the basket')]),
			),
			p('This is a paragraph after list.'),
		) as JSONDocNode,
	},
	{
		label: '5b. List ABOVE threshold → node-level diff',
		// All items changed (>=40%) → whole-list node-level diff.
		before: doc(bulletList(li([p('one')]), li([p('two')]), li([p('three')]))) as JSONDocNode,
		after: doc(bulletList(li([p('ONE')]), li([p('TWO')]), li([p('THREE')]))) as JSONDocNode,
	},

	// ── LAYOUT ──────────────────────────────────────────────────────────────────
	{
		label: '6a. Layout BELOW threshold → per-column-paragraph diff',
		// 1 of 9 paragraphs changed → paragraph-level diff inside the column.
		before: doc(
			layoutSection()([
				layoutColumn({ width: 33.33 })([p('Col1 para A'), p('Col1 para B'), p('Col1 para C')]),
				layoutColumn({ width: 33.33 })([p('Col2 para A'), p('Col2 para B'), p('Col2 para C')]),
				layoutColumn({ width: 33.33 })([p('Col3 para A'), p('Col3 para B'), p('Col3 para C')]),
			]),
		) as JSONDocNode,
		after: doc(
			layoutSection()([
				layoutColumn({ width: 33.33 })([
					p('Col1 para A'),
					p('Col1 para B EDITED'),
					p('Col1 para C'),
				]),
				layoutColumn({ width: 33.33 })([p('Col2 para A'), p('Col2 para B'), p('Col2 para C')]),
				layoutColumn({ width: 33.33 })([p('Col3 para A'), p('Col3 para B'), p('Col3 para C')]),
			]),
		) as JSONDocNode,
	},
	{
		label: '6b. Layout ABOVE threshold → node-level diff',
		// All paragraphs across both columns changed → node-level diff.
		before: doc(
			layoutSection()([
				layoutColumn({ width: 50 })([p('Left x'), p('Left y')]),
				layoutColumn({ width: 50 })([p('Right x'), p('Right y')]),
			]),
		) as JSONDocNode,
		after: doc(
			layoutSection()([
				layoutColumn({ width: 50 })([p('Left X changed'), p('Left Y changed')]),
				layoutColumn({ width: 50 })([p('Right X changed'), p('Right Y changed')]),
			]),
		) as JSONDocNode,
	},

	// ── EXPAND / PANEL / QUOTE / CODEBLOCK (container inner rules) ───────────────
	{
		label: '7. Expand: inner paragraph BELOW threshold → inline',
		before: doc(
			expand({ title: 'Details', __expanded: true })(
				p(`${LONG} Two words tweaked inside the expand.`),
			),
		) as JSONDocNode,
		after: doc(
			expand({ title: 'Details', __expanded: true })(
				p(`${LONG} Few words tweaked inside the expand.`),
			),
		) as JSONDocNode,
	},
	{
		label: '8. Panel: inner paragraph ABOVE threshold → paragraph diff',
		before: doc(panel({ panelType: PanelType.INFO })(p('Ping pong ding dong.'))) as JSONDocNode,
		after: doc(panel({ panelType: PanelType.INFO })(p('Zip zap zoom boom.'))) as JSONDocNode,
	},
	{
		label: '9. Quote: one of two lines edited (below)',
		before: doc(
			blockQuote(p('Quote line one stays.'), p('Quote line two will change entirely here.')),
		) as JSONDocNode,
		after: doc(
			blockQuote(p('Quote line one stays.'), p('Quote line two is now totally rewritten instead.')),
		) as JSONDocNode,
	},
	{
		label: '10. Code block edited',
		before: doc(
			codeBlock({ language: 'ts' })(text('const a = 1;\nconst b = 2;\nconsole.log(a + b);')),
		) as JSONDocNode,
		after: doc(
			codeBlock({ language: 'ts' })(text('const a = 1;\nconst b = 20;\nconsole.log(a * b);')),
		) as JSONDocNode,
	},

	// ── DELETION ────────────────────────────────────────────────────────────────
	{
		label: '11. Deleted node (whole paragraph removed)',
		before: doc(
			p('Kept paragraph before the deletion.'),
			p('This entire paragraph is deleted in the updated document.'),
		) as JSONDocNode,
		after: doc(p('Kept paragraph before the deletion.')) as JSONDocNode,
	},

	// ══════════════════════════════════════════════════════════════════════════════
	// COMPLEX, REAL-WORLD SCENARIOS
	// Multi-node documents where changes are spread across nodes, node types are
	// added / removed / updated, and the prose is realistic (full sentences and
	// paragraphs rather than "one two three"). These exercise how `smart` chooses a
	// granularity per node while several nodes change at once.
	// ══════════════════════════════════════════════════════════════════════════════

	// ── C1. Product spec: edits scattered across a multi-section document ──────────
	// A realistic PRD excerpt. Some paragraphs get a light touch (a word or two →
	// inline), one paragraph is substantially rewritten (→ paragraph-level), a new
	// panel is inserted, one bullet list item is added, and a stale note is removed.
	{
		label: 'C1. Product spec — light edits, one rewrite, an inserted panel, list tweaks',
		before: doc(
			heading({ level: 2 })(text('Overview')),
			p(
				'The notifications service delivers in-app and email alerts to users when activity happens on content they follow. It currently supports mentions, comments, and share events across the three flagship products.',
			),
			p(
				'Our goal for this quarter is to reduce notification latency and give users finer-grained control over which events they receive, without increasing the volume of low-value noise in their inbox.',
			),
			heading({ level: 3 })(text('Requirements')),
			bulletList(
				li([p('Users can mute an individual thread for a fixed period of time.')]),
				li([p('Users can choose a daily or weekly digest instead of real-time email.')]),
				li([p('Administrators can set organisation-wide default preferences.')]),
			),
			p(
				'Note: the legacy webhook pipeline is out of scope for this quarter and will be addressed separately.',
			),
		) as JSONDocNode,
		after: doc(
			heading({ level: 2 })(text('Overview')),
			p(
				'The notifications service delivers in-app and email alerts to users when activity happens on content they follow. It currently supports mentions, comments, reactions, and share events across the four flagship products.',
			),
			// This paragraph is substantially rewritten → expect a paragraph-level diff.
			p(
				'This quarter we are prioritising two outcomes above everything else. First, notifications should arrive within a few seconds of the triggering event so conversations feel live. Second, people should be able to tune exactly what reaches them, so their inbox stays high-signal rather than a firehose of updates they learn to ignore.',
			),
			// New panel inserted between paragraph and heading → node added.
			panel({ panelType: PanelType.WARNING })(
				p(
					'Scope guardrail: any change to delivery timing must be measured against the existing latency SLO before rollout.',
				),
			),
			heading({ level: 3 })(text('Requirements')),
			bulletList(
				li([p('Users can mute an individual thread for a fixed period of time.')]),
				li([p('Users can choose a daily or weekly digest instead of real-time email.')]),
				li([p('Administrators can set organisation-wide default preferences.')]),
				// Added list item.
				li([p('Users can preview how a given preference will affect their inbox before saving.')]),
			),
			// The stale "Note:" paragraph is removed entirely.
		) as JSONDocNode,
	},

	// ── C2. Meeting notes: mixed node types added, removed, and reordered ──────────
	// Heading kept, intro lightly edited, a decision list grows, an action-item task
	// list is heavily rewritten, and a code snippet is added at the end.
	{
		label: 'C2. Meeting notes — heading kept, decisions grow, actions rewritten, snippet added',
		before: doc(
			heading({ level: 2 })(text('Weekly sync — 12 May')),
			p(
				'We reviewed progress on the search relevance experiment and agreed on the rollout plan for the coming fortnight. Attendance was light because of the public holiday, so a couple of decisions were deferred.',
			),
			heading({ level: 3 })(text('Decisions')),
			bulletList(
				li([p('Ship the new ranking model to five percent of traffic on Wednesday.')]),
				li([p('Keep the old model as a fallback behind a feature flag.')]),
			),
			heading({ level: 3 })(text('Actions')),
			bulletList(
				li([p('Alex to write the rollout runbook.')]),
				li([p('Priya to set up the dashboard for the guardrail metrics.')]),
			),
		) as JSONDocNode,
		after: doc(
			heading({ level: 2 })(text('Weekly sync — 12 May')),
			p(
				'We reviewed progress on the search relevance experiment and agreed on the rollout plan for the coming week. Attendance was light because of the public holiday, so a couple of decisions were deferred to the next session.',
			),
			heading({ level: 3 })(text('Decisions')),
			bulletList(
				li([p('Ship the new ranking model to five percent of traffic on Wednesday.')]),
				li([p('Keep the old model as a fallback behind a feature flag.')]),
				li([p('Hold the wider rollout until the guardrail dashboard has a full week of data.')]),
				li([p('Revisit the deferred pricing question at the next sync.')]),
			),
			heading({ level: 3 })(text('Actions')),
			// Action list heavily rewritten → most items change.
			bulletList(
				li([p('Alex to draft and circulate the rollout runbook for review by Monday.')]),
				li([p('Priya to wire up the guardrail dashboard and add alerting thresholds.')]),
				li([
					p('Sam to prepare the five-percent cohort definition and validate it with data science.'),
				]),
			),
			// New code snippet appended.
			codeBlock({ language: 'bash' })(
				text(
					'# roll out to 5% and watch guardrails\nafm experiment set search-ranking --percent 5',
				),
			),
		) as JSONDocNode,
	},

	// ── C3. Runbook: node-type conversions (paragraph → panel, list → table) ──────
	// Demonstrates type changes that must short-circuit to node-level, alongside
	// ordinary edits in surrounding nodes.
	{
		label: 'C3. Runbook — paragraph becomes a warning panel, steps list becomes a table',
		before: doc(
			heading({ level: 2 })(text('Incident runbook: elevated 5xx rate')),
			p(
				'Before you begin, make sure you have production access and that you are added to the incident channel. This procedure assumes the alert has already fired.',
			),
			p('Follow these steps in order and do not skip the verification step at the end.'),
			bulletList(
				li([p('Check the service health dashboard for the affected region.')]),
				li([p('Roll back the most recent deployment if it correlates with the spike.')]),
				li([p('Escalate to the on-call lead if error rates do not recover in ten minutes.')]),
			),
		) as JSONDocNode,
		after: doc(
			heading({ level: 2 })(text('Incident runbook: elevated 5xx rate')),
			p(
				'Before you begin, make sure you have production access and that you are added to the incident channel. This procedure assumes the alert has already fired.',
			),
			// Plain paragraph converted into a warning panel → node-level (type change).
			panel({ panelType: PanelType.ERROR })(
				p('Follow these steps in order and do not skip the verification step at the end.'),
			),
			// Bullet list converted into a table → node-level (type change).
			table(
				tr([th()(p('Step')), th()(p('Action')), th()(p('Owner'))]),
				tr([
					td()(p('1')),
					td()(p('Check the service health dashboard for the affected region.')),
					td()(p('On-call')),
				]),
				tr([
					td()(p('2')),
					td()(p('Roll back the most recent deployment if it correlates with the spike.')),
					td()(p('On-call')),
				]),
				tr([
					td()(p('3')),
					td()(p('Escalate to the on-call lead if error rates do not recover in ten minutes.')),
					td()(p('On-call lead')),
				]),
			),
		) as JSONDocNode,
	},

	// ── C4. Release notes: some sections untouched, one section fully replaced ─────
	// A long document where changes are concentrated in one area — smart should keep
	// the untouched sections quiet and localise the change.
	{
		label: 'C4. Release notes — most sections untouched, one section fully replaced',
		before: doc(
			heading({ level: 2 })(text('Release 2024.5')),
			p('This release focuses on stability and a handful of long-requested improvements.'),
			heading({ level: 3 })(text('Highlights')),
			p(
				'The editor now loads noticeably faster on large pages, and we have fixed a class of intermittent save failures that a small number of customers were hitting.',
			),
			heading({ level: 3 })(text('Known issues')),
			p(
				'Pasting content from certain spreadsheet applications can occasionally drop cell formatting. A fix is planned for the next release.',
			),
			heading({ level: 3 })(text('Upgrade notes')),
			p('No manual steps are required. The upgrade is fully backwards compatible.'),
		) as JSONDocNode,
		after: doc(
			heading({ level: 2 })(text('Release 2024.5')),
			p('This release focuses on stability and a handful of long-requested improvements.'),
			heading({ level: 3 })(text('Highlights')),
			p(
				'The editor now loads noticeably faster on large pages, and we have fixed a class of intermittent save failures that a small number of customers were hitting.',
			),
			// This whole section is replaced with new, unrelated content.
			heading({ level: 3 })(text('Known issues')),
			p(
				'We are tracking a rendering glitch where very wide tables can overflow their container on narrow viewports. A workaround is to enable table scaling in page settings until the fix ships.',
			),
			heading({ level: 3 })(text('Upgrade notes')),
			p('No manual steps are required. The upgrade is fully backwards compatible.'),
		) as JSONDocNode,
	},

	// ── C5. Nested layout: change concentrated in one column, others quiet ─────────
	// A three-column layout where only the middle column changes substantially, while
	// the outer columns are untouched.
	{
		label: 'C5. Layout — one column heavily edited, the other columns untouched',
		before: doc(
			layoutSection()([
				layoutColumn({ width: 33.33 })([
					heading({ level: 4 })(text('Discovery')),
					p('Interviews and desk research to frame the problem and validate demand.'),
				]),
				layoutColumn({ width: 33.33 })([
					heading({ level: 4 })(text('Delivery')),
					p('Build the first version behind a flag and dogfood internally.'),
				]),
				layoutColumn({ width: 33.33 })([
					heading({ level: 4 })(text('Launch')),
					p('Gradual rollout with guardrail metrics and a clear rollback plan.'),
				]),
			]),
		) as JSONDocNode,
		after: doc(
			layoutSection()([
				layoutColumn({ width: 33.33 })([
					heading({ level: 4 })(text('Discovery')),
					p('Interviews and desk research to frame the problem and validate demand.'),
				]),
				// Middle column substantially rewritten and grown by a paragraph.
				layoutColumn({ width: 33.33 })([
					heading({ level: 4 })(text('Delivery')),
					p(
						'Build the first version behind a feature gate and dogfood it with two friendly teams for a fortnight.',
					),
					p(
						'Capture feedback in a shared doc and triage it weekly so nothing gets lost before the wider rollout.',
					),
				]),
				layoutColumn({ width: 33.33 })([
					heading({ level: 4 })(text('Launch')),
					p('Gradual rollout with guardrail metrics and a clear rollback plan.'),
				]),
			]),
		) as JSONDocNode,
	},

	// ── C6. Mixed 5-node replace: update / keep / delete / delete / slight-update ──────
	// paragraph + quote + panel + paragraph + table  →
	// paragraph (updated) + quote (unchanged) + panel (deleted) + paragraph (deleted) +
	// table (slightly updated). Exercises the multi-block alignment path: the two removed
	// middle blocks must each be shown as a single deletion, and NO original block may be
	// struck-through twice (the "deleted twice" bug this scenario was added to guard).
	{
		label: 'C6. Mixed nodes — update, keep, delete, delete, slight update',
		before: doc(
			p('This paragraph introduces the section and will receive a small wording change.'),
			blockQuote(p('An unchanged aside that should stay exactly as it is.')),
			panel({ panelType: PanelType.WARNING })(
				p('A warning panel that will be removed entirely in the new version.'),
			),
			p('A standalone paragraph that will also be deleted in the new version.'),
			table(tr([th()(p('Metric')), th()(p('Value'))]), tr([td()(p('Latency')), td()(p('120ms'))])),
		) as JSONDocNode,
		after: doc(
			// UPDATED: a couple of words changed (sentence stays inline / sentence level).
			p('This paragraph opens the section and will receive a small wording tweak.'),
			// KEPT: identical to before.
			blockQuote(p('An unchanged aside that should stay exactly as it is.')),
			// (panel removed)
			// (standalone paragraph removed)
			// SLIGHTLY UPDATED: one cell value changed.
			table(tr([th()(p('Metric')), th()(p('Value'))]), tr([td()(p('Latency')), td()(p('95ms'))])),
		) as JSONDocNode,
	},

	// ── C7. Heading kept, two paragraphs merged into one, one removed, panel updated ──
	// heading + paragraph + paragraph + panel  →
	// heading (unchanged) + paragraph (updated, merged with the second) + paragraph (deleted)
	// + panel (updated). A simpler companion to C6 focused on paragraph merge + delete.
	{
		label: 'C7. Heading kept, paragraphs merged & removed, panel updated',
		before: doc(
			heading({ level: 3 })(text('Overview')),
			p('The first paragraph describes the current behaviour.'),
			p('The second paragraph adds supporting detail that will be folded in.'),
			panel({ panelType: PanelType.INFO })(
				p('Remember to enable the feature flag before testing.'),
			),
		) as JSONDocNode,
		after: doc(
			// KEPT.
			heading({ level: 3 })(text('Overview')),
			// UPDATED + MERGED: first paragraph now also carries the second's detail.
			p(
				'The first paragraph describes the current behaviour and adds supporting detail that used to live in a second paragraph.',
			),
			// (second paragraph removed)
			// UPDATED: panel wording changed.
			panel({ panelType: PanelType.INFO })(
				p('Remember to enable the feature gate and upgrade before the end of the month.'),
			),
		) as JSONDocNode,
	},

	// ── C8. Kitchen sink: every node type, updated (inline/sentence/whole) + add + remove ──
	// A large, realistic engineering design doc. For each node type there is at least
	// one node that is updated with an INLINE change (a word or two), one updated at
	// the SENTENCE level (a sentence rewritten within a longer node), and one updated
	// at the WHOLE-NODE level (fully rewritten). On top of that, some nodes are ADDED
	// and some are REMOVED. This is the broadest single-scenario stress test.
	{
		label:
			'C8. Kitchen sink — every node type: inline + sentence + whole updates, plus add & remove',
		// This scenario deliberately uses MULTIPLE steps (one per changed region) instead of a
		// single whole-body ReplaceStep — mirroring how a real editing session produces many
		// small steps touching different parts of the document. Steps are declared in the
		// scenario's own coordinate space and applied from the LAST changed block to the FIRST,
		// so earlier replacements never shift the positions of later ones. It also includes an
		// AddMarkStep to demonstrate a non-Replace step type.
		buildSteps: ({ beforeDoc, schema }): Step[] => {
			const steps: Step[] = [];
			const { strong } = schema.marks;

			// Helper to push a top-level-block replace step if it can be built.
			const replaceBlock = (index: number, replacement: PMNode[]) => {
				const step = replaceTopLevelBlock(beforeDoc, index, replacement);
				if (step) {
					steps.push(step);
				}
			};

			// before-doc block indices:
			// 0 H1, 1 H2, 2 para(sentence), 3 para(inline), 4 para(REMOVED), 5 H2,
			// 6 bulletList, 7 table, 8 panel, 9 codeBlock, 10 blockQuote, 11 layoutSection

			// --- Apply from LAST block to FIRST so positions of earlier blocks stay valid. ---

			// 11) Layout: whole rewrite of the "Cons" → "Trade-offs" column.
			replaceBlock(11, [
				schema.nodes.layoutSection.createChecked(null, [
					schema.nodes.layoutColumn.createChecked({ width: 50 }, [
						schema.nodes.heading.createChecked({ level: 4 }, schema.text('Pros')),
						schema.nodes.paragraph.createChecked(
							null,
							schema.text('Faster reads and far less request-time fan-out across products.'),
						),
					]),
					schema.nodes.layoutColumn.createChecked({ width: 50 }, [
						schema.nodes.heading.createChecked({ level: 4 }, schema.text('Trade-offs')),
						schema.nodes.paragraph.createChecked(
							null,
							schema.text(
								'We pay for extra storage and accept a temporary dual-write period, and we need a careful backfill so historical events are not lost or duplicated.',
							),
						),
					]),
				]),
			]);

			// 10) Quote: inline word change + a NEW quote appended right after it.
			replaceBlock(10, [
				schema.nodes.blockquote.createChecked(
					null,
					schema.nodes.paragraph.createChecked(
						null,
						schema.text(
							'The best feed is the one that feels instant. Everything else is secondary.',
						),
					),
				),
				schema.nodes.blockquote.createChecked(
					null,
					schema.nodes.paragraph.createChecked(
						null,
						schema.text('Ship the boring, reliable version first.'),
					),
				),
			]);

			// 9) Code block: whole rewrite.
			replaceBlock(9, [
				schema.nodes.codeBlock.createChecked(
					{ language: 'ts' },
					schema.text(
						'async function readFeed(userId: string) {\n  // single denormalised store — no per-product fan-out\n  return feedStore.read(userId);\n}',
					),
				),
			]);

			// 8) Panel: sentence-level rewrite (second sentence).
			replaceBlock(8, [
				schema.nodes.panel.createChecked(
					{ panelType: PanelType.INFO },
					schema.nodes.paragraph.createChecked(
						null,
						schema.text(
							'Risk: the migration doubles write volume until the old path is retired. We will gate the dual-write phase behind a flag and watch the queue depth with an alert.',
						),
					),
				),
			]);

			// 7) Table: an inline cell change, a sentence cell change, and a NEW row.
			replaceBlock(7, [
				schema.nodes.table.createChecked(null, [
					schema.nodes.tableRow.createChecked(null, [
						schema.nodes.tableHeader.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('Metric')),
						),
						schema.nodes.tableHeader.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('Today')),
						),
						schema.nodes.tableHeader.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('Target')),
						),
					]),
					schema.nodes.tableRow.createChecked(null, [
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('p95 latency')),
						),
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('1200ms')),
						),
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('under 250ms')),
						),
					]),
					schema.nodes.tableRow.createChecked(null, [
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('Read amplification')),
						),
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(
								null,
								schema.text(
									'One read per product on every page load, which scales badly with product count.',
								),
							),
						),
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('One read')),
						),
					]),
					schema.nodes.tableRow.createChecked(null, [
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('Write volume')),
						),
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('1x')),
						),
						schema.nodes.tableCell.createChecked(
							null,
							schema.nodes.paragraph.createChecked(null, schema.text('2x during migration')),
						),
					]),
				]),
			]);

			// 6) List: inline change, a sentence change, a removed item, and a NEW item.
			replaceBlock(6, [
				schema.nodes.bulletList.createChecked(null, [
					schema.nodes.listItem.createChecked(
						null,
						schema.nodes.paragraph.createChecked(
							null,
							schema.text('Introduce a single denormalised activity store.'),
						),
					),
					schema.nodes.listItem.createChecked(
						null,
						schema.nodes.paragraph.createChecked(
							null,
							schema.text(
								'Write events to the store asynchronously through a durable queue so a slow consumer never blocks a producer.',
							),
						),
					),
					schema.nodes.listItem.createChecked(
						null,
						schema.nodes.paragraph.createChecked(
							null,
							schema.text('Keep the old read path behind a flag during migration.'),
						),
					),
					schema.nodes.listItem.createChecked(
						null,
						schema.nodes.paragraph.createChecked(
							null,
							schema.text('Backfill historical events in batches during off-peak hours.'),
						),
					),
				]),
			]);

			// 5) H2 "Proposed change" → "The plan" (whole rewrite).
			replaceBlock(5, [schema.nodes.heading.createChecked({ level: 2 }, schema.text('The plan'))]);

			// 4) Remove the abandoned-approach paragraph entirely (empty replacement).
			replaceBlock(4, []);

			// 3) Paragraph: inline change ("latency" → "slowness").
			replaceBlock(3, [
				schema.nodes.paragraph.createChecked(
					null,
					schema.text(
						'We currently fan out reads to every product on each page load, which is the single biggest contributor to feed slowness.',
					),
				),
			]);

			// 2) Paragraph: sentence-level rewrite (middle sentence) + a NEW paragraph after it.
			replaceBlock(2, [
				schema.nodes.paragraph.createChecked(
					null,
					schema.text(
						'The activity feed aggregates events from every product a user has access to. Today the feed reads from each product store on demand, and the number of stores keeps growing as we add products. This works but is slow when a user belongs to many workspaces.',
					),
				),
				schema.nodes.paragraph.createChecked(
					null,
					schema.text(
						'This document proposes a denormalised store and describes the migration path, the risks, and how we will measure success.',
					),
				),
			]);

			// 1) H2 "Background and current state" → "Why the feed is slow today" + NEW H3 "Scope".
			replaceBlock(1, [
				schema.nodes.heading.createChecked({ level: 2 }, schema.text('Why the feed is slow today')),
				schema.nodes.heading.createChecked({ level: 3 }, schema.text('Scope')),
			]);

			// 0) H1: instead of replacing, demonstrate an AddMarkStep — bold the last word
			//    ("feed") in place. The H1 text is "Design: unified activity feed"; bold "feed".
			if (strong) {
				const h1Range = topLevelBlockRange(beforeDoc, 0);
				if (h1Range) {
					const h1 = beforeDoc.child(0);
					const textLen = h1.textContent.length;
					// content position of the last word "feed" (4 chars) inside the H1.
					const wordStart = h1Range.from + 1 + (textLen - 'feed'.length);
					const wordEnd = h1Range.from + 1 + textLen;
					steps.push(new AddMarkStep(wordStart, wordEnd, strong.create()));
				}
			}

			return steps;
		},
		before: doc(
			// HEADINGS ----------------------------------------------------------------
			heading({ level: 1 })(text('Design: unified activity feed')), // inline update below
			heading({ level: 2 })(text('Background and current state')), // whole rewrite below
			// PARAGRAPHS --------------------------------------------------------------
			p(
				'The activity feed aggregates events from every product a user has access to. Today each product writes to its own store, and the feed reads from all of them at request time. This works but is slow when a user belongs to many workspaces.',
			), // sentence-level update below (one sentence rewritten)
			p(
				'We currently fan out reads to every product on each page load, which is the single biggest contributor to feed latency.',
			), // inline update below (a couple of words)
			p(
				'This paragraph describes an approach we have since abandoned and should be deleted entirely.',
			), // REMOVED below
			// HEADING for a section that will be fully rewritten
			heading({ level: 2 })(text('Proposed change')), // whole rewrite below
			// LIST --------------------------------------------------------------------
			bulletList(
				li([p('Introduce a single denormalised feed store.')]), // inline update below
				li([p('Write events to the store asynchronously as they happen.')]), // sentence update below
				li([p('Keep the old read path behind a flag during migration.')]), // unchanged
				li([p('This item is stale and will be removed.')]), // REMOVED below
			),
			// TABLE -------------------------------------------------------------------
			table(
				tr([th()(p('Metric')), th()(p('Today')), th()(p('Target'))]),
				tr([td()(p('p95 latency')), td()(p('1200ms')), td()(p('under 300ms'))]), // inline (a cell) below
				tr([
					td()(p('Read amplification')),
					td()(p('One read per product on every single page load.')),
					td()(p('One read')),
				]), // sentence (a cell) below
			),
			// PANEL -------------------------------------------------------------------
			panel({ panelType: PanelType.INFO })(
				p(
					'Risk: the migration doubles write volume until the old path is retired. Monitor the write queue closely.',
				),
			), // sentence-level update below
			// CODE BLOCK --------------------------------------------------------------
			codeBlock({ language: 'ts' })(
				text(
					'async function readFeed(userId: string) {\n  const events = await Promise.all(products.map(p => p.read(userId)));\n  return merge(events);\n}',
				),
			), // whole rewrite below
			// QUOTE -------------------------------------------------------------------
			blockQuote(p('The best feed is the one that feels instant. Everything else is negotiable.')), // inline update below
			// LAYOUT ------------------------------------------------------------------
			layoutSection()([
				layoutColumn({ width: 50 })([
					heading({ level: 4 })(text('Pros')),
					p('Faster reads and far less request-time fan-out across products.'),
				]),
				layoutColumn({ width: 50 })([
					heading({ level: 4 })(text('Cons')),
					p('Extra storage and a migration period with dual writes.'),
				]),
			]), // whole-column rewrite below (one column)
		) as JSONDocNode,
		after: doc(
			// HEADINGS ----------------------------------------------------------------
			// H1 keeps its text but the last word "feed" is bolded via an AddMarkStep.
			heading({ level: 1 })(text('Design: unified activity '), strong('feed')),
			// Whole rewrite of the H2:
			heading({ level: 2 })(text('Why the feed is slow today')),
			// NEW heading added:
			heading({ level: 3 })(text('Scope')),
			// PARAGRAPHS --------------------------------------------------------------
			// Sentence-level update: the middle sentence is rewritten, the rest kept.
			p(
				'The activity feed aggregates events from every product a user has access to. Today the feed reads from each product store on demand, and the number of stores keeps growing as we add products. This works but is slow when a user belongs to many workspaces.',
			),
			// Inline update: a couple of words changed.
			p(
				'We currently fan out reads to every product on each page load, which is the single biggest contributor to feed slowness.',
			),
			// (the abandoned-approach paragraph is REMOVED)
			// NEW paragraph added:
			p(
				'This document proposes a denormalised store and describes the migration path, the risks, and how we will measure success.',
			),
			// Whole rewrite of this H2:
			heading({ level: 2 })(text('The plan')),
			// LIST --------------------------------------------------------------------
			bulletList(
				li([p('Introduce a single denormalised activity store.')]), // "feed" → "activity" (inline)
				// Sentence update within the item:
				li([
					p(
						'Write events to the store asynchronously through a durable queue so a slow consumer never blocks a producer.',
					),
				]),
				li([p('Keep the old read path behind a flag during migration.')]), // unchanged
				// (stale item REMOVED)
				// NEW list item added:
				li([p('Backfill historical events in batches during off-peak hours.')]),
			),
			// TABLE -------------------------------------------------------------------
			table(
				tr([th()(p('Metric')), th()(p('Today')), th()(p('Target'))]),
				tr([td()(p('p95 latency')), td()(p('1200ms')), td()(p('under 250ms'))]), // inline cell change
				// Sentence-level cell change:
				tr([
					td()(p('Read amplification')),
					td()(
						p('One read per product on every page load, which scales badly with product count.'),
					),
					td()(p('One read')),
				]),
				// NEW row added:
				tr([td()(p('Write volume')), td()(p('1x')), td()(p('2x during migration'))]),
			),
			// PANEL -------------------------------------------------------------------
			// Sentence-level update: second sentence rewritten.
			panel({ panelType: PanelType.INFO })(
				p(
					'Risk: the migration doubles write volume until the old path is retired. We will gate the dual-write phase behind a flag and watch the queue depth with an alert.',
				),
			),
			// CODE BLOCK --------------------------------------------------------------
			// Whole rewrite of the snippet.
			codeBlock({ language: 'ts' })(
				text(
					'async function readFeed(userId: string) {\n  // single denormalised store — no per-product fan-out\n  return feedStore.read(userId);\n}',
				),
			),
			// QUOTE -------------------------------------------------------------------
			// Inline update: one word.
			blockQuote(p('The best feed is the one that feels instant. Everything else is secondary.')),
			// NEW quote added:
			blockQuote(p('Ship the boring, reliable version first.')),
			// LAYOUT ------------------------------------------------------------------
			layoutSection()([
				layoutColumn({ width: 50 })([
					heading({ level: 4 })(text('Pros')),
					p('Faster reads and far less request-time fan-out across products.'),
				]),
				// Whole rewrite of the "Cons" column.
				layoutColumn({ width: 50 })([
					heading({ level: 4 })(text('Trade-offs')),
					p(
						'We pay for extra storage and accept a temporary dual-write period, and we need a careful backfill so historical events are not lost or duplicated.',
					),
				]),
			]),
		) as JSONDocNode,
	},
];

// Debug helper: if any scenario is marked `only: true`, render ONLY those (like Jest's
// `.only`); otherwise render the full gallery.
const activeScenarios: Scenario[] = scenarios.some((s) => s.only)
	? scenarios.filter((s) => s.only)
	: scenarios;

// The "kitchen sink" scenario (C6) is heavy and multi-step, so it is rendered in its OWN
// editor rather than being merged with the rest. Everything else is merged into a single
// editor for performance. When an `only` filter is active, we keep the same rule: the last
// active scenario goes to its own editor, the rest are merged. If only one scenario is
// active, it is merged (nothing goes to the separate editor).
const hasOnly = scenarios.some((s) => s.only);

/**
 * Splits a list of visible scenarios into the ones that get merged into a single editor and
 * the (optional) heavy "kitchen sink" scenario that is rendered in its own editor. Mirrors
 * the previous module-level rule, but computed per visible-set so scenarios can be toggled on
 * and off at runtime:
 *   - if an `only` debug filter is active, nothing is split out (all visible are merged);
 *   - otherwise, when more than one scenario is visible, the LAST one is rendered separately.
 */
function splitScenarios(visible: Scenario[]): {
	kitchenSinkScenario: Scenario | undefined;
	mergedScenarios: Scenario[];
} {
	const kitchenSinkScenario =
		!hasOnly && visible.length > 1 ? visible[visible.length - 1] : undefined;
	const mergedScenarios = kitchenSinkScenario ? visible.slice(0, -1) : visible;
	return { kitchenSinkScenario, mergedScenarios };
}

/**
 * Returns the [from, to) range of the top-level child at `index` within `doc` (in that
 * doc's own coordinate space), or null if the index is out of range.
 */
function topLevelBlockRange(doc: PMNode, index: number): { from: number; to: number } | null {
	if (index < 0 || index >= doc.childCount) {
		return null;
	}
	let from = 0;
	for (let i = 0; i < index; i++) {
		from += doc.child(i).nodeSize;
	}
	return { from, to: from + doc.child(index).nodeSize };
}

/**
 * Builds a ReplaceStep (in the given doc's coordinate space) that replaces the top-level
 * block at `index` with the provided replacement blocks. Returns null if the index is out
 * of range.
 */
function replaceTopLevelBlock(doc: PMNode, index: number, replacement: PMNode[]): Step | null {
	const range = topLevelBlockRange(doc, index);
	if (!range) {
		return null;
	}
	const slice = new Slice(Fragment.fromArray(replacement), 0, 0);
	return new ReplaceStep(range.from, range.to, slice);
}

/**
 * Merges every scenario into a single BEFORE document and a single AFTER document, and
 * derives steps per scenario. By default each scenario contributes a single whole-body
 * ReplaceStep; scenarios may instead declare their own step sequence via `buildSteps`.
 *
 * Layout of the merged document, per scenario, in order:
 *   [unchanged heading label]  [scenario.before blocks | scenario.after blocks]
 *
 * The heading label is identical in both docs, so it stays unchanged and acts as an anchor
 * separating scenarios.
 */
function buildMergedDocsAndSteps(
	schema: PMSchema,
	list: Scenario[],
): {
	finalDoc: PMNode;
	originalDoc: PMNode;
	steps: Step[];
} {
	const beforeBlocks: PMNode[] = [];
	const afterBlocks: PMNode[] = [];
	// Records, per scenario, how many top-level blocks it contributes to each side, plus the
	// scenario itself (so we can call its optional buildSteps) and its resolved before doc.
	const plan: {
		afterCount: number;
		anchorCount: number;
		beforeCount: number;
		beforeDoc: PMNode;
		scenario: Scenario;
	}[] = [];

	list.forEach((scenario, index) => {
		const beforeDoc = processRawValue(schema, scenario.before);
		const afterDoc = processRawValue(schema, scenario.after);
		if (!beforeDoc || !afterDoc) {
			return;
		}

		const scenarioBefore: PMNode[] = [];
		const scenarioAfter: PMNode[] = [];
		beforeDoc.content.forEach((node) => scenarioBefore.push(node));
		afterDoc.content.forEach((node) => scenarioAfter.push(node));

		// Anchors placed before each scenario's content. They are identical on both sides, so
		// they stay unchanged (keeping scenario coordinates aligned) and are NOT part of any
		// step:
		//   - a horizontal rule separator (skipped for the first scenario), and
		//   - a heading with the scenario label.
		const label = `${index + 1}. ${scenario.label}`;
		const headingNode = schema.nodes.heading.createChecked({ level: 4 }, schema.text(label));
		const anchors: PMNode[] =
			index === 0 ? [headingNode] : [schema.nodes.rule.createChecked(), headingNode];
		beforeBlocks.push(...anchors, ...scenarioBefore);
		afterBlocks.push(...anchors, ...scenarioAfter);
		plan.push({
			anchorCount: anchors.length,
			beforeCount: scenarioBefore.length,
			afterCount: scenarioAfter.length,
			beforeDoc,
			scenario,
		});
	});

	const originalDoc = schema.nodes.doc.createChecked(null, beforeBlocks);

	// Apply each scenario's steps against a running working doc, tracking a running position
	// delta as earlier steps change the document size.
	const steps: Step[] = [];
	let workingDoc = originalDoc;
	// Accumulates the position map of every applied step so later steps (in any scenario, and
	// in any authoring order) are placed against the current working doc rather than a stale
	// scalar offset.
	const mapping = new Mapping();

	// Walk the ORIGINAL doc block-by-block to find each scenario's before-block range.
	let originalPos = 0; // running position at the start of the current top-level block
	let afterIdx = 0; // index into afterBlocks
	const originalChildren: PMNode[] = [];
	originalDoc.content.forEach((node) => originalChildren.push(node));
	let originalIdx = 0;

	for (const { anchorCount, beforeCount, afterCount, beforeDoc, scenario } of plan) {
		// Skip the unchanged anchor nodes on both sides (rule separator + label heading). They
		// are anchors, not part of the step.
		let anchorAborted = false;
		for (let i = 0; i < anchorCount; i++) {
			const anchorNode = originalChildren[originalIdx];
			if (!anchorNode) {
				anchorAborted = true;
				break;
			}
			originalPos += anchorNode.nodeSize;
			originalIdx += 1;
			afterIdx += 1;
		}
		if (anchorAborted) {
			break;
		}

		// Compute the before-range (in original coords) covering this scenario's before blocks.
		const from = originalPos;
		let to = originalPos;
		for (let i = 0; i < beforeCount; i++) {
			const node = originalChildren[originalIdx + i];
			if (node) {
				to += node.nodeSize;
			}
		}
		originalPos = to;
		originalIdx += beforeCount;

		// The scenario's content begins at `from` in the ORIGINAL doc. `buildSteps` expresses
		// positions in the scenario's own coordinate space, where a top-level block boundary is
		// an OUTER position and the first block starts at 0 (see `topLevelBlockRange`, which
		// returns `from = 0` for block 0). Since `from` here is likewise the OUTER position just
		// before the scenario's first block in the merged doc, a scenario-local position P maps
		// to `from + P` — no -1 offset. We express this shift with StepMap.offset and also add
		// the running posDelta from earlier steps changing the doc size.
		const localToMergedOffset = from;

		if (scenario.buildSteps) {
			// The scenario declares its own steps against its ORIGINAL before doc (all in the
			// same coordinate space). Two mappings are needed to place each step correctly:
			//   1) StepMap.offset(localToMergedOffset) shifts scenario-local → merged-base coords.
			//   2) the running `mapping` re-maps through every step already applied (from any
			//      scenario, including earlier steps of THIS scenario), so positions stay valid
			//      regardless of authoring order (e.g. last-block-to-first).
			const localSteps = scenario.buildSteps({ beforeDoc, schema });
			for (const localStep of localSteps) {
				// First into merged-base coords (as if no steps had been applied yet).
				const base = localStep.map(StepMap.offset(localToMergedOffset));
				if (!base) {
					continue;
				}
				// Then through everything already applied.
				const mapped = base.map(mapping);
				if (!mapped) {
					continue;
				}
				const result = mapped.apply(workingDoc);
				if (result.failed || !result.doc) {
					// eslint-disable-next-line no-console
					console.warn(`Skipping step in scenario "${scenario.label}":`, result.failed);
					continue;
				}
				steps.push(mapped);
				mapping.appendMap(mapped.getMap());
				workingDoc = result.doc;
			}
			continue;
		}

		// Default: a single whole-body ReplaceStep swapping this scenario's before blocks for
		// its after blocks.
		const afterFragment: PMNode[] = [];
		for (let i = 0; i < afterCount; i++) {
			const node = afterBlocks[afterIdx + i];
			if (node) {
				afterFragment.push(node);
			}
		}
		afterIdx += afterCount;

		const slice = new Slice(Fragment.fromArray(afterFragment), 0, 0);
		// Build the step in ORIGINAL/base coords, then map it through everything applied so far.
		const baseStep = new ReplaceStep(from, to, slice);
		const step = baseStep.map(mapping);
		if (!step) {
			continue;
		}
		const result = step.apply(workingDoc);
		if (result.failed || !result.doc) {
			// eslint-disable-next-line no-console
			console.warn('Skipping scenario step:', result.failed);
			continue;
		}
		steps.push(step);
		mapping.appendMap(step.getMap());
		workingDoc = result.doc;
	}

	// `workingDoc` is the original doc with every step applied — i.e. the correct final doc.
	// Using it (rather than a separately-authored after doc) guarantees the rendered content
	// always matches what the steps actually produced.
	return { finalDoc: workingDoc, originalDoc, steps };
}

/**
 * Builds a merged document as raw ADF JSON (no schema needed) from the given side. Mirrors
 * the block layout used by buildMergedDocsAndSteps: an unchanged heading label followed by
 * each scenario's blocks for that side.
 */
function buildMergedJson(side: 'before' | 'after', list: Scenario[]): JSONDocNode {
	const content: JSONDocNode['content'] = [];
	list.forEach((scenario, index) => {
		// Anchors mirror buildMergedDocsAndSteps so both sides stay coordinate-aligned: a rule
		// separator (none before the first) followed by the scenario label heading.
		if (index > 0) {
			content.push({ type: 'rule' } as unknown as JSONDocNode['content'][number]);
		}
		content.push({
			type: 'heading',
			attrs: { level: 4 },
			content: [{ type: 'text', text: `${index + 1}. ${scenario.label}` }],
		} as unknown as JSONDocNode['content'][number]);
		(scenario[side].content ?? []).forEach((node) => content.push(node));
	});
	return { version: 1, type: 'doc', content } as JSONDocNode;
}

// Minimal empty doc used as the initial `originalDoc` for the kitchen-sink editor before its
// real diff is applied.
const emptyDocJson = { version: 1, type: 'doc', content: [] } as unknown as JSONDocNode;

/**
 * Builds the before doc, derived steps, and resulting final doc for a SINGLE scenario in its
 * own coordinate space (no merging). Mirrors the per-scenario logic inside
 * buildMergedDocsAndSteps: a scenario-declared `buildSteps` sequence if present, otherwise a
 * single whole-body ReplaceStep swapping before content for after content.
 */
function buildSingleScenarioDocsAndSteps(
	schema: PMSchema,
	scenario: Scenario,
): { finalDoc: PMNode; originalDoc: PMNode; steps: Step[] } | null {
	const originalDoc = processRawValue(schema, scenario.before);
	const afterDoc = processRawValue(schema, scenario.after);
	if (!originalDoc || !afterDoc) {
		return null;
	}

	const steps: Step[] = [];
	let workingDoc = originalDoc;
	const mapping = new Mapping();

	const applyStep = (step: Step): void => {
		const mapped = step.map(mapping);
		if (!mapped) {
			return;
		}
		const result = mapped.apply(workingDoc);
		if (result.failed || !result.doc) {
			// eslint-disable-next-line no-console
			console.warn(`Skipping step in scenario "${scenario.label}":`, result.failed);
			return;
		}
		steps.push(mapped);
		mapping.appendMap(mapped.getMap());
		workingDoc = result.doc;
	};

	if (scenario.buildSteps) {
		for (const localStep of scenario.buildSteps({ beforeDoc: originalDoc, schema })) {
			applyStep(localStep);
		}
	} else {
		const afterFragment: PMNode[] = [];
		afterDoc.content.forEach((node) => afterFragment.push(node));
		const slice = new Slice(Fragment.fromArray(afterFragment), 0, 0);
		applyStep(new ReplaceStep(0, originalDoc.content.size, slice));
	}

	return { finalDoc: workingDoc, originalDoc, steps };
}

/**
 * Renders the heavy "kitchen sink" scenario (C6) in its OWN chromeless editor, kept separate
 * from the merged gallery editor for performance. Shares the panel-level diff settings.
 */
function KitchenSinkEditor({
	colorScheme,
	hideDeletedDiffs,
	hideAddedDiffsUnderline,
	showIndicators,
	diffType,
	deletedDiffPlacement,
	inlineDeletedDiffPlacement,
	scenario,
	labelIndex,
}: {
	colorScheme: ColorScheme;
	deletedDiffPlacement: DeletedDiffPlacement;
	diffType: DiffType;
	/** When true, hides the purple underline on added/updated diff content (extended/smart only). */
	hideAddedDiffsUnderline: boolean;
	hideDeletedDiffs: boolean;
	inlineDeletedDiffPlacement: InlineDeletedDiffPlacement;
	/** 1-based index of this scenario's label in the full visible gallery. */
	labelIndex: number;
	scenario: Scenario;
	showIndicators: boolean;
}): React.JSX.Element | null {
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
				.add(panelPlugin)
				.add(rulePlugin)
				.add(tasksAndDecisionsPlugin)
				.add([expandPlugin, { allowInsertion: true }])
				.add(editorDisabledPlugin)
				.add(copyButtonPlugin)
				.add(compositionPlugin)
				.add(codeBlockPlugin)
				.add(blockControlsPlugin)
				.add(breakoutPlugin)
				.add(gridPlugin)
				.add(floatingToolbarPlugin)
				.add([editorViewModePlugin, { mode: 'view' }])
				.add([showDiffPlugin, { colorScheme, steps: [], originalDoc: emptyDocJson }]),
		[colorScheme],
	);

	useEffect(() => {
		if (!editorApi) {
			return;
		}
		const state = editorApi.core.sharedState.currentState();
		if (!state?.schema) {
			return;
		}
		const built = buildSingleScenarioDocsAndSteps(state.schema, scenario);
		if (!built) {
			return;
		}
		const { originalDoc, steps, finalDoc } = built;

		editorApi.core.actions.execute(({ tr }) => {
			tr.replaceWith(0, tr.doc.content.size, finalDoc.content);
			tr.setMeta('addToHistory', false);
			return tr;
		});

		editorApi.core.actions.execute(
			editorApi.showDiff.commands.showDiff({
				steps,
				originalDoc,
				hideDeletedDiffs,
				hideAddedDiffsUnderline,
				showIndicators,
				diffType,
				smartThresholds,
				deletedDiffPlacement,
				inlineDeletedDiffPlacement,
			}),
		);
	}, [
		editorApi,
		hideDeletedDiffs,
		hideAddedDiffsUnderline,
		showIndicators,
		diffType,
		deletedDiffPlacement,
		inlineDeletedDiffPlacement,
		scenario,
	]);

	return (
		<div css={styles.scenario}>
			<Text as="p" weight="bold">
				{labelIndex}. {scenario.label} (separate editor)
			</Text>
			<ComposableEditor appearance="chromeless" preset={preset} />
		</div>
	);
}

/**
 * A single, self-contained diff panel: its own editor plus its own controls for diff type,
 * colour scheme, and deleted-diff visibility. Multiple panels can be rendered side by side
 * to compare how different diff types render the exact same change set.
 */
function DiffPanel({
	initialDiffType,
	visibleScenarios,
}: {
	initialDiffType: DiffType;
	visibleScenarios: Scenario[];
}): React.JSX.Element {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('standard');
	const [hideDeletedDiffs, setHideDeletedDiffs] = useState(false);
	const [hideAddedDiffsUnderline, setHideAddedDiffsUnderline] = useState(false);
	const [showIndicators, setShowIndicators] = useState(false);
	const [diffType, setDiffType] = useState<DiffType>(initialDiffType);
	const [deletedDiffPlacement, setDeletedDiffPlacement] = useState<DeletedDiffPlacement>('top');
	const [inlineDeletedDiffPlacement, setInlineDeletedDiffPlacement] =
		useState<InlineDeletedDiffPlacement>('before');

	// Split the visible scenarios into the merged set and the optional separate kitchen-sink
	// scenario, and derive the merged BEFORE/AFTER JSON. Recomputed whenever the visible set
	// changes (via the show/hide scenarios control).
	const { mergedScenarios, kitchenSinkScenario } = useMemo(
		() => splitScenarios(visibleScenarios),
		[visibleScenarios],
	);
	const mergedBeforeJson = useMemo(
		() => buildMergedJson('before', mergedScenarios),
		[mergedScenarios],
	);
	const mergedAfterJson = useMemo(
		() => buildMergedJson('after', mergedScenarios),
		[mergedScenarios],
	);
	// A key that changes when the merged content changes, so the editor remounts with the new
	// `defaultValue` (the effect below then re-derives and re-shows the diff).
	const mergedKey = useMemo(() => mergedScenarios.map((s) => s.label).join('|'), [mergedScenarios]);

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
				.add(panelPlugin)
				.add(rulePlugin)
				.add(tasksAndDecisionsPlugin)
				.add([expandPlugin, { allowInsertion: true }])
				.add(editorDisabledPlugin)
				.add(copyButtonPlugin)
				.add(compositionPlugin)
				.add(codeBlockPlugin)
				.add(blockControlsPlugin)
				.add(breakoutPlugin)
				.add(gridPlugin)
				.add(floatingToolbarPlugin)
				.add([editorViewModePlugin, { mode: 'view' }])
				.add([showDiffPlugin, { colorScheme, steps: [], originalDoc: mergedBeforeJson }]),
		[colorScheme],
	);

	const { numberOfChanges } = useSharedPluginStateWithSelector(
		editorApi,
		['showDiff'],
		({ showDiffState }) => ({ numberOfChanges: showDiffState?.numberOfChanges ?? 0 }),
	);

	useEffect(() => {
		if (!editorApi) {
			return;
		}
		const state = editorApi.core.sharedState.currentState();
		if (!state?.schema) {
			return;
		}
		if (mergedScenarios.length === 0) {
			// Nothing merged is visible; clear the editor so no stale diff remains.
			editorApi.core.actions.execute(({ tr }) => {
				tr.replaceWith(0, tr.doc.content.size, Fragment.empty);
				tr.setMeta('addToHistory', false);
				return tr;
			});
			return;
		}
		const { originalDoc, steps, finalDoc } = buildMergedDocsAndSteps(state.schema, mergedScenarios);

		// The diff engine reconstructs the "after" doc by applying `steps` to `originalDoc` and
		// then requires it to match the editor's CURRENT doc; if they differ it renders nothing.
		// Rather than hand-authoring an `after` doc that must byte-match the steps, we make the
		// editor's content BE the steps-applied doc (`finalDoc`). This guarantees they always
		// agree, for both the default whole-body ReplaceStep and multi-step `buildSteps`
		// scenarios. Replace the whole document with `finalDoc` before showing the diff.
		editorApi.core.actions.execute(({ tr }) => {
			tr.replaceWith(0, tr.doc.content.size, finalDoc.content);
			tr.setMeta('addToHistory', false);
			return tr;
		});

		editorApi.core.actions.execute(
			editorApi.showDiff.commands.showDiff({
				steps,
				originalDoc,
				hideDeletedDiffs,
				hideAddedDiffsUnderline,
				showIndicators,
				diffType,
				smartThresholds,
				deletedDiffPlacement,
				inlineDeletedDiffPlacement,
			}),
		);
	}, [
		editorApi,
		hideDeletedDiffs,
		hideAddedDiffsUnderline,
		showIndicators,
		diffType,
		deletedDiffPlacement,
		inlineDeletedDiffPlacement,
		mergedScenarios,
	]);

	return (
		<div css={styles.panel}>
			<div css={styles.panelControls}>
				<Button
					onClick={() => {
						const nextIndex = (diffTypes.indexOf(diffType) + 1) % diffTypes.length;
						setDiffType(diffTypes[nextIndex] ?? 'smart');
					}}
				>
					Type: {diffType}
				</Button>
				<Button
					onClick={() => setColorScheme(colorScheme === 'traditional' ? 'standard' : 'traditional')}
				>
					Colour: {colorScheme}
				</Button>
				<Button onClick={() => setHideDeletedDiffs((prev) => !prev)}>
					Deleted: {hideDeletedDiffs ? 'hidden' : 'visible'}
				</Button>
				<Button onClick={() => setHideAddedDiffsUnderline((prev) => !prev)}>
					Added underline: {hideAddedDiffsUnderline ? 'hidden' : 'shown'}
				</Button>
				<Button onClick={() => setShowIndicators((prev) => !prev)}>
					Indicators: {showIndicators ? 'shown' : 'hidden'}
				</Button>
				<Button
					onClick={() => setDeletedDiffPlacement((prev) => (prev === 'top' ? 'bottom' : 'top'))}
				>
					Deleted placement: {deletedDiffPlacement}
				</Button>
				<Button
					onClick={() =>
						setInlineDeletedDiffPlacement((prev) => (prev === 'before' ? 'after' : 'before'))
					}
				>
					Inline deleted placement: {inlineDeletedDiffPlacement}
				</Button>
				<Text color="color.text.subtle">
					{numberOfChanges > 0 ? `${numberOfChanges} change(s)` : 'No changes'}
				</Text>
			</div>

			<ComposableEditor
				key={mergedKey}
				appearance="comment"
				defaultValue={mergedAfterJson}
				preset={preset}
			/>

			{kitchenSinkScenario ? (
				<KitchenSinkEditor
					colorScheme={colorScheme}
					hideDeletedDiffs={hideDeletedDiffs}
					hideAddedDiffsUnderline={hideAddedDiffsUnderline}
					showIndicators={showIndicators}
					diffType={diffType}
					deletedDiffPlacement={deletedDiffPlacement}
					inlineDeletedDiffPlacement={inlineDeletedDiffPlacement}
					scenario={kitchenSinkScenario}
					labelIndex={mergedScenarios.length + 1}
				/>
			) : null}
		</div>
	);
}

/**
 * Smart-diff thresholds gallery. Merges all predefined scenarios into one document and
 * renders the diff in a diff panel. A "Compare" toggle opens a second panel side by side so
 * you can compare two diff types against the exact same change set — each panel has its own
 * diff type, colour scheme, and deleted-diff visibility controls.
 */
export default function Editor(): React.JSX.Element {
	const [compare, setCompare] = useState(false);
	// Which scenarios are visible, keyed by label. All visible by default.
	const [visibleLabels, setVisibleLabels] = useState<Set<string>>(
		() => new Set(activeScenarios.map((s) => s.label)),
	);

	const visibleScenarios = useMemo(
		() => activeScenarios.filter((s) => visibleLabels.has(s.label)),
		[visibleLabels],
	);
	const allVisible = visibleLabels.size === activeScenarios.length;

	const toggleLabel = (label: string): void => {
		setVisibleLabels((prev) => {
			const next = new Set(prev);
			if (next.has(label)) {
				next.delete(label);
			} else {
				next.add(label);
			}
			return next;
		});
	};

	const toggleAll = (): void => {
		setVisibleLabels(allVisible ? new Set() : new Set(activeScenarios.map((s) => s.label)));
	};

	return (
		<div css={styles.page}>
			<Text as="p" size="large" weight="bold">
				Smart Diff — thresholds gallery (single merged document)
			</Text>
			<Text as="p" color="color.text.subtle">
				All scenarios except the last are merged into one editor (each with an unchanged heading
				anchor and its own ReplaceStep). The heavy multi-step "kitchen sink" scenario is rendered in
				its own separate editor below, for performance. Use each panel's controls to switch diff
				type, colour scheme, deleted-diff visibility, deleted placement, and indicators. Click
				Compare to open a second panel side by side. Use "Scenarios" to show/hide individual
				scenarios.
			</Text>

			<div css={styles.controls}>
				<Button appearance="primary" onClick={() => setCompare((prev) => !prev)}>
					{compare ? 'Close compare' : 'Compare'}
				</Button>
				<DropdownMenu<HTMLButtonElement>
					shouldRenderToParent
					trigger={`Scenarios (${visibleScenarios.length}/${activeScenarios.length})`}
				>
					<DropdownItemCheckboxGroup id="scenario-visibility" title="Show / hide scenarios">
						<DropdownItemCheckbox id="__all__" isSelected={allVisible} onClick={toggleAll}>
							{allVisible ? 'Hide all' : 'Show all'}
						</DropdownItemCheckbox>
						{activeScenarios.map((s, index) => (
							<DropdownItemCheckbox
								key={s.label}
								id={s.label}
								isSelected={visibleLabels.has(s.label)}
								onClick={() => toggleLabel(s.label)}
							>
								{index + 1}. {s.label}
							</DropdownItemCheckbox>
						))}
					</DropdownItemCheckboxGroup>
				</DropdownMenu>
				<Text color="color.text.subtle">
					{compare
						? 'Comparing two diff types side by side — each panel is independent.'
						: 'Single panel. Click Compare to add a second panel.'}
				</Text>
			</div>

			<div css={styles.panelRow}>
				<DiffPanel initialDiffType="smart" visibleScenarios={visibleScenarios} />
				{compare ? (
					<DiffPanel initialDiffType="inline" visibleScenarios={visibleScenarios} />
				) : null}
			</div>
		</div>
	);
}
