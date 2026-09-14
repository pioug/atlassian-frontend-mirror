import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

// Iterates over parent nodes, returning a table node closest to a given `$pos`.
export const findTableClosestToPos = ($pos: ResolvedPos): ContentNodeWithPos | undefined => {
	const predicate = (node: PMNode) =>
		node.type.spec.tableRole && node.type.spec.tableRole === 'table';

	return findParentNodeClosestToPos($pos, predicate);
};
