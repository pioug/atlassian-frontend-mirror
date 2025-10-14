import type { ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const getNestedNodePosition = ({
	selection,
	schema,
	resolve,
}: {
	resolve: (pos: number) => ResolvedPos;
	schema: Schema;
	selection: Selection;
}) => {
	let nestedNodePos = selection.$from.before(1);
	if (selection instanceof TextSelection) {
		nestedNodePos = selection.$from.before();
		const $pos = resolve(nestedNodePos);
		if ($pos.depth < 1) {
			return nestedNodePos;
		}
		const parentNodeOfSpecificTypes = findParentNodeOfType([
			schema.nodes.bulletList,
			schema.nodes.orderedList,
			schema.nodes.blockquote,
			schema.nodes.taskList,
			schema.nodes.decisionList,
		])(selection);

		if (parentNodeOfSpecificTypes) {
			const parentNodeType = parentNodeOfSpecificTypes.node.type.name;

			nestedNodePos = ['bulletList', 'orderedList'].includes(parentNodeType)
				? $pos.before($pos.depth - 1)
				: ['blockquote', 'taskList', 'decisionList'].includes(parentNodeType)
					? $pos.before()
					: nestedNodePos;
		}
	} else {
		nestedNodePos = selection.$from.pos;
	}

	return nestedNodePos;
};

/**
 *
 * @returns starting position of nested node that drag handle can be shown next to
 */
export const getNestedNodeStartingPosition = ({
	selection,
	schema,
	resolve,
}: {
	resolve: (pos: number) => ResolvedPos;
	schema: Schema;
	selection: Selection;
}) => {
	let nestedNodePos = selection.$from.before(1);
	if (selection instanceof TextSelection) {
		nestedNodePos = selection.$from.before();
		const $pos = resolve(nestedNodePos);
		if ($pos.depth < 1) {
			return nestedNodePos;
		}

		const { bulletList, orderedList, taskList, decisionList, caption } = schema.nodes;
		const isInList = findParentNodeOfType([bulletList, orderedList, taskList])(selection);
		const isInNodeWithoutDragHandle = findParentNodeOfType([caption, decisionList])(selection);

		if (isInList) {
			// Only show drag handle at outermost list parent
			nestedNodePos = getOutermostListPos($pos, resolve);
		} else if (isInNodeWithoutDragHandle) {
			// return the position of their parent if there should be no drag handle before the node
			nestedNodePos = $pos.before();
		}
	} else {
		nestedNodePos = selection.$from.pos;
	}

	return nestedNodePos;
};

const getOutermostListPos = ($pos: ResolvedPos, resolve: (pos: number) => ResolvedPos) => {
	if ($pos.depth === 0) {
		return $pos.pos;
	}

	const parentPos = $pos.before();
	const parentNode = $pos.parent;
	if (
		parentNode &&
		['bulletList', 'listItem', 'orderedList', 'taskList', 'taskItem'].includes(parentNode.type.name)
	) {
		return getOutermostListPos(resolve(parentPos), resolve);
	}

	return $pos.pos;
};
