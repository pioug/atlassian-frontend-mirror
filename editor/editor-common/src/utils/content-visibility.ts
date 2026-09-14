import type { RichMediaLayout } from '@atlaskit/adf-schema/rich-media-common';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { calcMediaSinglePixelWidth } from '../media-single/utils';

// Rough per-node rendered-size constants (px), grounded in the real style defaults from
// `styles/shared/table.ts`, `EditorContentContainer/styles/expandStyles.ts` and
// `EditorContentContainer/styles/layout.ts`. These only need to be a decent first estimate: the
// `auto` keyword in `contain-intrinsic-*: auto <estimate>` makes the browser remember each
// element's real size after its first render, so any inaccuracy self-corrects on scroll. Where the
// estimate can't be exact we intentionally err slightly HIGH — over-reserving leaves a marginally
// long scrollbar that shrinks on scroll, whereas under-reserving makes content jump upward.
const TABLE_ROW_HEIGHT = 44; // row content: line-height + cell padding (space.100 ×2) + cell border
const TABLE_VERTICAL_MARGIN = 40; // tableMarginTop(24) + tableMarginBottom(16)
const TABLE_MIN_HEIGHT = 120;

const BLOCK_HEIGHT = 28; // a typical paragraph/block line + spacing

const EXPAND_HEADER_HEIGHT = 48; // min-height:25 + padding + margin of the title row
const EXPAND_CONTENT_PADDING = 8; // space.100 padding-top when expanded

const MEDIA_SINGLE_MIN_HEIGHT = 100;
const MEDIA_SINGLE_GUTTER = 12; // MEDIA_SINGLE_GUTTER_SIZE — gap between resizer handle and media
const MEDIA_SINGLE_VERTICAL_MARGIN = 24; // rich-media-item margin: space.150 top + bottom
const MEDIA_CAPTION_HEIGHT = 32; // caption line-height + vertical padding, when a caption is present
const DEFAULT_MEDIA_ASPECT_RATIO = 9 / 16; // used only when the media has no intrinsic dimensions

/**
 * The intrinsic size a nodeView reserves while off-screen (`contain-intrinsic-width`/`-height`).
 * `width` is optional: for block-level wrappers (expand, layout) the inline size comes from the
 * containing block regardless of size containment, so only `height` is meaningful; for
 * content-sized boxes (the `<table>` element, the mediaSingle wrapper) the width matters and must
 * be supplied or the box collapses to 0 wide while contained.
 */
export type IntrinsicSize = {
	height: number;
	width?: number;
};

/**
 * Estimate the rendered height of a table from its row count. Cell padding and cell borders are
 * already folded into `TABLE_ROW_HEIGHT`; the table's block margins are added as a small buffer.
 */
export function estimateTableIntrinsicHeight(node: PMNode): number {
	const rows = node.childCount;
	return Math.max(TABLE_MIN_HEIGHT, rows * TABLE_ROW_HEIGHT + TABLE_VERTICAL_MARGIN);
}

