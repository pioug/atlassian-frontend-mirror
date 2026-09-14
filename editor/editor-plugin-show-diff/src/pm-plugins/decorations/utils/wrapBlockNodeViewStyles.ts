/**
 * Style resolution for the `wrapBlockNodeView` nodeview decorations.
 *
 * Every exported resolver is a single gate: the `colorSchemeRegistry` + `factory.ts`
 * implementation when `platform_editor_show_diff_color_scheme_refactor` is on, and the verbatim
 * pre-refactor per-scheme constants from `./wrapBlockNodeViewStyles.legacy` when it is off. The two
 * paths are built to emit identical style strings for both shipped schemes, so this is a kill
 * switch for a refactor rather than a behaviour experiment.
 *
 * On cleanup (EDITOR-8281): drop the `isExperimentEnabled` dispatch and the `*Legacy` imports,
 * keeping the `*Next` bodies.
 */
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { DiffType } from '../../../showDiffPluginType';
import { isExtendedEnabled } from '../../isExtendedEnabled';
import {
	buildAddedCellOverlayRoundedStyle,
	buildAddedCellOverlayStyle,
	buildAddedCellOverlayStyleNew,
	buildDeletedCellOverlayRoundedStyle,
	buildDeletedCellOverlayStyle,
	buildDeletedInlineContentStyle,
	buildDeletedInlineContentStyleExtended,
	buildDeletedLozengeActiveStyle,
	buildDeletedLozengeStyle,
	buildDeletedNodeCSSVariables,
	buildDeletedQuoteNodeWithLozengeStyle,
	buildDeletedStrikethroughLine,
	buildDeletedWrappedBlockOutline,
	buildInsertedBlockNodeStyle,
	buildInsertedInlineStyle,
	buildInsertStyleInBlockExtended,
	buildInsertStyleInBlockExtendedNoUnderline,
	buildInsertStyleNode,
} from '../colorSchemes/factory';
import { colorSchemeRegistry, getLegacyColorScheme, standardScheme } from '../colorSchemes/schemes';
import type { ColorScheme, DiffColorScheme } from '../colorSchemes/types';

import {
	getChangedContentStyleLegacy,
	getChangedNodeStyleLegacy,
	getDeletedContentStyleLegacy,
	getDeletedContentStyleUnboundedLegacy,
	getInsertedContentStyleLegacy,
	hasRestingDeletedRingLegacy,
	resolveCellOverlayStyleLegacy,
	resolveNestedInsertedNodeStyleLegacy,
	resolveRemovedLozengeStyleLegacy,
} from './wrapBlockNodeViewStyles.legacy';

const getColorScheme = (colorScheme: ColorScheme | undefined): DiffColorScheme =>
	colorSchemeRegistry[colorScheme ?? 'standard'];

/**
 * Inserted content inside a multi-container or list node always uses the standard scheme, so a
 * traditional diff shows purple here. Pre-existing: these call sites predate traditional.
 * Preserved as-is; see EDITOR-8281.
 */
const nestedContentScheme = standardScheme;

/**
 * Node-name classification shared by the style resolvers below and by the routing in
 * `wrapBlockNodeView.ts`.
 */
export const isMultiContainerBlockNode = (nodeName: string): boolean => {
	return ['decisionList', 'layoutSection'].includes(nodeName);
};

export const isTextLikeBlockNode = (nodeName: string): boolean => {
	return ['heading', 'bulletList', 'orderedList', 'listItem', 'taskList', 'blockquote'].includes(
		nodeName,
	);
};

const getChangedContentStyleNext = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	isInserted: boolean = false,
	diffType?: DiffType,
	hideAddedDiffsUnderline: boolean = false,
): string => {
	const colors = getColorScheme(colorScheme);

	if (isExtendedEnabled(diffType) && isInserted) {
		return buildInsertedInlineStyle(colors, isActive, hideAddedDiffsUnderline);
	}

	if (isActive) {
		return buildDeletedInlineContentStyle(colors, 'active');
	}

	return buildDeletedInlineContentStyle(
		colors,
		expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true) ? 'new' : 'default',
	);
};

