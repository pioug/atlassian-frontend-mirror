/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/default/button';
import type { EditorActions } from '@atlaskit/editor-core';
import { getLimitedModeThresholds } from '@atlaskit/editor-common/limited-mode-document-thresholds';
import { shouldEnableLimitedModeForDocument } from '@atlaskit/editor-common/should-enable-limited-mode';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import { PresetContextProvider } from '../src/presets/context';

import FullPageExample, { type EditorAPI } from './5-full-page';

/**
 * Full-page Confluence limited-mode lab. Combines:
 * - a free ON/OFF toggle for the limited-mode plugin (registers/unregisters it; the current
 *   document is preserved across the remount),
 * - a live view of the current document (the actual latched plugin state, the thresholds in force,
 *   and where the document sits against them),
 * - sample documents that land in specific limited-mode states,
 * - an automated INP benchmark that types into a series of escalating documents with limited mode
 *   off vs on and reports the per-fixture improvement plus an overall summary.
 *
 * Dev/measurement tool: INP numbers are device-dependent, so read the shape (where typing degrades,
 * how much limited mode helps) rather than the absolutes, and compare runs on the same machine.
 */

// ─── ADF builders ────────────────────────────────────────────────────────────

const p = (text: string) => ({ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] });
const doc = (content: object[]) => ({ type: 'doc', version: 1, content });
const cell = (content: object[]) => ({ type: 'tableCell', attrs: {}, content });

const table = (
	rows: number,
	cols: number,
	cellContent: (r: number, c: number) => object[] = (r, c) => [p(`r${r}c${c}`)],
) => ({
	type: 'table',
	attrs: { isNumberColumnEnabled: false, layout: 'default' },
	content: Array.from({ length: rows }, (_r, r) => ({
		type: 'tableRow',
		content: Array.from({ length: cols }, (_c, c) => cell(cellContent(r, c))),
	})),
});

const headingNode = (text: string) => ({
	type: 'heading',
	attrs: { level: 1 },
	content: [{ type: 'text', text }],
});

const nestedExpand = (title: string, content: object[]) => ({
	type: 'nestedExpand',
	attrs: { title },
	content,
});

// `nestedExpand` is only valid inside a table cell (not directly in a layout column), so wrap it in
// a 1×1 table. This keeps the layout + nestedExpand compounding combo the "Nested layouts" series
// is meant to exercise, and renders correctly instead of falling back to "unsupported content".
const nestedExpandInCell = (title: string) => ({
	type: 'table',
	attrs: { isNumberColumnEnabled: false, layout: 'default' },
	content: [{ type: 'tableRow', content: [cell([nestedExpand(title, [p('body')])])] }],
});

const layoutSection = (columns: object[][]) => ({
	type: 'layoutSection',
	content: columns.map((content) => ({
		type: 'layoutColumn',
		attrs: { width: Math.round(100 / columns.length) },
		content,
	})),
});

// A trailing empty paragraph guarantees a valid text-insertion point for the benchmark's typing loop.
const withTypingTarget = (content: object[]) => doc([...content, p('')]);

// ─── Sample documents (manual) ─────────────────────────────────────────────────

type Sample = { adf: object; description: string; label: string };

// Each sample isolates one axis of the limited-mode decision — lots of text but almost no nodes,
// lots of nodes but little text, and a legacy-content macro — so you can see which threshold a given
// document actually lands against.
const SAMPLES: Sample[] = [
	{
		label: 'Plain page',
		description: 'Small text-only document — well below every threshold.',
		adf: doc([p('A small, plain page.'), p('')]),
	},
	{
		label: 'Long text (~500k)',
		description:
			'One paragraph of ~500k characters — only 2 nodes. Isolates nodeSize: heavy by character count, trivial by structure.',
		adf: doc([p('a'.repeat(500000))]),
	},
	{
		label: 'Enormous text (~1.5M)',
		description: 'One paragraph of ~1.5M characters — pushes nodeSize far past any threshold.',
		adf: doc([p('a'.repeat(1500000))]),
	},
	{
		label: '1.5k paragraphs (~3k nodes)',
		description:
			'1,500 short paragraphs ≈ 3,000 nodes on a small nodeSize. Isolates node count: heavy by structure, light by character count.',
		adf: doc(Array.from({ length: 1500 }, (_v, i) => p(`P${i}`))),
	},
	{
		label: 'Large table (600×5)',
		description: '600-row table ≈ 9,600 nodes — a realistic high-node-count document.',
		adf: doc([table(600, 5)]),
	},
	{
		label: 'Legacy macro',
		description:
			'Contains a legacy-content macro — forces limited mode ON regardless of size or node count.',
		adf: doc([
			p('This page embeds a legacy macro.'),
			{
				type: 'extension',
				attrs: {
					extensionType: 'com.atlassian.confluence.macro.core',
					extensionKey: 'legacy-content',
					parameters: {},
					layout: 'default',
				},
			},
		]),
	},
];

// ─── Benchmark fixtures (escalating complexity) ──────────────────────────────

type Fixture = { adf: object; label: string; series: string };

