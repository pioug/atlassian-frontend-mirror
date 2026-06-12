import type { RichMediaLayout } from '@atlaskit/adf-schema';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { breakoutWideScaleRatio } from '@atlaskit/editor-shared-styles';

import { floatingLayouts } from '../utils/floatingLayouts';

import { calcMediaSingleMaxWidth } from './calcMediaSingleMaxWidth';
import { wrappedLayouts } from './constants';
import { getMediaSingleInitialWidth } from './getMediaSingleInitialWidth';

export interface calcMediaSinglePixelWidthProps {
	containerWidth: number;
	contentWidth?: number;
	gutterOffset: number;
	layout: RichMediaLayout;
	origWidth: number;
	width?: number;
	widthType?: 'percentage' | 'pixel';
}
/**
 * Convert width attribute to pixel value for legacy (resized or not resisized) and new media single node for new experience
 * @param width node width attribute
 * @param widthType node widthType attribute
 * @param origWidth original media width
 * @param layout node layout attribute
 * @param contentWidth editor content width
 * @param containerWidth editor container width
 * @param gutterOffset gap between resizer handle and media
 * @returns pixel width of the node
 */
export const calcMediaSinglePixelWidth = ({
	width,
	widthType = 'percentage',
	origWidth,
	layout,
	contentWidth,
	containerWidth,
	gutterOffset = 0,
}: calcMediaSinglePixelWidthProps): number => {
	if (widthType === 'pixel' && width) {
		return width;
	}

	switch (layout) {
		case 'wide':
			return calcLegacyWideWidth(containerWidth, origWidth, contentWidth);
		case 'full-width':
			// legacy and new experience have different definitions of full-width,
			// since it's for new experience, we convert to the new definition
			return calcMediaSingleMaxWidth(containerWidth);
		default:
			if (width) {
				return Math.ceil(
					((contentWidth || containerWidth) + gutterOffset) * (width / 100) - gutterOffset,
				);
			}
	}

	// Handle the case of not resized node with wrapped layout
	// It's possible that the node is first inserted with align layout (e.g. jira)
	// in which the legacy image would render the width as min(origWidth, halfContentWidth).
	// However, new experience won't be able to distinguish the two. Thus, we render halfContentWidth
	// to make sure confluence legacy node is renderered correctly
	if (wrappedLayouts.includes(layout)) {
		return Math.ceil((contentWidth || containerWidth) / 2);
	}

	// set initial width for not resized legacy image
	return getMediaSingleInitialWidth(
		origWidth,
		// in case containerWidth is 0, we fallback to undefined to use akEditorDefaultLayoutWidth
		contentWidth || containerWidth || undefined,
	);
};

/**
 * Calculate pixel width for legacy media single
 * @param contentWidth editor content width
 * @param containerWidth editor container width
 */
const calcLegacyWideWidth = (containerWidth: number, origWidth: number, contentWidth?: number) => {
	if (contentWidth) {
		const wideWidth = Math.ceil(contentWidth * breakoutWideScaleRatio);
		return wideWidth > containerWidth ? contentWidth : wideWidth;
	}
	return origWidth;
};

const calcParentPadding = (view: EditorView, resolvedPos: ResolvedPos) => {
	// since table has constant padding, use hardcoded constant instead of query the dom
	const tablePadding = 8;
	const { tableCell, tableHeader } = view.state.schema.nodes;
	return [tableCell, tableHeader].includes(resolvedPos.parent.type) ? tablePadding * 2 : 0;
};

/**
 * Get parent width for a nested media single node for new experience
 * We don't check for mediaSingle selection in this function.
 * @param view Editor view
 * @param pos node position
 * @param forInsertion for insertion
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getMaxWidthForNestedNodeNext = (
	view: EditorView,
	pos: number | undefined,
	forInsertion?: boolean,
): number | null => {
	if (typeof pos !== 'number') {
		return null;
	}
	const $pos = view.state.doc.resolve(pos);
	if ($pos && $pos.parent.type.name !== 'doc') {
		return forInsertion
			? getParentWidthForNestedMediaSingleNodeForInsertion($pos, view)
			: getParentWidthForNestedMediaSingleNode($pos, view);
	}

	return null;
};

/**
 * Get parent content width for nested media single node.
 * @param resolvedPos resolved Position of the node
 * @param view editor view
 * @returns parent content width for nested node
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getParentWidthForNestedMediaSingleNode = (
	resolvedPos: ResolvedPos,
	view: EditorView,
): number | null => {
	const domNode = view.nodeDOM(resolvedPos.pos);

	if (
		resolvedPos.nodeAfter &&
		floatingLayouts.includes(resolvedPos.nodeAfter.attrs.layout) &&
		domNode &&
		domNode.parentElement
	) {
		const parentPadding = calcParentPadding(view, resolvedPos);

		return domNode.parentElement.offsetWidth - parentPadding;
	}

	if (domNode instanceof HTMLElement) {
		return domNode.offsetWidth;
	}

	return null;
};

/**
 * Get parent width for nested media single nodes
 * @param resolvedPos resolved Position of the node
 * @param view editor view
 * @returns parent width used for media single initial width on insertion
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getParentWidthForNestedMediaSingleNodeForInsertion = (
	resolvedPos: ResolvedPos,
	view: EditorView,
): number | null => {
	const parentPos = resolvedPos.before(resolvedPos.depth);
	const parentDomNode = view.nodeDOM(parentPos);

	const parentPadding = calcParentPadding(view, resolvedPos);

	if (parentDomNode instanceof HTMLElement) {
		return parentDomNode.offsetWidth - parentPadding;
	}
	return null;
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getMediaSinglePixelWidth } from './getMediaSinglePixelWidth';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calcMediaSingleMaxWidth } from './calcMediaSingleMaxWidth';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getMediaSingleInitialWidth } from './getMediaSingleInitialWidth';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calculateOffsetLeft } from './calculateOffsetLeft';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { roundToNearest } from './roundToNearest';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calcMinWidth } from './calcMinWidth';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getMaxWidthForNestedNode } from './getMaxWidthForNestedNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { currentMediaNodeWithPos } from './currentMediaNodeWithPos';
