import { NodeSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables';

/**
 * Determines if a node is nested (not at top-level) based on its depth and context.
 *
 * Simple rules:
 * - Depth 0-1: Always top-level (not nested)
 * - Depth 2: Top-level for blockquotes and task lists
 * - Depth 3: Top-level for list items only
 * - Depth 4+: Always nested
 *
 * @param selection - The current ProseMirror selection
 * @returns true if nested, false if top-level
 */
export const isNestedNode = (selection: Selection | undefined, menuTriggerBy: string): boolean => {
	if (!selection) {
		return false;
	}
	const { $from } = selection;
	const depth = $from.depth;

	// When a file is in card view, selection.$from has a depth of 1, but it is not a nested node, should return false
	if (
		$from.depth === 1 &&
		selection instanceof NodeSelection &&
		selection.node.type.name === 'media' &&
		selection.node.attrs.type === 'file'
	) {
		return false;
	}

	if ($from.depth > 0 && selection instanceof NodeSelection) {
		return true;
	}

	// Depth 0-1: Always top-level
	if (depth <= 1) {
		return false;
	}

	// Depth 4+: Always nested
	if (depth > 4) {
		return true;
	}

	// Special case for table selection
	if (selection instanceof CellSelection) {
		return depth > 3;
	}

	// Check parent node type for depth 2-3
	const parentNode = $from.node(depth - 1);
	if (!parentNode) {
		return true;
	}

	const parentType = parentNode.type.name;
	const isTriggeredByBlockquote = menuTriggerBy.includes('blockquote');

	// Special cases where content is still top-level
	if (
		(parentType === 'listItem' && depth === 3) ||
		(parentType === 'blockquote' && depth === 2 && isTriggeredByBlockquote) ||
		(parentType === 'taskList' && depth === 2) ||
		(parentType === 'listItem' && depth === 4 && isTriggeredByBlockquote)
	) {
		return false;
	}

	// Everything else at depth 2-3 is nested
	return true;
};
