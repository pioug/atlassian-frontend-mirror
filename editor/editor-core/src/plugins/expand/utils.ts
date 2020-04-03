import { EditorState, Selection } from 'prosemirror-state';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { Slice, Schema, Node as PMNode, Fragment } from 'prosemirror-model';
import { mapChildren } from '../../utils/slice';

export const findExpand = (
  state: EditorState,
  selection?: Selection<any> | null,
) => {
  const { expand, nestedExpand } = state.schema.nodes;
  return (
    findSelectedNodeOfType([expand, nestedExpand])(
      selection || state.selection,
    ) ||
    findParentNodeOfType([expand, nestedExpand])(selection || state.selection)
  );
};

export const transformSliceNestedExpandToExpand = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const { expand, nestedExpand } = schema.nodes;
  const children = [] as PMNode[];

  mapChildren(slice.content, (node: PMNode) => {
    if (node.type === nestedExpand) {
      children.push(expand.createChecked(node.attrs, node.content, node.marks));
    } else {
      children.push(node);
    }
  });

  return new Slice(
    Fragment.fromArray(children),
    slice.openStart,
    slice.openEnd,
  );
};
