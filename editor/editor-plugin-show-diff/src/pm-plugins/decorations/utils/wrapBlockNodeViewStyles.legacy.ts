/**
 * Pre-refactor code preserved for the OFF cohort of
 * `platform_editor_show_diff_color_scheme_refactor`.
 *
 * These resolvers hold the per-scheme style decisions that `wrapBlockNodeView.ts` made before the
 * `colorSchemeRegistry` + `factory.ts` migration. Standard deleted styles are resolved at runtime
 * only so the ADF-safety gate can select the equivalent longhand; with that gate off, their CSS
 * remains unchanged. Delete this file at experiment cleanup, together with
 * `colorSchemes/standard.ts`, `colorSchemes/traditional.ts` (EDITOR-8281).
 */
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { ColorScheme, DiffType } from '../../../showDiffPluginType';
import { isExtendedEnabled } from '../../isExtendedEnabled';
import {
	deletedBlockOutline,
	deletedBlockOutlineActive,
	deletedBlockOutlineRounded,
	deletedBlockOutlineRoundedActive,
	deletedContentStyleUnbounded,
	deletedInlineContentStyleExtended,
	deletedStyleQuoteNodeWithLozenge,
	deletedStyleQuoteNodeWithLozengeActive,
	editingContentStyleInBlockExtended,
	editingContentStyleInBlockExtendedNoUnderline,
	editingStyleExtended,
	editingStyleExtendedNoUnderline,
	editingStyleActiveExtended,
	editingStyleActiveExtendedNoUnderline,
	editingStyleNode,
	getStandardDeletedContentStyleActive,
	getStandardDeletedContentStyleNew,
	addedCellOverlayStyle,
	addedCellOverlayRoundedStyle,
	deletedCellOverlayStyle,
	deletedCellOverlayRoundedStyle,
} from '../colorSchemes/standard';
import {
	deletedTraditionalBlockOutlineActive,
	deletedTraditionalBlockOutlineNew,
	deletedTraditionalBlockOutlineRoundedActive,
	deletedTraditionalBlockOutlineRoundedNew,
	deletedTraditionalContentStyleUnbounded,
	deletedTraditionalContentStyleUnboundedActive,
	getDeletedTraditionalInlineStyle,
	deletedTraditionalStyleQuoteNode,
	deletedTraditionalStyleQuoteNodeActive,
	traditionalInsertStyle,
	traditionalInsertStyleActive,
	traditionalStyleNodeActive,
	traditionalStyleNodeNew,
	traditionalAddedCellOverlayRoundedStyle,
	traditionalAddedCellOverlayStyleNew,
	deletedTraditionalCellOverlayStyle,
	deletedTraditionalCellOverlayRoundedStyle,
} from '../colorSchemes/traditional';

const lozengeStyle = convertToInlineCss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	position: 'static',
	blockSize: 'min-content',
	borderRadius: token('radius.small'),
	overflow: 'hidden',
	paddingInlineStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	backgroundColor: token('color.background.accent.gray.subtler'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text.warning.inverse'),
});

const lozengeStyleActiveStandard = convertToInlineCss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	position: 'static',
	blockSize: 'min-content',
	borderRadius: token('radius.small'),
	overflow: 'hidden',
	paddingInlineStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	backgroundColor: token('color.background.accent.red.subtler.pressed'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text.warning.inverse'),
});

const lozengeStyleActiveTraditional = convertToInlineCss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	position: 'static',
	blockSize: 'min-content',
	borderRadius: token('radius.small'),
	overflow: 'hidden',
	paddingInlineStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	backgroundColor: token('color.background.accent.red.subtler.pressed'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: token('color.text.warning.inverse'),
});

/**
 * Frozen copies of the two node-name predicates `getChangedNodeStyle` branched on pre-refactor.
 * The live copies are exported from `./wrapBlockNodeViewStyles`; these exist so this module stays
 * self-contained (and so the OFF cohort keeps the exact pre-refactor classification) and go away
 * with the rest of the file at cleanup.
 */
