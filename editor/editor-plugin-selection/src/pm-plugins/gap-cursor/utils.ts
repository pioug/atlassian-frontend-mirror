import { CAPTION_PLACEHOLDER_ID } from '@atlaskit/editor-common/media-single/constants';
import { Side } from '@atlaskit/editor-common/selection';
import { GapCursorSelection } from '@atlaskit/editor-common/selection/gap-cursor/selection';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import { UnsupportedSharedCssClassName } from '@atlaskit/editor-common/styles/unsupported-content';
import type { Node as PMNode, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

export const isLeftCursor = (side: Side): side is Side.LEFT => side === Side.LEFT;

export function getMediaNearPos(
	doc: PMNode,
	$pos: ResolvedPos,
	schema: Schema,
	dir = -1,
): PMNode | null {
	let $currentPos = $pos;
	let currentNode: PMNode | null = null;
	const { mediaSingle, media, mediaGroup } = schema.nodes;

	do {
		$currentPos = doc.resolve(dir === -1 ? $currentPos.before() : $currentPos.after());

		if (!$currentPos) {
			return null;
		}

		currentNode =
			(dir === -1 ? $currentPos.nodeBefore : $currentPos.nodeAfter) || $currentPos.parent;

		if (!currentNode || currentNode.type === schema.nodes.doc) {
			return null;
		}

		if (
			currentNode.type === mediaSingle ||
			currentNode.type === media ||
			currentNode.type === mediaGroup
		) {
			return currentNode;
		}
	} while ($currentPos.depth > 0);

	return null;
}

export const isTextBlockNearPos = (
	doc: PMNode,
	schema: Schema,
	$pos: ResolvedPos,
	dir: number,
): boolean => {
	let $currentPos = $pos;
	let currentNode: PMNode | null | undefined =
		dir === -1 ? $currentPos.nodeBefore : $currentPos.nodeAfter;

	// If next node is a text or a text block bail out early.
	if (currentNode && (currentNode.isTextblock || currentNode.isText)) {
		return true;
	}

	while ($currentPos.depth > 0) {
		$currentPos = doc.resolve(dir === -1 ? $currentPos.before() : $currentPos.after());

		if (!$currentPos) {
			return false;
		}

		currentNode =
			(dir === -1 ? $currentPos.nodeBefore : $currentPos.nodeAfter) || $currentPos.parent;

		if (!currentNode || currentNode.type === schema.nodes.doc) {
			return false;
		}

		if (currentNode.isTextblock) {
			return true;
		}
	}

	let childNode: PMNode | null | undefined = currentNode;

	while (childNode && childNode.firstChild) {
		childNode = childNode.firstChild;
		if (childNode && (childNode.isTextblock || childNode.isText)) {
			return true;
		}
	}

	return false;
};

export function getLayoutModeFromTargetNode(node: PMNode): string {
	let layout;

	if (node.attrs.layout) {
		layout = node.attrs.layout;
	}

	if (node.marks && node.marks.length) {
		layout = (
			node.marks.find((mark) => mark.type.name === 'breakout') || {
				attrs: { mode: '' },
			}
		).attrs.mode;
	}

	if (node.type.name === 'table' && node.attrs.width) {
		layout = 'fixed-width';
	}

	if (['wide', 'full-width', 'fixed-width'].indexOf(layout) === -1) {
		return '';
	}

	return layout;
}

type ClickContext = {
	nodePos: number;
	view: EditorView;
};

/**
 * Whether `node`, starting at `start`, is an atom whose DOM contains the click target.
 */
const isClickInsideAtom = (
	elem: HTMLElement,
	node: PMNode | null,
	start: number,
	view: EditorView,
): boolean => {
	// ProseMirror counts text as an atom, but a text node can't contain an element.
	if (!node?.isAtom || node.isText) {
		return false;
	}
	const dom = view.nodeDOM(start);
	return dom instanceof Node && dom.contains(elem);
};

/**
 * Rule 1: no gap cursor can be placed for a click at `nodePos`.
 *
 * Skips clicks on text and inline atoms (mentions, emoji, status, dates, inline cards), where
 * `nodePos` is inside a textblock. Inside a `mediaSingle` the handler places the gap cursor beside
 * it instead, so clicks beside nested images aren't skipped.
 */
const cannotPlaceGapCursorAt = ($pos: ResolvedPos): boolean =>
	$pos.parent.type.name !== 'mediaSingle' && !GapCursorSelection.valid($pos);

/**
 * Rule 2: the click target is inside the DOM of the atom before or after `nodePos`.
 *
 * Skips clicks on block atoms (images, block and embed cards, extensions, dividers), which the
 * handler already ignored via `posAtCoords.inside`. Clicks beside them, outside their DOM, aren't
 * skipped.
 */
const isClickOnAdjacentAtom = (elem: HTMLElement, $pos: ResolvedPos, view: EditorView): boolean => {
	const { nodeAfter, nodeBefore, pos } = $pos;
	return (
		isClickInsideAtom(elem, nodeAfter, pos, view) ||
		isClickInsideAtom(elem, nodeBefore, pos - (nodeBefore?.nodeSize ?? 0), view)
	);
};

/**
 * Whether the gap cursor click handler would return false whatever `posAtCoords` returns, so the
 * layout read can be skipped.
 */
const isClickWithoutGapCursor = (elem: HTMLElement, { view, nodePos }: ClickContext): boolean => {
	const { doc } = view.state;
	if (nodePos < 0 || nodePos > doc.content.size) {
		return false;
	}

	const $pos = doc.resolve(nodePos);
	return cannotPlaceGapCursorAt($pos) || isClickOnAdjacentAtom(elem, $pos, view);
};

/**
 * Whether a click should be left to other handlers instead of placing a gap cursor.
 *
 * Pass `clickContext` to also ignore clicks where no gap cursor can be placed: clicks on text or
 * inline content, and clicks on an atom node such as media, cards or extensions.
 */
export const isIgnoredClick = (
	elem: HTMLElement | null,
	clickContext?: ClickContext,
): boolean | null => {
	if (elem?.nodeName === 'BUTTON' || elem?.closest('button')) {
		return true;
	}

	// check if we're clicking an image caption placeholder
	if (elem?.closest(`[data-id="${CAPTION_PLACEHOLDER_ID}"]`)) {
		return true;
	}

	// check if no gap cursor can be placed for this click (text, inline content or an atom node).
	// This runs before the table check so clicks inside tables are covered too.
	if (elem && clickContext && isClickWithoutGapCursor(elem, clickContext)) {
		return true;
	}

	// check if target node has a parent table node
	let tableWrap;
	let node = elem;
	while (node) {
		if (
			node.className &&
			(node.getAttribute('class') || '').indexOf(TableSharedCssClassName.TABLE_CONTAINER) > -1
		) {
			tableWrap = node;
			break;
		}
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		node = node.parentNode as HTMLElement;
	}

	if (tableWrap) {
		const rowControls = tableWrap.querySelector(
			`.${TableSharedCssClassName.TABLE_ROW_CONTROLS_WRAPPER}`,
		);
		const isColumnControlsDecoration =
			elem &&
			elem.classList &&
			elem.classList.contains(TableSharedCssClassName.TABLE_COLUMN_CONTROLS_DECORATIONS);
		return (rowControls && rowControls.contains(elem)) || isColumnControlsDecoration;
	}

	// Check if unsupported node selection
	// (without this, selection requires double clicking in FF due to posAtCoords differences)
	if (elem?.closest(`.${UnsupportedSharedCssClassName.BLOCK_CONTAINER}`)) {
		return true;
	}

	return false;
};

/*
  Calculates custom style for breakout mode
  Mainly to handle table width to include the numbered column width as well
*/
export const getComputedStyleForLayoutMode = (
	dom: HTMLElement,
	node: PMNode | undefined | null,
	style: CSSStyleDeclaration,
): CSSStyleDeclaration => {
	if (node && node.type.name === 'table') {
		const tableContainer = dom.querySelector('.pm-table-container');
		if (tableContainer) {
			return window.getComputedStyle(tableContainer);
		}
	}

	if (editorExperiment('advanced_layouts', true) && node && node.type.name === 'layoutSection') {
		const layoutSectionContainer = dom.querySelector('.layout-section-container');
		if (layoutSectionContainer) {
			return window.getComputedStyle(layoutSectionContainer);
		}
	}

	return style;
};
