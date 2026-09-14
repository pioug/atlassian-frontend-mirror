import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const CELL_ROLE_REGEX = /cell/i;

// Iterates over parent nodes, returning a table cell or a table header node closest to a given `$pos`.
export const findCellClosestToPos = ($pos: ResolvedPos): ContentNodeWithPos | undefined => {
	const predicate = (node: PMNode) =>
		node.type.spec.tableRole && CELL_ROLE_REGEX.test(node.type.spec.tableRole);

	return findParentNodeClosestToPos($pos, predicate);
};