const isMultiContainerBlockNode = (nodeName: string): boolean => {
	return ['decisionList', 'layoutSection'].includes(nodeName);
};

const isTextLikeBlockNode = (nodeName: string): boolean => {
	return ['heading', 'bulletList', 'orderedList', 'listItem', 'taskList', 'blockquote'].includes(
		nodeName,
	);
};

/** Pre-refactor inline content style for a changed (inserted or deleted) block node. */
export const getChangedContentStyleLegacy = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	isInserted: boolean = false,
	diffType?: DiffType,
	hideAddedDiffsUnderline: boolean = false,
): string => {
	if (isExtendedEnabled(diffType) && isInserted) {
		if (colorScheme === 'traditional') {
			return isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
		}
		return isActive
			? hideAddedDiffsUnderline
				? editingStyleActiveExtendedNoUnderline
				: editingStyleActiveExtended
			: hideAddedDiffsUnderline
				? editingStyleExtendedNoUnderline
				: editingStyleExtended;
	}
	if (colorScheme === 'traditional') {
		return getDeletedTraditionalInlineStyle(isActive);
	}
	if (isActive) {
		return getStandardDeletedContentStyleActive();
	}
	return getStandardDeletedContentStyleNew();
};

/** Pre-refactor node-specific style for a changed block node. */
export const getChangedNodeStyleLegacy = (
	nodeName: string,
	colorScheme?: ColorScheme,
	isInserted: boolean = false,
	isActive: boolean = false,
	diffType?: DiffType,
	hideAddedDiffsUnderline: boolean = false,
): string | undefined => {
	const isTraditional = colorScheme === 'traditional';

	if (isExtendedEnabled(diffType) && isInserted) {
		if (isMultiContainerBlockNode(nodeName)) {
			return hideAddedDiffsUnderline || fg('platform_editor_ai_show_diff_patch_1')
				? editingContentStyleInBlockExtendedNoUnderline
				: editingContentStyleInBlockExtended;
		}
		if (isTextLikeBlockNode(nodeName)) {
			return undefined;
		}
		if (isTraditional) {
			return isActive ? traditionalStyleNodeActive : traditionalStyleNodeNew;
		}
		return editingStyleNode;
	}

	switch (nodeName) {
		case 'blockquote':
			if (isTraditional) {
				return isActive ? deletedTraditionalStyleQuoteNodeActive : deletedTraditionalStyleQuoteNode;
			}
			return isActive ? deletedStyleQuoteNodeWithLozengeActive : deletedStyleQuoteNodeWithLozenge;
		case 'expand':
		case 'decisionList':
			if (isTraditional) {
				return isActive ? deletedTraditionalBlockOutlineActive : deletedTraditionalBlockOutlineNew;
			}
			return isActive ? deletedBlockOutlineActive : deletedBlockOutline;
		case 'panel':
		case 'codeBlock':
			if (isTraditional) {
				return isActive
					? deletedTraditionalBlockOutlineRoundedActive
					: deletedTraditionalBlockOutlineRoundedNew;
			}
			return isActive ? deletedBlockOutlineRoundedActive : deletedBlockOutlineRounded;
		default:
			return undefined;
	}
};

/** Pre-refactor unbounded strikethrough line for deleted content. */
export const getDeletedContentStyleUnboundedLegacy = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
): string => {
	if (colorScheme === 'traditional' && isActive) {
		return deletedTraditionalContentStyleUnboundedActive;
	}
	return colorScheme === 'traditional'
		? deletedTraditionalContentStyleUnbounded
		: deletedContentStyleUnbounded;
};

