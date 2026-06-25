import { GapCursorSelection } from '@atlaskit/editor-common/selection';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TextSelection, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const getMaybeLayoutSection = (state: EditorState): ContentNodeWithPos | undefined => {
	const {
		schema: {
			nodes: { layoutSection, layoutColumn },
		},
		selection,
	} = state;
	const isLayoutColumn =
		editorExperiment('advanced_layouts', true) && findSelectedNodeOfType([layoutColumn])(selection);

	// When selection is on layoutColumn, we want to hide floating toolbar, hence don't return layoutSection node here
	return isLayoutColumn
		? undefined
		: findParentNodeOfType(layoutSection)(selection) ||
				findSelectedNodeOfType([layoutSection])(selection);
};

/**
 * The depth of the layout column inside the layout section.
 * As per the current implementation, the layout column ALWAYS has a depth of 1.
 */
const LAYOUT_COLUMN_DEPTH = 1;

/**
 * This helper function is used to select a position inside a layout section.
 * @param view editor view instance
 * @param posOfLayout the starting position of the layout
 * @param childIndex the index of the child node in the layout section
 * @returns Transaction or undefined
 */
export const selectIntoLayout = (
	view: EditorView,
	posOfLayout: number,
	childIndex: number = 0,
): Transaction | undefined => {
	const $maybeLayoutSection = view.state.doc.resolve(posOfLayout);
	if ($maybeLayoutSection.nodeAfter?.type.name === 'layoutSection') {
		const layoutSectionNode = $maybeLayoutSection.nodeAfter;

		// check if the childIndex is valid
		if (childIndex < 0 || childIndex >= layoutSectionNode.childCount) {
			return;
		}

		const childPos = $maybeLayoutSection.posAtIndex(childIndex, LAYOUT_COLUMN_DEPTH);

		const tr = view.state.tr;
		const $selectionPos = tr.doc.resolve(childPos);

		if (layoutSectionNode.firstChild?.type.name === 'paragraph') {
			view.dispatch(tr.setSelection(TextSelection.near($selectionPos)));
		} else {
			view.dispatch(tr.setSelection(GapCursorSelection.near($selectionPos)));
		}
		return tr;
	}
};

export type GapCursorTarget = { pos: number; side: 'left' | 'right' };

/**
 * For a blank-space click inside a layout column — above the first child (middle/bottom-aligned
 * columns) or below the last child (any alignment) — return the ProseMirror position and side
 * for a gap cursor. Returns `undefined` when the kill switch is ON, the click is outside a
 * layoutColumn, or the Y coordinate is not in blank space.
 *
 * The `advanced_layouts` / `platform_editor_layout_column_menu` gates live in the caller
 * (`applyBlankSpaceGapCursor`); only the kill switch is checked here.
 */
