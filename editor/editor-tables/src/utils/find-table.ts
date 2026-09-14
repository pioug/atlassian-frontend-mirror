import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

// Iterates over parent nodes, returning the closest table node.
export const findTable = (selection: Selection): ContentNodeWithPos | undefined =>
	findParentNode((node) => node.type.spec.tableRole && node.type.spec.tableRole === 'table')(
		selection,
	);
