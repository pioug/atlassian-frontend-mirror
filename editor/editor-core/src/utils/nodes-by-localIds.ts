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

export const findNodePosByFragmentLocalIds = (
  state: EditorState,
  ids: string[],
): NodeWithPos[] => {
  if (ids.length === 0) {
    return [];
  }

  const nodes: NodeWithPos[] = [];
  const localIdSet: Set<string> = new Set(ids);

  state.doc.descendants((node: PMNode, pos: number) => {
    const fragmentLocalIdList = node.marks
      ?.filter((m) => m.type.name === 'fragment')
      .map((m) => m.attrs?.localId)
      .filter((id) => id && localIdSet.has(id));

    if (fragmentLocalIdList.length > 0) {
      nodes.push({ node, pos });
    }

    // stop traversing once we found all the nodes
    return localIdSet.size !== nodes.length;
  });

  return nodes;
};
