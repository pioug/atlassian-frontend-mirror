import { BLOCK_MENU_TEST_ID } from '@atlaskit/editor-common/block-menu';
import {
	popupWithNestedElement,
	type ExperienceCheckResult,
} from '@atlaskit/editor-common/experiences';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables';

/**
 * Checks if the given element or any of its ancestors is a drag handle element.
 *
 * @param element - The DOM element to check.
 * @returns True if the element is a drag handle, false otherwise.
 */
export const isDragHandleElement = (element: Element | null): boolean => {
	return !!element?.closest('[data-editor-block-ctrl-drag-handle]');
};

/**
 * Checks if the block menu is currently visible within the provided popups target element.
 *
 * @param popupsTarget - The container element for popups.
 * @returns True if the block menu is visible, false otherwise.
 */
export const isBlockMenuVisible = (popupsTarget: HTMLElement | undefined): boolean => {
	if (!popupsTarget) {
		return false;
	}
	return popupWithNestedElement(popupsTarget, `[data-testid="${BLOCK_MENU_TEST_ID}"]`) !== null;
};

/**
 * Gets the parent DOM element at the starting position of the current selection
 * from the provided editor view.
 *
 * @param editorView - The editor view from which to get the parent DOM element
 * @returns The parent HTMLElement of the block at the selection, or null if not found
 */
export const getParentDOMAtSelection = (editorView?: EditorView): HTMLElement | null => {
	if (!editorView) {
		return null;
	}

	const { selection } = editorView.state;

	if (selection instanceof CellSelection) {
		// $anchorCell resolves inside the row (before the cell), so
		// $anchorCell.depth is the row's depth. Table is one level up.
		const $cell = selection.$anchorCell;
		const tableDepth = $cell.depth - 1;
		if (tableDepth > 0) {
			const dom = editorView.nodeDOM($cell.before(tableDepth));
			if (dom instanceof HTMLElement && dom.parentElement) {
				return dom.parentElement;
			}
		}
	}

	const from = selection.from;
	const nodeDOM = editorView.nodeDOM(from);

	if (nodeDOM instanceof HTMLElement) {
		return nodeDOM.parentElement;
	}

	return editorView.dom || null;
};

const isBlockMenuAddedInMutation = ({ type, addedNodes }: MutationRecord) => {
	return type === 'childList' && [...addedNodes].some(isBlockMenuWithinNode);
};

const isBlockMenuWithinNode = (node?: Node | null) => {
	return popupWithNestedElement(node, `[data-testid="${BLOCK_MENU_TEST_ID}"]`) !== null;
};

/**
 * Handles DOM mutations to determine if the block menu was opened
 *
 * This function looks for mutations that indicate the block menu
 * has been added to the DOM.
 *
 * @param mutations - The list of DOM mutations to evaluate
 * @returns An ExperienceCheckResult indicating success if the menu was opened, otherwise undefined
 */
export const handleMenuOpenDomMutation = ({
	mutations,
}: {
	mutations: MutationRecord[];
}): ExperienceCheckResult | undefined => {
	// Look for a mutation that added the block menu
	for (const mutation of mutations) {
		if (isBlockMenuAddedInMutation(mutation)) {
			return { status: 'success' };
		}
	}
	return undefined;
};

/**
 * Handles DOM mutations to determine if a move action was performed
 *
 * Move actions typically produce two mutations: one where nodes are removed
 * from their original location, and another where the same number of nodes are
 * added to a new location. This function checks for that pattern.
 *
 * @param mutations - The list of DOM mutations to evaluate
 * @returns An ExperienceCheckResult indicating success if a move was detected, otherwise undefined
 */
export const handleMoveDomMutation = ({
	mutations,
}: {
	mutations: MutationRecord[];
}): ExperienceCheckResult | undefined => {
	const removeMutation = mutations.find((m) => m.type === 'childList' && m.removedNodes.length > 0);
	const addMutation = mutations.find((m) => m.type === 'childList' && m.addedNodes.length > 0);

	if (
		removeMutation &&
		addMutation &&
		removeMutation.removedNodes.length === addMutation.addedNodes.length
	) {
		return { status: 'success' };
	}

	return undefined;
};

/**
 * Handles DOM mutations to determine if a delete action was performed
 *
 * Delete actions typically produce a single mutation where nodes are removed
 * from the DOM without any corresponding additions. This function checks for
 * that specific pattern.
 *
 * @param mutations - The list of DOM mutations to evaluate
 * @returns An ExperienceCheckResult indicating success if a delete was detected, otherwise undefined
 */
export const handleDeleteDomMutation = ({
	mutations,
}: {
	mutations: MutationRecord[];
}): ExperienceCheckResult | undefined => {
	// Delete action produces a single childList mutation with only removedNodes
	const childListMutations = mutations.filter((m) => m.type === 'childList');

	// Check for at least one mutation with removedNodes but no addedNodes
	if (childListMutations.some((m) => m.removedNodes.length > 0 && m.addedNodes.length === 0)) {
		return { status: 'success' };
	}
	return undefined;
};

/**
 * Handles DOM mutations to determine if a transform action was performed.
 *
 * Transforms replace one block type with another (e.g. paragraph → heading),
 * producing childList mutations with both removed (old node) and added (new node).
 *
 * @param options.mutations - The list of DOM mutation records
 * @returns An ExperienceCheckResult indicating success if a transform was detected, otherwise undefined
 */
export const handleTransformDomMutation = ({
	mutations,
}: {
	mutations: MutationRecord[];
}): ExperienceCheckResult | undefined => {
	const hasRemovedNodes = mutations.some(
		(m) => m.type === 'childList' && m.removedNodes.length > 0,
	);
	const hasAddedNodes = mutations.some((m) => m.type === 'childList' && m.addedNodes.length > 0);

	if (hasRemovedNodes && hasAddedNodes) {
		return { status: 'success' };
	}

	return undefined;
};