const getChangedNodeStyleNext = (
	nodeName: string,
	colorScheme?: ColorScheme,
	isInserted: boolean = false,
	isActive: boolean = false,
	diffType?: DiffType,
	hideAddedDiffsUnderline: boolean = false,
) => {
	const colors = getColorScheme(colorScheme);

	if (isExtendedEnabled(diffType) && isInserted) {
		if (isMultiContainerBlockNode(nodeName)) {
			return hideAddedDiffsUnderline
				? buildInsertStyleInBlockExtendedNoUnderline(nestedContentScheme)
				: buildInsertStyleInBlockExtended(nestedContentScheme);
		}
		if (isTextLikeBlockNode(nodeName)) {
			return undefined;
		}
		return buildInsertedBlockNodeStyle(colors, 'node', isActive);
	}

	switch (nodeName) {
		case 'blockquote':
			return buildDeletedQuoteNodeWithLozengeStyle(colors, isActive);
		case 'expand':
		case 'decisionList':
			return buildDeletedWrappedBlockOutline(colors, { isActive, isRounded: false });
		case 'panel':
		case 'codeBlock':
			return buildDeletedWrappedBlockOutline(colors, { isActive, isRounded: true });
		default:
			return undefined;
	}
};

const getDeletedContentStyleUnboundedNext = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
): string => buildDeletedStrikethroughLine(getColorScheme(colorScheme), isActive);

const getInsertedContentStyleNext = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	hideAddedDiffsUnderline: boolean = false,
): string =>
	buildInsertedInlineStyle(getColorScheme(colorScheme), isActive, hideAddedDiffsUnderline);

const getDeletedContentStyleNext = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	diffType?: DiffType,
	omitHighlight: boolean = false,
): string => {
	const colors = getColorScheme(colorScheme);
	const base = buildDeletedInlineContentStyle(colors, isActive ? 'active' : 'new');

	// glyphTint adds a background highlight and border-bottom over the tint; strikethrough does not.
	const needsExtendedHighlight =
		colors.deletedInlineTreatment === 'glyphTint' && isExtendedEnabled(diffType) && !omitHighlight;

	return needsExtendedHighlight
		? base + buildDeletedInlineContentStyleExtended(colors, isActive)
		: base;
};

const resolveCellOverlayStyleNext = ({
	colorScheme,
	isInserted,
	isRoundedTable,
}: {
	colorScheme?: ColorScheme;
	isInserted: boolean;
	isRoundedTable: boolean;
}): string => {
	const colors = getColorScheme(colorScheme);

	// Square added-cell overlays follow insertedNodeEmphasis: pressed background vs accent border.
	const addedCellStyle = isRoundedTable
		? buildAddedCellOverlayRoundedStyle(colors)
		: colors.insertedNodeEmphasis === 'stateful'
			? buildAddedCellOverlayStyleNew(colors)
			: buildAddedCellOverlayStyle(colors);

	const deletedCellStyle = isRoundedTable
		? buildDeletedCellOverlayRoundedStyle(colors)
		: buildDeletedCellOverlayStyle(colors);

	return isInserted ? addedCellStyle : deletedCellStyle;
};

const resolveRemovedLozengeStyleNext = (
	colorScheme: ColorScheme | undefined,
	isActive: boolean,
): string => {
	const colors = getColorScheme(colorScheme);
	return isActive ? buildDeletedLozengeActiveStyle(colors) : buildDeletedLozengeStyle(colors);
};

const resolveNestedInsertedNodeStyleNext = (): string => buildInsertStyleNode(nestedContentScheme);

// Only 'stateful' schemes have a resting ring.
const hasRestingDeletedRingNext = (colorScheme?: ColorScheme): boolean =>
	getColorScheme(colorScheme).deletedNodeEmphasis === 'stateful';

/** Inline content style for a changed (inserted or deleted) block node. */
export const getChangedContentStyle = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	isInserted: boolean = false,
	diffType?: DiffType,
	hideAddedDiffsUnderline: boolean = false,
): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? getChangedContentStyleNext(
				colorScheme,
				isActive,
				isInserted,
				diffType,
				hideAddedDiffsUnderline,
			)
		: getChangedContentStyleLegacy(
				getLegacyColorScheme(colorScheme),
				isActive,
				isInserted,
				diffType,
				hideAddedDiffsUnderline,
			);

