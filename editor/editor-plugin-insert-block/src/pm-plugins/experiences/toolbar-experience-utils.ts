import type { ExperienceCheckResult } from '@atlaskit/editor-common/experiences';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { ExperienceCheckPopupMutation } from '@atlaskit/editor-common/experiences';

/**
 * DOM marker selectors for node types inserted via toolbar actions.
 * Matches outermost wrapper elements set synchronously by ReactNodeView
 * (`{nodeTypeName}View-content-wrap`) or schema `toDOM` attributes.
 */
export const NODE_INSERT_MARKERS = {
	TABLE: '.tableView-content-wrap',
	LAYOUT: '.layoutSectionView-content-wrap',
	LAYOUT_COLUMN: '.layoutColumnView-content-wrap',
	TASK_LIST: '[data-node-type="actionList"]',
	TASK_ITEM: '.taskItemView-content-wrap',
} as const;

const COMBINED_NODE_INSERT_SELECTOR = [
	NODE_INSERT_MARKERS.TABLE,
	NODE_INSERT_MARKERS.LAYOUT,
	NODE_INSERT_MARKERS.LAYOUT_COLUMN,
	NODE_INSERT_MARKERS.TASK_LIST,
	NODE_INSERT_MARKERS.TASK_ITEM,
].join(', ');

export const isToolbarButtonClick = (target: HTMLElement, testId: string): boolean => {
	const button = target.closest<HTMLButtonElement>(`button[data-testid="${testId}"]`);
	if (!button) {
		return false;
	}
	return !button.disabled && button.getAttribute('aria-disabled') !== 'true';
};

/**
 * Returns the narrow parent DOM element at the current selection, suitable
 * for observing with `{ childList: true }` (no subtree).
 *
 * Uses the resolved position's depth to find the block node at the cursor
 * via `nodeDOM`, then returns its `parentElement` — the container whose
 * direct children change when content is inserted at this position.
 *
 * Falls back to `domAtPos` if `nodeDOM` is unavailable.
 */
export const getParentDOMAtSelection = (editorView?: EditorView): HTMLElement | null => {
	if (!editorView) {
		return null;
	}

	try {
		const { selection } = editorView.state;
		const $from = selection.$from;
		const parentDepth = Math.max(1, $from.depth);
		const parentPos = $from.before(parentDepth);
		const parentDom = editorView.nodeDOM(parentPos);

		if (parentDom instanceof HTMLElement && parentDom.parentElement) {
			return parentDom.parentElement;
		}

		// Fallback: use domAtPos
		const { node } = editorView.domAtPos(selection.from);
		let element: HTMLElement | null = null;
		if (node instanceof HTMLElement) {
			element = node;
		} else if (node instanceof Text) {
			element = node.parentElement;
		}

		if (!element) {
			return null;
		}

		const proseMirrorRoot = editorView.dom;
		if (!(proseMirrorRoot instanceof HTMLElement)) {
			return null;
		}

		if (element === proseMirrorRoot) {
			return proseMirrorRoot;
		}

		if (element.parentElement && proseMirrorRoot.contains(element.parentElement)) {
			return element.parentElement;
		}

		return proseMirrorRoot;
	} catch {
		return null;
	}
};

/**
 * Checks whether a DOM node matches any known node insert marker,
 * either directly or via a nested element (e.g. breakout mark wrapper).
 */
const matchesNodeInsertMarker = (node: Node): boolean => {
	if (!(node instanceof HTMLElement)) {
		return false;
	}
	return (
		node.matches(COMBINED_NODE_INSERT_SELECTOR) ||
		!!node.querySelector(COMBINED_NODE_INSERT_SELECTOR)
	);
};

/**
 * Evaluates DOM mutations to detect a node insert action.
 *
 * Uses two strategies:
 * 1. Marker-based: checks `addedNodes` against known node insert selectors.
 * 2. Structure-based: detects element add+remove (block-level replacement).
 */
export const handleEditorNodeInsertDomMutation = ({
	mutations,
}: {
	mutations: MutationRecord[];
}): ExperienceCheckResult | undefined => {
	let hasAddedElement = false;
	let hasRemovedElement = false;

	for (const mutation of mutations) {
		if (mutation.type !== 'childList') {
			continue;
		}

		for (const node of mutation.addedNodes) {
			if (matchesNodeInsertMarker(node)) {
				return { status: 'success' };
			}
			if (node instanceof HTMLElement) {
				hasAddedElement = true;
			}
		}

		for (const node of mutation.removedNodes) {
			if (node instanceof HTMLElement) {
				hasRemovedElement = true;
			}
		}
	}

	if (hasAddedElement && hasRemovedElement) {
		return { status: 'success' };
	}

	return undefined;
};