const paragraphs = (n: number) => Array.from({ length: n }, (_v, i) => p(`P${i}`));
const headings = (n: number) => Array.from({ length: n }, (_v, i) => headingNode(`H${i}`));

const layoutsWithExpands = (n: number) =>
	Array.from({ length: n }, (_v, i) =>
		layoutSection([[nestedExpandInCell(`L${i}`)], [nestedExpandInCell(`R${i}`)]]),
	);

const FIXTURES: Fixture[] = [
	// Pure text — nodeSize climbs steeply, node count does not.
	{ series: 'Text length', label: 'text 10k', adf: withTypingTarget([p('a'.repeat(10000))]) },
	{ series: 'Text length', label: 'text 200k', adf: withTypingTarget([p('a'.repeat(200000))]) },
	{ series: 'Text length', label: 'text 1.6M', adf: withTypingTarget([p('a'.repeat(1600000))]) },
	{ series: 'Text length', label: 'text 5M', adf: withTypingTarget([p('a'.repeat(5000000))]) },

	// Node count — many small paragraphs.
	{ series: 'Node count', label: '250 paras', adf: withTypingTarget(paragraphs(250)) },
	{ series: 'Node count', label: '1k paras', adf: withTypingTarget(paragraphs(1000)) },
	{ series: 'Node count', label: '2.5k paras', adf: withTypingTarget(paragraphs(2500)) },
	{ series: 'Node count', label: '5k paras', adf: withTypingTarget(paragraphs(5000)) },

	// Headings
	{ series: 'Headings', label: '250 head', adf: withTypingTarget(headings(250)) },
	{ series: 'Headings', label: '1k head', adf: withTypingTarget(headings(1000)) },
	{ series: 'Headings', label: '2.4k head', adf: withTypingTarget(headings(2400)) },
	{ series: 'Headings', label: '5k head', adf: withTypingTarget(headings(5000)) },

	// Tables — cell count is the structural driver.
	{ series: 'Table cells', label: '60×5 (300)', adf: withTypingTarget([table(60, 5)]) },
	{ series: 'Table cells', label: '240×5 (1200)', adf: withTypingTarget([table(240, 5)]) },
	{ series: 'Table cells', label: '480×5 (2400)', adf: withTypingTarget([table(480, 5)]) },
	{ series: 'Table cells', label: '1000×5 (5k)', adf: withTypingTarget([table(1000, 5)]) },

	// Nested containers — the compounding case.
	{ series: 'Nested layouts', label: '40 layouts', adf: withTypingTarget(layoutsWithExpands(40)) },
	{
		series: 'Nested layouts',
		label: '100 layouts',
		adf: withTypingTarget(layoutsWithExpands(100)),
	},
	{
		series: 'Nested layouts',
		label: '200 layouts',
		adf: withTypingTarget(layoutsWithExpands(200)),
	},
	{
		series: 'Nested layouts',
		label: '400 layouts',
		adf: withTypingTarget(layoutsWithExpands(400)),
	},
];

// ─── Document stats ──────────────────────────────────────────────────────────

type DocStats = {
	docSize: number;
	hasLcm: boolean;
	/** Every `doc.descendants` node, text nodes included — the same count limited mode uses. */
	nodeCount: number;
	textChars: number;
};

/**
 * The document measurements limited mode keys off, plus the resolved decision for the current
 * document. Computed here rather than imported so this example stays a plain read-only view of the
 * editor's public behaviour.
 */
const describeDocument = (doc: PMNode): DocStats & { enabled: boolean } => {
	let nodeCount = 0;
	let textChars = 0;
	let hasLcm = false;

	doc.descendants((node: PMNode) => {
		nodeCount += 1;

		if (node.isText) {
			// A text node's `nodeSize` is its character length.
			textChars += node.nodeSize;
		} else if (node.attrs?.extensionKey === 'legacy-content') {
			hasLcm = true;
		}

		return true;
	});

	return {
		docSize: doc.nodeSize,
		enabled: shouldEnableLimitedModeForDocument(doc),
		hasLcm,
		nodeCount,
		textChars,
	};
};

// ─── Measurement ─────────────────────────────────────────────────────────────

type TypingPosition = 'start' | 'end';
type Measurement = { p50: number; p90: number };

// One row per (fixture × typing position), holding INP measured with limited mode OFF and ON.
type Row = {
	// Whether limited mode actually latched on for this doc during the ON pass (read from the plugin).
	activated?: boolean;
	docSize: number;
	label: string;
	nodeCount: number;
	off?: Measurement;
	on?: Measurement;
	position: TypingPosition;
	series: string;
	/** Whether the live limited-mode configuration would enable limited mode for this document. */
	wouldEnable: boolean;
};

const rowKey = (label: string, position: TypingPosition) => `${label}|${position}`;

const ITERATIONS = 40;
const WARMUP = 8;
/** Repeat the typing loop this many times per (fixture × position × pass) and pool the samples. */
const RUNS = 3;
const POSITIONS: TypingPosition[] = ['end', 'start'];
const SETTLE_FRAMES = 6;
/** Cooldown between fixtures so a heavy run's trailing work doesn't pollute the next fixture. */
const COOLDOWN_MS = 500;
// Per the production input-perf tracker: latency > 143ms = degraded.
const DEGRADED_INP_MS = 143;