export const getGapCursorTargetForBlankSpaceClick = (
	view: EditorView,
	event: MouseEvent,
): GapCursorTarget | undefined => {
	if (fg('platform_editor_layout_column_menu_kill_switch_1')) {
		return undefined;
	}

	// Resolve the column from the DOM target so it works even when posAtCoords returns null
	// (nothing rendered at the clicked Y).
	const target = event.target as Element | null;
	const columnEl = target?.closest('[data-layout-column]');
	if (!columnEl) {
		return undefined;
	}

	let columnStartPos: number;
	try {
		columnStartPos = view.posAtDOM(columnEl, 0);
	} catch {
		return undefined;
	}

	// posAtDOM resolves at varying depths, so walk up to find the layoutColumn.
	const $columnStart = view.state.doc.resolve(columnStartPos);
	let depth = -1;
	for (let d = $columnStart.depth; d >= 0; d--) {
		if ($columnStart.node(d).type.name === 'layoutColumn') {
			depth = d;
			break;
		}
	}

	if (depth < 0) {
		return undefined;
	}

	const columnNode = $columnStart.node(depth);

	if (columnNode.childCount === 0) {
		return undefined;
	}

	const columnContentStart = $columnStart.start(depth);
	const columnEndPos = $columnStart.end(depth);

	const getChildDom = (nodePos: number): Element | null => {
		try {
			const dom = view.nodeDOM(nodePos);
			return dom instanceof Element ? dom : null;
		} catch {
			return null;
		}
	};

	const valign = columnNode.attrs?.valign as string | undefined;
	const isNonTopAligned = valign && valign !== 'top';

	// Use the column rect (not child rects) for above/below detection: it stays stable as
	// gap-cursor widgets shift child DOM positions between repeated clicks.
	const columnRect = columnEl.getBoundingClientRect();

	// Click ABOVE the first child (only for middle/bottom-aligned columns).
	const firstChildPos = columnContentStart;
	const firstChildDom = getChildDom(firstChildPos);
	if (isNonTopAligned && firstChildDom) {
		const rect = firstChildDom.getBoundingClientRect();
		if (event.clientY < rect.top && event.clientY >= columnRect.top) {
			return { pos: firstChildPos, side: 'left' };
		}
	}

	// Click BELOW the last child (for any column alignment).
	const lastChild = columnNode.lastChild;
	const lastChildEndPos = columnEndPos;
	const lastChildStartPos = lastChild ? lastChildEndPos - lastChild.nodeSize : columnContentStart;
	const lastChildDom = lastChild ? getChildDom(lastChildStartPos) : null;
	if (lastChild && lastChildDom) {
		const rect = lastChildDom.getBoundingClientRect();
		if (event.clientY > rect.bottom && event.clientY <= columnRect.bottom) {
			return { pos: lastChildEndPos, side: 'right' };
		}
	}

	// Fallback: click lands ON a single atomic child that fills the column (mediaSingle/expand),
	// so the above/below checks never fired.
	if (columnNode.childCount === 1) {
		const onlyChild = columnNode.firstChild;
		// Exclude `panel`: its wrapper makes `view.nodeDOM` non-null and intercepts clicks, so the
		// guard below would wrongly fire for in-panel blank-space clicks (which have their own
		// native gap cursor).
		if (onlyChild && onlyChild.type.name !== 'paragraph' && onlyChild.type.name !== 'panel') {
			// Bail when the click is on the child's own content. For media the wrapper is full-width
			// so test against the <img> rect; resolve it only for a direct mediaSingle child (else
			// getContentRect could grab an image nested in an expand and break its toggle).
			const contentRect =
				onlyChild.type.name === 'mediaSingle' ? getContentRect(firstChildDom) : null;
			if (contentRect) {
				const insideImage =
					event.clientX >= contentRect.left &&
					event.clientX <= contentRect.right &&
					event.clientY >= contentRect.top &&
					event.clientY <= contentRect.bottom;
				if (insideImage) {
					return undefined;
				}
			} else {
				// Other atomics: bail when posAtCoords resolves strictly inside the node range.
				let coordPos: { inside: number; pos: number } | null = null;
				try {
					coordPos = view.posAtCoords({ left: event.clientX, top: event.clientY });
				} catch {
					coordPos = null;
				}
				if (coordPos && coordPos.pos > firstChildPos && coordPos.pos < lastChildEndPos) {
					return undefined;
				}
			}

			// Fire when the child DOM is resolvable, or when it's null (media not yet loaded) but
			// the click target is the column itself (no node view intercepted it).
			const targetEl = event.target as Element | null;
			const targetIsColumn = targetEl === columnEl;
			const shouldUseFallback = firstChildDom !== null || targetIsColumn;
			if (shouldUseFallback) {
				const side = getGapCursorSideForBlankSpaceClick(
					firstChildDom,
					columnRect,
					event.clientX,
					event.clientY,
				);
				return side === 'left'
					? { pos: firstChildPos, side: 'left' }
					: { pos: lastChildEndPos, side: 'right' };
			}
		}
	}

	return undefined;
};

/**
 * The tight `<img>` content rect (or `null`). The outer wrapper often fills the whole column
 * width, so the `<img>` rect is needed to tell "beside the image" from "on the image".
 */
const getContentRect = (firstChildDom: Element | null): DOMRect | null => {
	const img = firstChildDom?.querySelector('img');
	return img ? img.getBoundingClientRect() : null;
};

/**
 * Which side of an atomic child a blank-space click belongs to. Prefers the tight content (image)
 * rect when available — using its midpoint so it's direction-agnostic (handles RTL right-aligned
 * images) — otherwise falls back to the column's vertical midpoint.
 */
const getGapCursorSideForBlankSpaceClick = (
	firstChildDom: Element | null,
	columnRect: DOMRect,
	clientX: number,
	clientY: number,
): 'left' | 'right' => {
	const contentRect = getContentRect(firstChildDom);
	if (contentRect) {
		if (clientY < contentRect.top) {
			return 'left';
		}
		if (clientY > contentRect.bottom) {
			return 'right';
		}
		if (clientX < (contentRect.left + contentRect.right) / 2) {
			return 'left';
		}
		return 'right';
	}
	const columnMidY = columnRect.top + columnRect.height / 2;
	return clientY < columnMidY ? 'left' : 'right';
};

/**
 * True when the blank-space click target child is a paragraph, so the caller uses a TextSelection
 * instead of a gap cursor. LEFT inspects the first child, RIGHT the last child.
 */
export const isParagraphBlankSpaceTarget = (
	view: EditorView,
	gapTarget: GapCursorTarget,
): boolean => {
	const { pos, side } = gapTarget;
	const { doc } = view.state;

	try {
		const $pos = doc.resolve(pos);
		const childNode = side === 'left' ? $pos.nodeAfter : $pos.nodeBefore;
		return childNode?.type.name === 'paragraph';
	} catch {
		return false;
	}
};
