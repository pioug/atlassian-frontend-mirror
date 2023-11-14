import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

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
