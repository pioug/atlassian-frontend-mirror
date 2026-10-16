import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

import { getDarkModeLCHColor } from '@atlaskit/adf-schema/get-dark-mode-lch-color';
import { isRgb } from '@atlaskit/adf-schema/is-rgb';
import { rgbToHex } from '@atlaskit/adf-schema/rgb-to-hex';
import { getCellDomAttrs } from '@atlaskit/adf-schema/tableNodes';
import { convertToInlineCss } from '@atlaskit/editor-common/css-helper';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import type { RevealOptions } from '../../showDiffPluginType';
import type { NodeViewSerializer } from '../NodeViewSerializer';
import type { ColorScheme } from './colorSchemes/types';
import { createBlockChangedDecoration } from './createBlockChangedDecoration';
import type { ContributorTagMountContext } from './createContributorTagWidget';
import { createInlineChangedDecoration } from './createInlineChangedDecoration';
import { buildDiffDecorationSpec } from './decorationKeys';
import {
	isCellAttrChanged,
	isCellBackgroundChanged,
	normalizeCellBackground,
} from './utils/cellAttrs';
import { injectInnerWrapper, wrapBlockNodeView } from './utils/wrapBlockNodeView';

const CELL_TYPE_NAMES = ['tableCell', 'tableHeader'];

export type ReplacedCell = {
	/** The live cell in the displayed document. */
	liveCell: PMNode;
	liveCellPos: number;
	/** The other side's cell, from the replaced slice. */
	otherCell: PMNode;
};

/**
 * Pairs each cell of a whole-cell replacement with the live cell it replaces, or `[]` when the slice
 * is not a run of whole cells matching the live ones. Whole-cell replacement preserves cell count and
 * order, so the nth live cell in the range matches the nth cell in the slice.
 */
export const getReplacedCells = ({
	slice,
	doc,
	fromB,
	toB,
}: {
	doc: PMNode;
	fromB: number;
	slice: Slice;
	toB: number;
}): ReplacedCell[] => {
	const otherCells = slice.content.content;
	if (
		slice.openStart !== 0 ||
		slice.openEnd !== 0 ||
		otherCells.length === 0 ||
		!otherCells.every((node) => CELL_TYPE_NAMES.includes(node.type.name))
	) {
		return [];
	}

	const liveCells: Array<{ node: PMNode; pos: number }> = [];
	doc.nodesBetween(fromB, toB, (node, pos) => {
		if (CELL_TYPE_NAMES.includes(node.type.name)) {
			liveCells.push({ node, pos });
			return false;
		}
		return true;
	});
	if (liveCells.length !== otherCells.length) {
		return [];
	}

	return otherCells.map((otherCell, index) => ({
		otherCell,
		liveCell: liveCells[index].node,
		liveCellPos: liveCells[index].pos,
	}));
};

/**
 * Whether two cells hold the same content, ignoring the cells' own attributes and `localId`s, which
 * a suggestion can regenerate. Such a replacement only changed the cell (e.g. its background), so
 * there is no content to diff.
 */
const isCellContentEqual = (left: PMNode, right: PMNode): boolean => {
	if (left.childCount !== right.childCount) {
		return false;
	}
	for (let index = 0; index < left.childCount; index++) {
		if (!areNodesEqualIgnoreAttrs(left.child(index), right.child(index), ['localId'])) {
			return false;
		}
	}
	return true;
};

/**
 * Whether the cell itself changed — its type, or an attribute that represents a change such as its
 * background or span — as opposed to only its content.
 */
const isCellChanged = (left: PMNode, right: PMNode): boolean =>
	left.type !== right.type || isCellAttrChanged(left, right);

/**
 * A custom (non-palette) cell colour as the schema renders it: inverted in dark mode so text stays
 * readable, except for design tokens, which are already themed.
 */
const getCustomCellColor = (background: string): string => {
	const color = (isRgb(background) && rgbToHex(background)) || background;
	if (
		color.startsWith('var(') ||
		document.documentElement.getAttribute('data-color-mode') !== 'dark'
	) {
		return background;
	}
	return getDarkModeLCHColor(color);
};

/**
 * The colour `cell` renders with. A palette colour is the editor's own themed variable for its colour
 * name (e.g. for dark mode), the one `td[colorname]` cells use; a custom colour is the schema's own
 * treatment of it; no colour is the editor's default.
 */