/** Node-specific style for a changed block node, or `undefined` when the node type has none. */
export const getChangedNodeStyle = (
	nodeName: string,
	colorScheme?: ColorScheme,
	isInserted: boolean = false,
	isActive: boolean = false,
	diffType?: DiffType,
	hideAddedDiffsUnderline: boolean = false,
): string | undefined =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? getChangedNodeStyleNext(
				nodeName,
				colorScheme,
				isInserted,
				isActive,
				diffType,
				hideAddedDiffsUnderline,
			)
		: getChangedNodeStyleLegacy(
				nodeName,
				getLegacyColorScheme(colorScheme),
				isInserted,
				isActive,
				diffType,
				hideAddedDiffsUnderline,
			);

/** The positioned line drawn across deleted content spanning an unbounded range. */
export const getDeletedContentStyleUnbounded = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? getDeletedContentStyleUnboundedNext(colorScheme, isActive)
		: getDeletedContentStyleUnboundedLegacy(getLegacyColorScheme(colorScheme), isActive);

/** Inline style for inserted content. */
export const getInsertedContentStyle = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	hideAddedDiffsUnderline: boolean = false,
): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? getInsertedContentStyleNext(colorScheme, isActive, hideAddedDiffsUnderline)
		: getInsertedContentStyleLegacy(
				getLegacyColorScheme(colorScheme),
				isActive,
				hideAddedDiffsUnderline,
			);

/** Inline style for deleted content. */
export const getDeletedContentStyle = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	diffType?: DiffType,
	// Set while the reveal animation is running: it paints the highlight itself so it can wipe it in
	// left-to-right, and a static background here would leave nothing to reveal.
	omitHighlight: boolean = false,
): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? getDeletedContentStyleNext(colorScheme, isActive, diffType, omitHighlight)
		: getDeletedContentStyleLegacy(
				getLegacyColorScheme(colorScheme),
				isActive,
				diffType,
				omitHighlight,
			);

/**
 * Overlay style for one added or deleted table cell. Invariant across the cells of a table, so the
 * `querySelectorAll('td, th')` loop in `wrapBlockNodeView.ts` resolves it once.
 */
export const resolveCellOverlayStyle = (args: {
	colorScheme?: ColorScheme;
	isInserted: boolean;
	isRoundedTable: boolean;
}): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? resolveCellOverlayStyleNext(args)
		: resolveCellOverlayStyleLegacy({
				...args,
				colorScheme: getLegacyColorScheme(args.colorScheme),
			});

/** Inner style for the "Removed" lozenge on a deleted block node. */
export const resolveRemovedLozengeStyle = (
	colorScheme: ColorScheme | undefined,
	isActive: boolean,
): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? resolveRemovedLozengeStyleNext(colorScheme, isActive)
		: resolveRemovedLozengeStyleLegacy(getLegacyColorScheme(colorScheme), isActive);

/**
 * Style for inserted content nested inside a multi-container or list node — the `decisionList` and
 * `taskList` `li`s and the `layoutSection` columns. Scheme-independent: see
 * `nestedContentScheme` above.
 */
export const resolveNestedInsertedNodeStyle = (): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? resolveNestedInsertedNodeStyleNext()
		: resolveNestedInsertedNodeStyleLegacy();

/**
 * Whether the colour scheme draws a resting (non-active) ring on a deleted media/embed node, which
 * is what the `show-diff-deleted-outline-new` class styles in editor-core's smartCardStyles.
 */
export const hasRestingDeletedRing = (colorScheme?: ColorScheme): boolean =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? hasRestingDeletedRingNext(colorScheme)
		: hasRestingDeletedRingLegacy(getLegacyColorScheme(colorScheme));

/**
 * Custom properties consumed by the `show-diff-deleted-node-vars` selectors in editor-core.
 *
 * No `*Legacy` counterpart: the OFF cohort emits no properties at all and takes its colours from the
 * per-scheme selectors instead, so the gate lives at the single caller in `wrapBlockNodeView`.
 */
export const resolveDeletedNodeCSSVariables = (colorScheme?: ColorScheme): string =>
	buildDeletedNodeCSSVariables(getColorScheme(colorScheme));