const percentile = (sorted: number[], q: number) => {
	if (sorted.length === 0) {
		return 0;
	}
	const idx = Math.min(sorted.length - 1, Math.floor(q * sorted.length));
	return sorted[idx];
};

const nextFrame = () =>
	new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));

const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Let the browser fully settle before measuring: several animation frames for the just-loaded
 * document to render and the previous one to tear down, an idle callback so deferred work drains,
 * then a fixed cooldown. Without this, a heavy fixture's trailing work leaks into the next fixture.
 */
const settle = async () => {
	for (let i = 0; i < SETTLE_FRAMES; i++) {
		// eslint-disable-next-line no-await-in-loop -- frames must be awaited one at a time
		await nextFrame();
	}
	await new Promise<void>((resolve) => {
		const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
			.requestIdleCallback;
		if (ric) {
			ric(() => resolve());
		} else {
			window.setTimeout(resolve, 0);
		}
	});
	await delay(COOLDOWN_MS);
};

/** Insert a single character at the current selection and time the work up to the next paint. */
const measureKeystroke = (view: EditorView) =>
	new Promise<number>((resolve) => {
		const start = performance.now();
		const { state } = view;
		view.dispatch(state.tr.insertText('x', state.selection.to));
		window.requestAnimationFrame(() => resolve(performance.now() - start));
	});

const moveSelection = (view: EditorView, position: TypingPosition) => {
	const target = position === 'end' ? view.state.doc.content.size : 0;
	const bias = position === 'end' ? -1 : 1;
	const selection = TextSelection.near(view.state.doc.resolve(target), bias);
	view.dispatch(view.state.tr.setSelection(selection).scrollIntoView());
};

/**
 * Type into the CURRENT document at `position` and return pooled p50/p90 input latency. Repeats the
 * typing loop RUNS times, discarding each run's warmup, so a single unlucky run can't skew it. Does
 * not swap the document — used both for the per-page test and (after a fixture load) the suite.
 *
 * Returns `null` if `shouldStop` goes true part-way through: a partially-typed run would report a
 * misleadingly small sample, so an interrupted measurement is discarded rather than recorded.
 */
const measureTyping = async (
	view: EditorView,
	position: TypingPosition,
	shouldStop: () => boolean,
): Promise<Measurement | null> => {
	const samples: number[] = [];
	for (let run = 0; run < RUNS; run++) {
		moveSelection(view, position);
		// eslint-disable-next-line no-await-in-loop -- runs are sequential
		await nextFrame();
		for (let i = 0; i < ITERATIONS; i++) {
			if (shouldStop()) {
				return null;
			}
			// eslint-disable-next-line no-await-in-loop -- keystrokes must be measured sequentially
			const dt = await measureKeystroke(view);
			if (i >= WARMUP) {
				samples.push(dt);
			}
		}
	}
	const sorted = [...samples].sort((a, b) => a - b);
	return { p50: percentile(sorted, 0.5), p90: percentile(sorted, 0.9) };
};

// ─── Post-run analysis ─────────────────────────────────────────────────────────

type CompletedRow = Row & { off: Measurement; on: Measurement };

type Summary = {
	activatedRows: number;
	completedRows: number;
	degradedOff: number;
	degradedOn: number;
	falseActivations: number;
	meanImprovementActivatedPct: number | null;
	meanImprovementAllPct: number | null;
	meanOffP90: number | null;
	meanOnP90: number | null;
	worstOnP90: number | null;
};

const meanOf = (xs: number[]): number | null =>
	xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

const p90DeltaPct = (r: Row): number | null => {
	if (!r.off || !r.on || r.off.p90 === 0) {
		return null;
	}
	return ((r.off.p90 - r.on.p90) / r.off.p90) * 100;
};

const summarize = (rows: Row[]): Summary => {
	const completed = rows.flatMap((r): CompletedRow[] =>
		r.off && r.on ? [{ ...r, off: r.off, on: r.on }] : [],
	);
	const activated = completed.filter((r) => r.activated);
	const deltaOf = (r: CompletedRow) => ((r.off.p90 - r.on.p90) / r.off.p90) * 100;

	return {
		activatedRows: activated.length,
		completedRows: completed.length,
		degradedOff: completed.filter((r) => r.off.p90 > DEGRADED_INP_MS).length,
		degradedOn: completed.filter((r) => r.on.p90 > DEGRADED_INP_MS).length,
		// Limited mode turned on for a document that was already fine — unnecessary UX degradation.
		falseActivations: activated.filter((r) => r.off.p90 <= DEGRADED_INP_MS).length,
		meanImprovementActivatedPct: meanOf(activated.map(deltaOf)),
		meanImprovementAllPct: meanOf(completed.map(deltaOf)),
		meanOffP90: meanOf(completed.map((r) => r.off.p90)),
		meanOnP90: meanOf(completed.map((r) => r.on.p90)),
		worstOnP90: completed.length ? Math.max(...completed.map((r) => r.on.p90)) : null,
	};
};

