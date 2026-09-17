import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';

import { isListItemNode } from '../utils';

import { numberNestedLists } from './numberNestedLists';

export const getListItemAttributes = (
	$pos: ResolvedPos,
): {
	indentLevel: number;
	itemIndex: number;
} => {
	// Get level for the correct indent of nesting
	const indentLevel = numberNestedLists($pos) - 1;

	const itemAtPos = findParentNodeClosestToPos($pos, isListItemNode);

	// Get the index of the current item relative to parent (parent is at item depth - 1)
	const itemIndex = $pos.index(itemAtPos ? itemAtPos.depth - 1 : undefined);
	return { indentLevel, itemIndex };
};

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { numberNestedLists } from './numberNestedLists';