const getCellBackgroundColor = (cell: PMNode): string => {
	const background = normalizeCellBackground(cell.attrs.background);
	if (!background) {
		return cell.type.name === 'tableHeader'
			? token('color.background.accent.gray.subtlest')
			: token('elevation.surface');
	}
	const { colorname } = getCellDomAttrs(cell);
	return colorname
		? `var(--ak-editor-table-cell-background-${colorname.toLowerCase().split(' ').join('-')})`
		: getCustomCellColor(background);
};

/**
 * A layer painting `color` over the cell's own background and under its content, so the cell reads
 * as having the new background without any of the cell's own attributes being overridden: removing
 * a decoration removes the attributes it set rather than restoring the ones they replaced.
 */
const createCellBackgroundLayer = (color: string): HTMLElement => {
	const layer = document.createElement('div');
	layer.setAttribute('aria-hidden', 'true');
	layer.contentEditable = 'false';
	layer.dataset.testid = 'show-diff-new-cell-background';
	layer.setAttribute(
		'style',
		convertToInlineCss({
			position: 'absolute',
			inset: 0,
			zIndex: -1,
			borderRadius: 'inherit',
			pointerEvents: 'none',
			backgroundColor: color,
		}),
	);
	return layer;
};

/** The other side's cell content, as blocks, for the top of the live cell. */
const createCellContentWidget = ({
	cell,
	pos,
	nodeViewSerializer,
	colorScheme,
	intl,
	isActive,
	isInserted,
	leftAnchorId,
}: {
	cell: PMNode;
	colorScheme?: ColorScheme;
	intl: IntlShape;
	isActive?: boolean;
	isInserted: boolean;
	leftAnchorId?: string;
	nodeViewSerializer: NodeViewSerializer;
	pos: number;
}): Decoration | undefined => {
	const dom = document.createElement('div');
	cell.content.forEach((block) => {
		const nodeView = nodeViewSerializer.tryCreateNodeView(
			block,
			0,
			undefined,
			isInserted,
			colorScheme,
		);
		if (nodeView) {
			wrapBlockNodeView({
				dom,
				nodeView,
				targetNode: block,
				colorScheme,
				intl,
				isActive,
				isInserted,
			});
			return;
		}
		const serialized = nodeViewSerializer.serializeNode(block);
		if (serialized instanceof HTMLElement) {
			dom.append(injectInnerWrapper({ node: serialized, colorScheme, isActive, isInserted }));
		}
	});
	if (dom.childNodes.length === 0) {
		return undefined;
	}
	dom.setAttribute(
		'data-testid',
		isInserted ? 'show-diff-changed-decoration' : 'show-diff-deleted-decoration',
	);

	// Before the cell's own blocks, as a block of its own, so it never lands inside a paragraph the
	// displayed side may hide.
	return Decoration.widget(pos + 1, dom, {
		...buildDiffDecorationSpec({
			colorScheme,
			decorationType: 'widget',
			diffId: crypto.randomUUID(),
			leftAnchorId,
			isActive,
			isInserted,
			side: -1,
		}),
		marks: [],
	});
};

/**
 * The other side of a whole-cell replacement, drawn inside the live cells so the table keeps its
 * shape: each live cell takes the other cell's background when it differs, and its content when that
 * differs. A cell whose content did not change has nothing to diff.
 */