/**
 * Estimate the rendered height of an expand. A collapsed expand reserves only its header row; an
 * expanded one additionally reserves space for its child blocks. `expanded` is passed in by the
 * caller because the two expand implementations track expanded state differently (a WeakMap in
 * single-player vs the `__expanded` attribute in legacy).
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function estimateExpandIntrinsicHeight(node: PMNode, expanded: boolean): number {
	if (!expanded) {
		return EXPAND_HEADER_HEIGHT;
	}
	return EXPAND_HEADER_HEIGHT + node.childCount * BLOCK_HEIGHT + EXPAND_CONTENT_PADDING;
}

/**
 * Estimate the rendered width AND height of a mediaSingle. Unlike the structural estimates above,
 * media carries its real dimensions in the ADF: the child `media` node's `width`/`height` attrs
 * give the intrinsic aspect ratio, and the rendered pixel width is computed with the exact same
 * `calcMediaSinglePixelWidth` helper the renderer uses (honouring `width`/`widthType`/`layout` and
 * the editor's content/container width). Height then follows from width × aspect ratio — plus a
 * caption row when present and the mediaSingle's block margins — so this is the most accurate
 * estimate of any node type. The pixel width is returned as the intrinsic width because the
 * mediaSingle wrapper is content-sized. `lineLength` and `containerWidth` come from the width
 * plugin's shared state.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function estimateMediaSingleIntrinsicSize(
	node: PMNode,
	lineLength: number,
	containerWidth: number,
): IntrinsicSize {
	const media = node.firstChild;
	const origWidth = Number(media?.attrs?.width) || 0;
	const origHeight = Number(media?.attrs?.height) || 0;
	const aspectRatio = origWidth && origHeight ? origHeight / origWidth : DEFAULT_MEDIA_ASPECT_RATIO;

	const pixelWidth = calcMediaSinglePixelWidth({
		width: node.attrs.width ?? undefined,
		widthType: node.attrs.widthType,
		origWidth: origWidth || lineLength || containerWidth,
		layout: (node.attrs.layout as RichMediaLayout) ?? 'center',
		contentWidth: lineLength || undefined,
		containerWidth: containerWidth || lineLength,
		gutterOffset: MEDIA_SINGLE_GUTTER,
	});

	// A caption child (childCount > 1) sits below the media, and the mediaSingle block reserves
	// vertical margin above and below regardless.
	const captionHeight = node.childCount > 1 ? MEDIA_CAPTION_HEIGHT : 0;
	const height = Math.max(
		MEDIA_SINGLE_MIN_HEIGHT,
		Math.round(pixelWidth * aspectRatio) + captionHeight + MEDIA_SINGLE_VERTICAL_MARGIN,
	);
	return { width: Math.round(pixelWidth), height };
}

/**
 * Produce a single-axis `contain-intrinsic-width`/`-height` value using the `auto` keyword so the
 * browser remembers the element's real size after its first render and only uses the estimate
 * beforehand.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function formatIntrinsicSize(px: number): string {
	return `auto ${Math.round(px)}px`;
}

/**
 * The `content-visibility` / `contain-intrinsic-*` styles applied to an eligible node. Width and
 * height are kept as separate `contain-intrinsic-width`/`-height` axes rather than the
 * `contain-intrinsic-size` shorthand: the shorthand's single value is applied to BOTH axes, which
 * forces a wrong width on content-sized boxes (e.g. a 500px-tall `<table>` would reserve 500px
 * wide). `containIntrinsicWidth` is omitted for block-level wrappers whose width comes from layout.
 */
type ContentVisibilityStyle = {
	containIntrinsicHeight: string;
	containIntrinsicWidth?: string;
	contentVisibility: 'auto';
};

/**
 * Resolve the `content-visibility` styles for a node, or `undefined` when the optimisation should
 * not apply.
 *
 * Gating is delegated to limited mode: `limitedModeEnabled` should come from the limited-mode
 * plugin's shared state, so this feature shares a single "large document" definition with limited
 * mode rather than a bespoke threshold. The optimisation applies only when the feature gate is on
 * AND limited mode is active.
 *
 * The intrinsic size is supplied lazily via `getIntrinsicSize` so callers can compute a
 * per-instance estimate from the node's structure, and is only evaluated when actually applied.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getContentVisibilityStyle(
	limitedModeEnabled: boolean,
	getIntrinsicSize: () => IntrinsicSize,
): ContentVisibilityStyle | undefined {
	if (!limitedModeEnabled || !isExperimentEnabled('cc_editor_limited_mode_perf_improvements')) {
		return undefined;
	}

	const { width, height } = getIntrinsicSize();
	return {
		contentVisibility: 'auto',
		containIntrinsicHeight: formatIntrinsicSize(height),
		...(width !== undefined ? { containIntrinsicWidth: formatIntrinsicSize(width) } : {}),
	};
}

/**
 * Imperatively apply the `content-visibility: auto` rendering optimisation to a node's top-level
 * DOM element (for use in raw-DOM nodeViews), but only when both the feature gate is on and limited
 * mode is active (see `getContentVisibilityStyle`).
 *
 * The intrinsic size uses the `auto` keyword so any initial inaccuracy self-corrects once the
 * element has been rendered once. Safe to call repeatedly (e.g. on expand/collapse toggle) — it
 * simply re-applies or, when ineligible, leaves the element untouched.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function applyContentVisibility(
	dom: HTMLElement,
	limitedModeEnabled: boolean,
	getIntrinsicSize: () => IntrinsicSize,
): boolean {
	const style = getContentVisibilityStyle(limitedModeEnabled, getIntrinsicSize);
	if (!style) {
		dom.style.contentVisibility = '';
		dom.style.containIntrinsicHeight = '';
		dom.style.containIntrinsicWidth = '';
		return false;
	}

	dom.style.contentVisibility = style.contentVisibility;
	dom.style.containIntrinsicHeight = style.containIntrinsicHeight;
	dom.style.containIntrinsicWidth = style.containIntrinsicWidth ?? '';
	return true;
}