/** Tab-separated export of the full results + summary, for pasting into a sheet to diff tweaks. */
const toTsv = (rows: Row[], summary: Summary): string => {
	const header = [
		'series',
		'fixture',
		'position',
		'nodeCount',
		'nodeSize',
		'wouldEnable',
		'activated',
		'offP50',
		'offP90',
		'onP50',
		'onP90',
		'deltaP90Pct',
	].join('\t');
	const body = rows.map((r) => {
		const d = p90DeltaPct(r);
		return [
			r.series,
			r.label,
			r.position,
			r.nodeCount,
			r.docSize,
			r.wouldEnable ? 'ON' : 'off',
			r.activated ? 'yes' : 'no',
			r.off ? r.off.p50.toFixed(1) : '',
			r.off ? r.off.p90.toFixed(1) : '',
			r.on ? r.on.p50.toFixed(1) : '',
			r.on ? r.on.p90.toFixed(1) : '',
			d === null ? '' : d.toFixed(1),
		].join('\t');
	});
	const fmtNum = (n: number | null) => (n === null ? '' : n.toFixed(1));
	const summaryLines = [
		'',
		`# completedRows\t${summary.completedRows}`,
		`# activatedRows\t${summary.activatedRows}`,
		`# meanImprovementActivatedPct\t${fmtNum(summary.meanImprovementActivatedPct)}`,
		`# meanImprovementAllPct\t${fmtNum(summary.meanImprovementAllPct)}`,
		`# meanOffP90\t${fmtNum(summary.meanOffP90)}`,
		`# meanOnP90\t${fmtNum(summary.meanOnP90)}`,
		`# worstOnP90\t${fmtNum(summary.worstOnP90)}`,
		`# degradedOff\t${summary.degradedOff}`,
		`# degradedOn\t${summary.degradedOn}`,
		`# falseActivations\t${summary.falseActivations}`,
	];
	return [header, ...body, ...summaryLines].join('\n');
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const wrapper = css({ display: 'flex', height: '100%' });
const editorPane = css({ flexGrow: 1, minWidth: 0 });
const controlPane = css({
	width: '600px',
	flexShrink: 0,
	padding: token('space.200', '16px'),
	overflowY: 'auto',
	borderLeft: `1px solid ${token('color.border', '#dfe1e6')}`,
	font: token('font.body.small'),
});
const controls = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.100', '8px'),
	alignItems: 'center',
});

const sectionHeading = css({ font: token('font.heading.small'), margin: 0 });
const subHeading = css({ font: token('font.heading.xsmall'), margin: 0 });

const badgeBase = css({
	display: 'inline-block',
	padding: '2px 8px',
	borderRadius: '4px',
	fontWeight: token('font.weight.bold', '700'),
	color: token('color.text.inverse', '#fff'),
});
const badgeOn = css({ background: token('color.background.accent.red.bolder', '#ca3521') });
const badgeOff = css({ background: token('color.background.accent.green.bolder', '#22a06b') });

const configCard = css({
	marginTop: token('space.100', '8px'),
	padding: token('space.100', '8px'),
	borderRadius: '4px',
	border: `1px solid ${token('color.border', '#dfe1e6')}`,
});
const barTrack = css({
	height: '8px',
	borderRadius: '4px',
	background: token('color.background.neutral', '#091e420f'),
	overflow: 'hidden',
	marginTop: token('space.050', '4px'),
});
const barFill = css({ height: '100%' });
const barFillNormal = css({ background: token('color.background.accent.blue.bolder', '#1868db') });
const barFillOver = css({ background: token('color.background.accent.red.bolder', '#ca3521') });
const metricRow = css({
	display: 'flex',
	justifyContent: 'space-between',
	gap: token('space.100', '8px'),
});
const buttonGrid = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.075', '6px'),
	marginTop: token('space.100', '8px'),
});
const sectionNote = css({
	margin: `${token('space.050', '4px')} 0`,
	color: token('color.text.subtlest'),
});
const sectionSpacer = css({ marginTop: token('space.300', '24px') });

const tableStyle = css({
	width: '100%',
	borderCollapse: 'collapse',
	marginTop: token('space.150', '12px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'th, td': {
		textAlign: 'right',
		padding: '3px 5px',
		borderBottom: `1px solid ${token('color.border', '#dfe1e6')}`,
		whiteSpace: 'nowrap',
	},
});
const firstCol = css({ textAlign: 'left' });
const seriesRow = css({ background: token('color.background.neutral', '#f4f5f7') });
const overThresholdCell = css({
	color: token('color.text.accent.red', '#ae2a19'),
	fontWeight: 700,
});
const degradedCell = css({ color: token('color.text.accent.orange', '#a54800'), fontWeight: 700 });
const improvedCell = css({ color: token('color.text.accent.green', '#216e4e'), fontWeight: 700 });
const regressedCell = css({ color: token('color.text.accent.red', '#ae2a19'), fontWeight: 700 });
const improvedText = css({ color: token('color.text.accent.green', '#216e4e') });
const regressedText = css({ color: token('color.text.accent.red', '#ae2a19') });

