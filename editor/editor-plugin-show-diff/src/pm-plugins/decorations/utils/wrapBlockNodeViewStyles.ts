/**
 * Style resolution for the `wrapBlockNodeView` nodeview decorations.
 *
 * Every exported resolver is driven by the `colorSchemeRegistry` + `factory.ts` implementation.
 */
import { convertToInlineCss } from '@atlaskit/editor-common/css-helper';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import {
	buildAddedCellOverlayRoundedStyle,
	buildDeletedCellOverlayRoundedStyle,
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
	buildInsertStyleInBlockExtendedNoUnderline,
	buildInsertStyleNode,
} from '../colorSchemes/factory';
import { colorSchemeRegistry, standardScheme } from '../colorSchemes/schemes';
import type { ColorScheme, DiffColorScheme } from '../colorSchemes/types';

const getColorScheme = (colorScheme: ColorScheme | undefined): DiffColorScheme =>
	colorSchemeRegistry[colorScheme ?? 'standard'];

/**
 * Scheme for the outline of an inserted multi-container block (layouts, decision lists, etc.).
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
	return [
		'paragraph',
		'heading',
		'bulletList',
		'orderedList',
		'listItem',
		'taskList',
		'blockquote',
	].includes(nodeName);
};

/** Inline content style for a changed (inserted or deleted) block node. */
export const getChangedContentStyle = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	isInserted: boolean = false,
	hideAddedDiffsUnderline: boolean = false,
): string => {
	const colors = getColorScheme(colorScheme);

	if (isInserted) {
		return buildInsertedInlineStyle(colors, isActive, hideAddedDiffsUnderline);
	}

	const base = buildDeletedInlineContentStyle(colors, isActive ? 'active' : 'new');

	// Text-like blocks (heading, lists, blockquote) render their deleted content through this
	// getter rather than `getDeletedContentStyle`, so without this they never receive the
	// glyphTint background + underline that plain deleted text already gets.
	if (
		isExperimentEnabled('platform_editor_attributed_version_history') &&
		colors.deletedInlineTreatment === 'glyphTint'
	) {
		return base + buildDeletedInlineContentStyleExtended(colors, isActive);
	}

	return base;
};

/** Node-specific style for a changed block node, or `undefined` when the node type has none. */
export const getChangedNodeStyle = (
	nodeName: string,
	colorScheme?: ColorScheme,
	isInserted: boolean = false,
	isActive: boolean = false,
	hideAddedDiffsUnderline: boolean = false,
): string | undefined => {
	const colors = getColorScheme(colorScheme);

	if (isInserted) {
		if (isMultiContainerBlockNode(nodeName)) {
			return buildInsertStyleInBlockExtendedNoUnderline(nestedContentScheme);
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

/** The positioned line drawn across deleted content spanning an unbounded range. */
export const getDeletedContentStyleUnbounded = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
): string => buildDeletedStrikethroughLine(getColorScheme(colorScheme), isActive);

/** Inline style for inserted content. */
export const getInsertedContentStyle = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	hideAddedDiffsUnderline: boolean = false,
): string =>
	buildInsertedInlineStyle(getColorScheme(colorScheme), isActive, hideAddedDiffsUnderline);

/** Inline style for deleted content. */
export const getDeletedContentStyle = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
): string => {
	const colors = getColorScheme(colorScheme);
	const base = buildDeletedInlineContentStyle(colors, isActive ? 'active' : 'new');

	// glyphTint adds a background highlight and border-bottom over the tint; strikethrough does not.
	const needsExtendedHighlight = colors.deletedInlineTreatment === 'glyphTint';

	return needsExtendedHighlight
		? base + buildDeletedInlineContentStyleExtended(colors, isActive)
		: base;
};

const inheritedCellBorderStyle = convertToInlineCss({ border: 'inherit' });

/**
 * Overlay style for one added or deleted table cell. Invariant across the cells of a table, so the
 * `querySelectorAll('td, th')` loop in `wrapBlockNodeView.ts` resolves it once.
 */
export const resolveCellOverlayStyle = ({
	colorScheme,
	isInserted,
}: {
	colorScheme?: ColorScheme;
	isInserted: boolean;
}): string => {
	const colors = getColorScheme(colorScheme);

	const overlayStyle = isInserted
		? buildAddedCellOverlayRoundedStyle(colors)
		: buildDeletedCellOverlayRoundedStyle(colors);

	if (
		(!isInserted || colors.roundedAddedCellOverlayInheritsBorder) &&
		!isExperimentEnabled('platform_editor_table_diff_overlay_border_fix')
	) {
		return `${overlayStyle} ${inheritedCellBorderStyle}`;
	}
	return overlayStyle;
};

/** Inner style for the "Removed" lozenge on a deleted block node. */
export const resolveRemovedLozengeStyle = (
	colorScheme: ColorScheme | undefined,
	isActive: boolean,
): string => {
	const colors = getColorScheme(colorScheme);
	return isActive ? buildDeletedLozengeActiveStyle(colors) : buildDeletedLozengeStyle(colors);
};

/**
 * Style for inserted content nested inside a multi-container or list node — the `decisionList` and
 * `taskList` `li`s and the `layoutSection` columns.
 */
export const resolveNestedInsertedNodeStyle = (colorScheme?: ColorScheme): string =>
	buildInsertStyleNode(getColorScheme(colorScheme));

/**
 * Whether the colour scheme draws a resting (non-active) ring on a deleted media/embed node, which
 * is what the `show-diff-deleted-outline-new` class styles in editor-core's smartCardStyles.
 */
export const hasRestingDeletedRing = (colorScheme?: ColorScheme): boolean =>
	getColorScheme(colorScheme).deletedNodeEmphasis === 'stateful';

/**
 * Custom properties consumed by the `show-diff-deleted-node-vars` selectors in editor-core.
 */
export const resolveDeletedNodeCSSVariables = (colorScheme?: ColorScheme): string =>
	buildDeletedNodeCSSVariables(getColorScheme(colorScheme));