/** Pre-refactor inline style for inserted content. */
export const getInsertedContentStyleLegacy = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	hideAddedDiffsUnderline: boolean = false,
): string => {
	if (colorScheme === 'traditional') {
		return isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
	}
	if (isActive) {
		return hideAddedDiffsUnderline
			? editingStyleActiveExtendedNoUnderline
			: editingStyleActiveExtended;
	}
	return hideAddedDiffsUnderline ? editingStyleExtendedNoUnderline : editingStyleExtended;
};

/** Pre-refactor inline style for deleted content. */
export const getDeletedContentStyleLegacy = (
	colorScheme?: ColorScheme,
	isActive: boolean = false,
	diffType?: DiffType,
	// The reveal animation paints the highlight itself so it can wipe it in; a static one here would
	// cover the whole span and leave nothing to reveal. Mirrors the same option on the Next variant.
	omitHighlight: boolean = false,
): string => {
	if (colorScheme === 'traditional') {
		return getDeletedTraditionalInlineStyle(isActive);
	}
	if (isExtendedEnabled(diffType) && !omitHighlight) {
		return (
			(isActive ? getStandardDeletedContentStyleActive() : getStandardDeletedContentStyleNew()) +
			deletedInlineContentStyleExtended
		);
	}
	return isActive ? getStandardDeletedContentStyleActive() : getStandardDeletedContentStyleNew();
};

/**
 * Pre-refactor table-cell overlay style, as chosen inside the `querySelectorAll('td, th')` loop of
 * `applyCellOverlayStyles`. The choice does not vary per cell, so hoisting it out of the loop is
 * behaviour-preserving.
 *
 * NOTE: not interchangeable with the same-named resolver in
 * `createChangedRowDecorationWidgets.styles.legacy.ts`. The two pre-refactor call sites disagreed
 * for the traditional non-rounded added cell — the nodeview path (here) used
 * `traditionalAddedCellOverlayStyleNew`, the row-widget path used `traditionalAddedCellOverlayStyle`.
 * Preserved as-is.
 */
export const resolveCellOverlayStyleLegacy = ({
	colorScheme,
	isInserted,
	isRoundedTable,
}: {
	colorScheme?: ColorScheme;
	isInserted: boolean;
	isRoundedTable: boolean;
}): string => {
	const isTraditional = colorScheme === 'traditional';

	const deletedCellStyle = isTraditional
		? isRoundedTable
			? deletedTraditionalCellOverlayRoundedStyle
			: deletedTraditionalCellOverlayStyle
		: isRoundedTable
			? deletedCellOverlayRoundedStyle
			: deletedCellOverlayStyle;

	const addedCellStyle = isTraditional
		? isRoundedTable
			? traditionalAddedCellOverlayRoundedStyle
			: traditionalAddedCellOverlayStyleNew
		: isRoundedTable
			? addedCellOverlayRoundedStyle
			: addedCellOverlayStyle;

	return isInserted ? addedCellStyle : deletedCellStyle;
};

/** Pre-refactor inner style for the "Removed" lozenge on a deleted block node. */
export const resolveRemovedLozengeStyleLegacy = (
	colorScheme: ColorScheme | undefined,
	isActive: boolean,
): string =>
	isActive && colorScheme === 'traditional'
		? lozengeStyleActiveTraditional
		: isActive
			? lozengeStyleActiveStandard
			: lozengeStyle;

/**
 * Pre-refactor style for inserted content nested inside a multi-container or list node (the
 * `decisionList` / `layoutSection` / `taskList` children). Always the standard scheme's node
 * outline, in every colour scheme.
 */
export const resolveNestedInsertedNodeStyleLegacy = (): string => editingStyleNode;

/**
 * Pre-refactor scheme predicate behind `maybeAddDeletedOutlineNewClass`. The `!isActive` half of
 * the original condition stays at the call site in `wrapBlockNodeView.ts`.
 */
export const hasRestingDeletedRingLegacy = (colorScheme?: ColorScheme): boolean =>
	colorScheme === 'traditional';