const summaryCard = css({
	marginTop: token('space.150', '12px'),
	padding: token('space.150', '12px'),
	borderRadius: '6px',
	border: `1px solid ${token('color.border', '#dfe1e6')}`,
	background: token('color.background.neutral', '#f4f5f7'),
});
const headline = css({ fontSize: '18px', fontWeight: 700, margin: 0 });
const statGrid = css({
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gap: token('space.075', '6px'),
	marginTop: token('space.100', '8px'),
});

const isDegraded = (m: Measurement | undefined) => Boolean(m && m.p90 > DEGRADED_INP_MS);
const fmt = (m: Measurement | undefined, key: keyof Measurement) => (m ? m[key].toFixed(1) : '—');

// ─── Sub-components ────────────────────────────────────────────────────────────

/**
 * The limited-mode configuration in force for the current document: the thresholds, where the
 * document sits against them, and the resulting decision. The bar tracks node count — the primary
 * trigger — against its threshold.
 */
const ConfigCard = ({ stats }: { stats: DocStats & { enabled: boolean } }) => {
	const { docSizeThreshold, nodeCountThreshold } = getLimitedModeThresholds();
	const { nodeCount, docSize } = stats;
	const pct = Math.min(100, Math.round((nodeCount / nodeCountThreshold) * 100));
	const overNodeCount = nodeCount > nodeCountThreshold;

	return (
		<div css={configCard}>
			<div css={metricRow}>
				<strong>Limited mode for this document</strong>
				<span css={[badgeBase, stats.enabled ? badgeOn : badgeOff]}>
					{stats.enabled ? 'ON' : 'OFF'}
				</span>
			</div>
			<div css={metricRow}>
				<span>node count</span>
				<span css={overNodeCount ? overThresholdCell : undefined}>
					{nodeCount} / {nodeCountThreshold}
				</span>
			</div>
			<div css={barTrack}>
				<div
					css={[barFill, overNodeCount ? barFillOver : barFillNormal]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- width is a computed percentage of the node-count threshold
					style={{ width: `${pct}%` }}
				/>
			</div>
			<div css={metricRow}>
				<span>nodeSize</span>
				<span css={docSize > docSizeThreshold ? overThresholdCell : undefined}>
					{docSize} / {docSizeThreshold}
				</span>
			</div>
			<div css={metricRow}>
				<span>text</span>
				<span>{stats.textChars} chars</span>
			</div>
			<div css={metricRow}>
				<span>legacy-content macro</span>
				<span>{stats.hasLcm ? 'yes' : 'no'}</span>
			</div>
		</div>
	);
};

const SummaryCard = ({ summary }: { summary: Summary }) => {
	if (summary.completedRows === 0) {
		return null;
	}
	const improvement = summary.meanImprovementActivatedPct;
	const fmtPct = (n: number | null) => (n === null ? '—' : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`);
	const fmtMs = (n: number | null) => (n === null ? '—' : `${n.toFixed(1)}ms`);
	return (
		<div css={summaryCard}>
			<p css={headline}>
				Overall improvement (limited mode active):{' '}
				{improvement === null ? (
					'—'
				) : (
					<span css={improvement >= 0 ? improvedText : regressedText}>{fmtPct(improvement)}</span>
				)}
			</p>
			<div css={statGrid}>
				<div css={metricRow}>
					<span>Activated / completed</span>
					<span>
						{summary.activatedRows} / {summary.completedRows}
					</span>
				</div>
				<div css={metricRow}>
					<span>Mean Δ p90 (all rows)</span>
					<span>{fmtPct(summary.meanImprovementAllPct)}</span>
				</div>
				<div css={metricRow}>
					<span>Mean p90 off → on</span>
					<span>
						{fmtMs(summary.meanOffP90)} → {fmtMs(summary.meanOnP90)}
					</span>
				</div>
				<div css={metricRow}>
					<span>Worst on p90</span>
					<span>{fmtMs(summary.worstOnP90)}</span>
				</div>
				<div css={metricRow}>
					<span>Degraded rows off → on</span>
					<span>
						{summary.degradedOff} → {summary.degradedOn}
					</span>
				</div>
				<div css={metricRow}>
					<span>False activations</span>
					<span css={summary.falseActivations > 0 ? regressedText : undefined}>
						{summary.falseActivations}
					</span>
				</div>
			</div>
		</div>
	);
};

const ResultsTable = ({ rows }: { rows: Row[] }) => {
	let lastSeries = '';
	return (
		<table css={tableStyle}>
			<thead>
				<tr>
					<th css={firstCol}>Fixture</th>
					<th>pos</th>
					<th>nodes</th>
					<th>nodeSize</th>
					<th>LM?</th>
					<th>off p50</th>
					<th>off p90</th>
					<th>on p50</th>
					<th>on p90</th>
					<th>Δ p90</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((r) => {
					const showSeries = r.series !== lastSeries;
					lastSeries = r.series;
					const delta = p90DeltaPct(r);
					return (
						<Fragment key={rowKey(r.label, r.position)}>
							{showSeries && (
								<tr css={seriesRow}>
									<td colSpan={10}>
										<strong>{r.series}</strong>
									</td>
								</tr>
							)}
							<tr>
								<td css={firstCol}>{r.label}</td>
								<td>{r.position}</td>
								<td css={r.wouldEnable ? overThresholdCell : undefined}>{r.nodeCount}</td>
								<td>{r.docSize}</td>
								<td>{r.wouldEnable ? 'ON' : 'off'}</td>
								<td css={isDegraded(r.off) ? degradedCell : undefined}>{fmt(r.off, 'p50')}</td>
								<td css={isDegraded(r.off) ? degradedCell : undefined}>{fmt(r.off, 'p90')}</td>
								<td css={isDegraded(r.on) ? degradedCell : undefined}>{fmt(r.on, 'p50')}</td>
								<td css={isDegraded(r.on) ? degradedCell : undefined}>{fmt(r.on, 'p90')}</td>
								{delta === null ? (
									<td>—</td>
								) : (
									<td css={delta >= 0 ? improvedCell : regressedCell}>
										{delta >= 0 ? '+' : ''}
										{delta.toFixed(0)}%
									</td>
								)}
							</tr>
						</Fragment>
					);
				})}
			</tbody>
		</table>
	);
};

// ─── Main component ────────────────────────────────────────────────────────────

const ExampleEditorComponent = (): jsx.JSX.Element => {
	const editorActionsRef = useRef<EditorActions | null>(null);
	const editorApiRef = useRef<EditorAPI>(undefined);

	// Live stats + limited-mode decision for the current document.
	const [stats, setStats] = useState<(DocStats & { enabled: boolean }) | null>(null);
	const [latchedEnabled, setLatchedEnabled] = useState<boolean | undefined>(undefined);

	// Benchmark state. `stopRequestedRef` is a ref, not state, because the typing loops read it
	// between keystrokes and must see the latest value without waiting for a re-render.
	const [rows, setRows] = useState<Row[]>([]);
	const [running, setRunning] = useState(false);
	const [progress, setProgress] = useState('');
	const stopRequestedRef = useRef(false);
	// Result of the "test the current page" run (measures whatever document is loaded now).
	const [singleResult, setSingleResult] = useState<{
		end?: Measurement;
		start?: Measurement;
	} | null>(null);

	// `limitedModeEnabled` registers/unregisters the plugin (killSwitchEnabled = !enabled). Changing
	// it remounts the editor via `editorKey`. `readyResolveRef` lets the benchmark await the remount;
	// `pendingDocRef` carries the current document across a manual toggle so it isn't lost.
	const [limitedModeEnabled, setLimitedModeEnabled] = useState(false);
	// Bumped by "reset latch" to force a remount; see `editorKey`.
	const [latchResetCount, setLatchResetCount] = useState(0);
	const mountedEnabledRef = useRef<boolean | undefined>(undefined);
	const readyResolveRef = useRef<(() => void) | null>(null);
	const pendingDocRef = useRef<object | null>(null);

	const refresh = useCallback(() => {
		const view = editorActionsRef.current?._privateGetEditorView();
		if (!view) {
			return;
		}
		setStats(describeDocument(view.state.doc));
		const shared = editorApiRef.current?.limitedMode?.sharedState.currentState();
		// The derived `enabled`, so this reflects the runtime performance latch as well as the
		// document-derived verdict. Reading `documentSizeBreachesThreshold` alone would miss a latch.
		setLatchedEnabled(shared?.enabled);
	}, []);

	/**
	 * Latch limited mode by hand, via the same meta the detector dispatches when the high bar is met.
	 * No test-only API: this is the real code path, just triggered deliberately instead of by 40+
	 * seconds of sustained jank.
	 */
	const forceLatch = useCallback(() => {
		const view = editorActionsRef.current?._privateGetEditorView();
		const pluginKey =
			editorApiRef.current?.limitedMode?.sharedState.currentState()?.limitedModePluginKey;

		if (!view || !pluginKey) {
			return;
		}

		view.dispatch(view.state.tr.setMeta(pluginKey, { latchPolicyBreached: true }));
		refresh();
	}, [refresh]);

	/**
	 * Clear the latch by remounting the editor, preserving the current document.
	 *
	 * There is deliberately no un-latch path in the plugin: the latch is one-way so the editor can
	 * never oscillate between modes, and adding a reverse transition purely for this example would put
	 * a hole in that guarantee. A remount is what a user's page reload does.
	 */
	const resetLatch = useCallback(() => {
		const view = editorActionsRef.current?._privateGetEditorView();
		pendingDocRef.current = view ? view.state.doc.toJSON() : null;
		setLatchResetCount((count) => count + 1);
	}, []);

	const loadSample = useCallback(
		(sample: Sample) => {
			editorApiRef.current?.core?.actions.replaceDocument(sample.adf);
			window.setTimeout(refresh, 50);
		},
		[refresh],
	);

	// Measure INP on the CURRENT document (no fixture load, no remount) in whatever limited-mode
	// state is active right now. Types into the live page at both end and start.
	const runSingle = useCallback(async () => {
		const view = editorActionsRef.current?._privateGetEditorView();
		if (!view) {
			return;
		}
		stopRequestedRef.current = false;
		setRunning(true);
		setSingleResult(null);
		setProgress('Testing current page…');
		await settle();
		const result: { end?: Measurement; start?: Measurement } = {};
		for (const position of POSITIONS) {
			setProgress(`Testing current page @ ${position}…`);
			// eslint-disable-next-line no-await-in-loop -- positions run sequentially
			const measurement = await measureTyping(view, position, () => stopRequestedRef.current);
			if (!measurement) {
				break;
			}
			result[position] = measurement;
			setSingleResult({ ...result });
		}
		refresh();
		setProgress(stopRequestedRef.current ? 'Stopped' : 'Done');
		setRunning(false);
	}, [refresh]);

	// Ask the in-flight run to wind up. The typing loops check this between keystrokes, so the run
	// ends within a keystroke or two rather than finishing the remaining fixtures.
	const onStop = useCallback(() => {
		stopRequestedRef.current = true;
		setProgress('Stopping…');
	}, []);

	// Toggle the plugin on/off, preserving the current document across the remount.
	const toggleLimitedMode = useCallback(() => {
		const view = editorActionsRef.current?._privateGetEditorView();
		pendingDocRef.current = view ? view.state.doc.toJSON() : null;
		setLimitedModeEnabled((v) => !v);
	}, []);

	const ensureEditor = useCallback(
		(enabled: boolean) =>
			new Promise<void>((resolve) => {
				if (mountedEnabledRef.current === enabled && editorActionsRef.current) {
					resolve();
					return;
				}
				readyResolveRef.current = resolve;
				setLimitedModeEnabled(enabled);
			}),
		[],
	);

	const measureFixture = useCallback(
		async (fixture: Fixture, position: TypingPosition): Promise<Measurement | null> => {
			editorApiRef.current?.core?.actions.replaceDocument(fixture.adf);
			await settle();

			const view = editorActionsRef.current?._privateGetEditorView();
			if (!view) {
				return null;
			}
			return measureTyping(view, position, () => stopRequestedRef.current);
		},
		[],
	);

	const onRun = useCallback(async () => {
		stopRequestedRef.current = false;
		setRunning(true);
		const byKey = new Map<string, Row>();
		setRows([]);

		const total = 2 * FIXTURES.length * POSITIONS.length;
		let done = 0;
		// Measurements actually recorded — `done` counts attempts, so it over-reports by one when a
		// stop lands mid-measurement.
		let completed = 0;
		// Set once a stop has been honoured, so the outer loops unwind without a labelled break.
		let stopped = false;

		// Two passes: limited mode OFF (baseline) then ON. Each pass remounts the editor once.
		for (const enabled of [false, true]) {
			if (stopped) {
				break;
			}
			// eslint-disable-next-line no-await-in-loop -- passes are sequential (each remounts the editor)
			await ensureEditor(enabled);
			// eslint-disable-next-line no-await-in-loop -- let the freshly mounted editor settle
			await settle();

			for (const fixture of FIXTURES) {
				if (stopped) {
					break;
				}

				for (const position of POSITIONS) {
					if (stopRequestedRef.current) {
						stopped = true;
						break;
					}

					done += 1;
					setProgress(
						`${done}/${total} · LM ${enabled ? 'on' : 'off'} · ${fixture.label} @ ${position}`,
					);
					// eslint-disable-next-line no-await-in-loop -- fixtures run sequentially to avoid interference
					const measurement = await measureFixture(fixture, position);
					const view = editorActionsRef.current?._privateGetEditorView();
					if (!measurement || !view) {
						// `measureFixture` returns null on an interrupted measurement as well as on a
						// missing view, so honour a pending stop here rather than moving to the next fixture.
						if (stopRequestedRef.current) {
							stopped = true;
							break;
						}
						continue;
					}
					const fixtureStats = describeDocument(view.state.doc);

					const key = rowKey(fixture.label, position);
					const row: Row = byKey.get(key) ?? {
						docSize: fixtureStats.docSize,
						label: fixture.label,
						nodeCount: fixtureStats.nodeCount,
						position,
						series: fixture.series,
						wouldEnable: fixtureStats.enabled,
					};
					if (enabled) {
						row.on = measurement;
						row.activated = Boolean(
							editorApiRef.current?.limitedMode?.sharedState
								.currentState()
								?.limitedModePluginKey?.getState(view.state)?.documentSizeBreachesThreshold,
						);
					} else {
						row.off = measurement;
					}
					byKey.set(key, row);
					completed += 1;
					setRows(Array.from(byKey.values()));
					refresh();
				}
			}
		}
		setProgress(stopped ? `Stopped after ${completed}/${total}` : 'Done');
		setRunning(false);
	}, [ensureEditor, measureFixture, refresh]);

	const onCopy = useCallback(() => {
		void navigator.clipboard?.writeText(toTsv(rows, summarize(rows)));
		setProgress('Copied results to clipboard (TSV)');
	}, [rows]);

	const summary = summarize(rows);
	// `latchResetCount` participates in the key so "reset latch" remounts the editor, which is the
	// only way to clear the latch — exactly as in production, where the answer is "reload the page".
	const editorKey = `lm-${limitedModeEnabled}-${latchResetCount}`;

	return (
		<div css={wrapper}>
			<div css={editorPane}>
				<PresetContextProvider>
					<FullPageExample
						key={editorKey}
						overridedFullPagePresetProps={{
							pluginOptions: { limitedMode: { killSwitchEnabled: !limitedModeEnabled } },
						}}
						onExampleEditorReady={(editorActions) => {
							editorActionsRef.current = editorActions;
							mountedEnabledRef.current = limitedModeEnabled;
							// Resolve any benchmark remount that is awaiting readiness.
							const resolve = readyResolveRef.current;
							readyResolveRef.current = null;
							resolve?.();
							// Restore the document preserved across a manual toggle.
							const pendingDoc = pendingDocRef.current;
							pendingDocRef.current = null;
							window.setTimeout(() => {
								if (pendingDoc) {
									editorApiRef.current?.core?.actions.replaceDocument(pendingDoc);
								}
								refresh();
							}, 50);
						}}
						setEditorApi={(editorApi) => {
							editorApiRef.current = editorApi;
						}}
						editorProps={{
							appearance: 'full-page',
							shouldFocus: true,
							onChange: () => refresh(),
						}}
					/>
				</PresetContextProvider>
			</div>

			<div css={controlPane}>
				<h3 css={sectionHeading}>Limited mode</h3>
				<div css={controls}>
					<Button appearance="primary" isDisabled={running} onClick={toggleLimitedMode}>
						Limited mode plugin: {limitedModeEnabled ? 'ON' : 'OFF'}
					</Button>
					<span css={[badgeBase, latchedEnabled ? badgeOn : badgeOff]}>
						latched: {latchedEnabled === undefined ? '…' : latchedEnabled ? 'ON' : 'OFF'}
					</span>
				</div>
				<p css={sectionNote}>
					Toggle registers/unregisters the plugin (killSwitch) and keeps the current document. When
					ON, limited mode latches per the thresholds shown below.
				</p>

				<div css={buttonGrid}>
					<Button
						spacing="compact"
						isDisabled={running || !limitedModeEnabled || Boolean(latchedEnabled)}
						onClick={forceLatch}
					>
						Force latch
					</Button>
					<Button
						spacing="compact"
						isDisabled={running || !limitedModeEnabled}
						onClick={resetLatch}
					>
						Reset latch (remount)
					</Button>
				</div>
				<p css={sectionNote}>
					Force latch dispatches the same transaction the detector does when the high bar is met, so
					every consumer sees a real latch. Reset remounts the editor, keeping the document — the
					latch is one-way, so a remount is the only way to clear it (in production, a page reload).
				</p>

				<div css={controls}>
					<Button isDisabled={running} onClick={runSingle}>
						Run INP test (this page)
					</Button>
					<span>{progress}</span>
				</div>
				<p css={sectionNote}>
					Types {RUNS}×{ITERATIONS} keystrokes into the current document (end &amp; start) and
					reports its INP in the current limited-mode state — no fixtures loaded. Note: this inserts
					characters into the page.
				</p>
				{singleResult && (
					<div css={summaryCard}>
						<div css={metricRow}>
							<strong>Current page INP</strong>
							<span>limited mode {latchedEnabled ? 'ON' : 'OFF'}</span>
						</div>
						<div css={metricRow}>
							<span>end</span>
							<span css={isDegraded(singleResult.end) ? degradedCell : undefined}>
								p50 {fmt(singleResult.end, 'p50')} / p90 {fmt(singleResult.end, 'p90')}
							</span>
						</div>
						<div css={metricRow}>
							<span>start</span>
							<span css={isDegraded(singleResult.start) ? degradedCell : undefined}>
								p50 {fmt(singleResult.start, 'p50')} / p90 {fmt(singleResult.start, 'p90')}
							</span>
						</div>
					</div>
				)}

				{stats && <ConfigCard stats={stats} />}

				<div css={sectionSpacer}>
					<h4 css={subHeading}>Samples</h4>
					<div css={buttonGrid}>
						{SAMPLES.map((sample) => (
							<Button
								key={sample.label}
								spacing="compact"
								isDisabled={running}
								onClick={() => loadSample(sample)}
							>
								{sample.label}
							</Button>
						))}
					</div>
				</div>

				<div css={sectionSpacer}>
					<h4 css={subHeading}>INP benchmark suite</h4>
					<p css={sectionNote}>
						Loads every fixture and types {RUNS}×{ITERATIONS} keystrokes (first {WARMUP} of each run
						discarded, pooled) at the <strong>end</strong> and <strong>start</strong>, limited mode
						off vs on. Δ p90 green = faster, red = slower. Compare the headline improvement across
						tweaks. Keep the tab focused while running. Stop ends the run within a keystroke or two
						and keeps whatever rows already completed.
					</p>
					<div css={controls}>
						<Button appearance="primary" isDisabled={running} onClick={onRun}>
							{running ? 'Running…' : 'Run benchmark suite'}
						</Button>
						<Button appearance="warning" isDisabled={!running} onClick={onStop}>
							Stop
						</Button>
						<Button isDisabled={running || summary.completedRows === 0} onClick={onCopy}>
							Copy results (TSV)
						</Button>
						<span>{progress}</span>
					</div>
					<SummaryCard summary={summary} />
					{rows.length > 0 && <ResultsTable rows={rows} />}
				</div>
			</div>
		</div>
	);
};

export default ExampleEditorComponent;
