import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

type FindNodesByIdsOption = {
	includeDocNode?: boolean;
};

export const findNodePosByLocalIds = (
	state: EditorState,
	ids: string[],
	option: FindNodesByIdsOption = {},
): NodeWithPos[] => {
	if (ids.length === 0) {
		return [];
	}

	const nodes: NodeWithPos[] = [];
	const localIdSet: Set<string> = new Set(ids);

	if (option.includeDocNode && localIdSet.has(state.doc.attrs?.localId)) {
		nodes.push({ node: state.doc, pos: 0 });
	}

	state.doc.descendants((node: PMNode, pos: number) => {
		if (localIdSet.has(node.attrs?.localId)) {
			nodes.push({ node, pos });
		}

		// stop traversing once we found all the nodes
		return localIdSet.size !== nodes.length;
	});

	return nodes;
};
