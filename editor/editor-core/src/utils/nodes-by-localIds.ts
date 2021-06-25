import { EditorState } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { NodeWithPos } from 'prosemirror-utils';

type FindNodesByIdsOption = {
  includeDocNode?: boolean;
};

export const findNodePosByLocalIds = (
  state: EditorState,
  ids: string[],
  option: FindNodesByIdsOption = {},
): NodeWithPos[] => {
  const nodes: NodeWithPos[] = [];
  if (ids.length === 0) {
    return [];
  }

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