export const createReplacedCellWidgets = ({
	slice,
	newDoc,
	change,
	nodeViewSerializer,
	colorScheme,
	intl,
	isActive,
	isInserted,
	leftAnchorId,
}: {
	change: Pick<Change, 'fromB' | 'toB'>;
	colorScheme?: ColorScheme;
	intl: IntlShape;
	isActive?: boolean;
	isInserted: boolean;
	leftAnchorId?: string;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	slice: Slice;
}): Decoration[] =>
	getReplacedCells({ slice, doc: newDoc, fromB: change.fromB, toB: change.toB }).flatMap(
		({ otherCell, liveCell, liveCellPos }) => {
			const decorations: Decoration[] = [];
			if (isInserted && isCellBackgroundChanged(otherCell, liveCell)) {
				const cellEnd = liveCellPos + liveCell.nodeSize;
				decorations.push(
					// The cell becomes the layer's stacking context, so the layer sits above the cell's own
					// background rather than behind it. Through `z-index` at the cell overlay's own level, not
					// `isolation`: an isolated cell would trap its overlay below later cells, which then cover
					// the overlay's outline where it overlaps their border. Properties the cell never sets, so
					// removing them takes nothing of its own.
					Decoration.node(
						liveCellPos,
						cellEnd,
						{
							style: convertToInlineCss({
								position: 'relative',
								// The highest z-index a cell diff overlay takes (the rounded-corner variant).
								zIndex: 2,
							}),
						},
						{ key: `show-diff-new-cell-background-host-${liveCellPos}` },
					),
					// At the cell's end, beside its diff overlay, so the cell's first block stays its first child.
					Decoration.widget(
						cellEnd - 1,
						createCellBackgroundLayer(getCellBackgroundColor(otherCell)),
						{
							key: `show-diff-new-cell-background-${liveCellPos}`,
							side: -1,
							marks: [],
							ignoreSelection: true,
						},
					),
				);
			}
			if (!isCellContentEqual(otherCell, liveCell)) {
				const contentWidget = createCellContentWidget({
					cell: otherCell,
					pos: liveCellPos,
					nodeViewSerializer,
					colorScheme,
					intl,
					isActive,
					isInserted,
					leftAnchorId,
				});
				if (contentWidget) {
					decorations.push(contentWidget);
				}
			}
			return decorations;
		},
	);

/**
 * The displayed side of a whole-cell replacement. A table cell is never removed on its own, only
 * replaced in place, so a live cell is never hidden — hiding it would leave the row a cell short. It
 * takes the changed-cell treatment only when the cell itself changed; its content is diffed, and
 * hidden in the clean view, only when that changed. A cell whose content stayed the same keeps
 * showing it.
 */
export const createReplacedCellDecorations = ({
	replacedCells,
	change,
	doc,
	attributionKey,
	colorScheme,
	hasDeletedWidget,
	hideAddedDiffsUnderline,
	isActive,
	isDeletedWidgetBelow,
	isInserted,
	leftAnchorId,
	reveal,
	shouldHideDeleted,
	showContributorTags,
	showIndicators,
	tagMountContext,
}: {
	attributionKey?: string;
	change: Pick<Change, 'fromA' | 'toA' | 'fromB' | 'toB'>;
	colorScheme?: ColorScheme;
	doc: PMNode;
	hasDeletedWidget?: boolean;
	hideAddedDiffsUnderline?: boolean;
	isActive?: boolean;
	isDeletedWidgetBelow?: boolean;
	isInserted: boolean;
	leftAnchorId?: string;
	replacedCells: ReplacedCell[];
	reveal?: RevealOptions;
	shouldHideDeleted?: boolean;
	showContributorTags?: boolean;
	showIndicators?: boolean;
	tagMountContext?: ContributorTagMountContext;
}): Decoration[] =>
	replacedCells.flatMap(({ otherCell, liveCell, liveCellPos }) => {
		const cellEnd = liveCellPos + liveCell.nodeSize;
		const decorations = isCellChanged(otherCell, liveCell)
			? createBlockChangedDecoration({
					attributionKey,
					change: { from: liveCellPos, to: cellEnd, name: liveCell.type.name },
					colorScheme,
					doc,
					isActive,
					// The cell stays either way, so it reads as changed, not removed.
					isInserted: true,
					leftAnchorId,
					showContributorTags,
					showIndicators,
					tagMountContext,
				})
			: [];
		if (isCellContentEqual(otherCell, liveCell)) {
			return decorations;
		}

		decorations.push(
			...createInlineChangedDecoration({
				attributionKey,
				change: { ...change, fromB: liveCellPos, toB: cellEnd },
				colorScheme,
				doc,
				hasDeletedWidget,
				hideAddedDiffsUnderline,
				isActive,
				isDeletedWidgetBelow,
				isInserted,
				leftAnchorId,
				reveal,
				shouldHideDeleted,
				showContributorTags,
				showIndicators,
				tagMountContext,
			}),
		);
		if (shouldHideDeleted) {
			liveCell.forEach((block, offset) => {
				const blockPos = liveCellPos + 1 + offset;
				decorations.push(
					...createBlockChangedDecoration({
						change: { from: blockPos, to: blockPos + block.nodeSize, name: block.type.name },
						colorScheme,
						doc,
						isActive,
						isInserted,
						leftAnchorId,
						shouldHideDeleted,
					}),
				);
			});
		}
		return decorations;
	});
