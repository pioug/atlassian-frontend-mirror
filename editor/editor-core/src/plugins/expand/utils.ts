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

// If the top level is a single expand, and the expand is not
// a part of copied content, then return unwrap contents.
// This is needed for handling content copied from expand.
// https://product-fabric.atlassian.net/browse/ED-9146
export const transformSliceToRemoveOpenExpand = (
  slice: Slice,
  schema: Schema,
): Slice => {
  if (
    slice.openStart > 1 &&
    slice.openEnd > 1 &&
    slice.content.childCount === 1 &&
    slice.content.firstChild &&
    slice.content.firstChild.type === schema.nodes.expand
  ) {
    return new Slice(
      slice.content.firstChild.content,
      slice.openStart - 1,
      slice.openEnd - 1,
    );
  }
  return slice;
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
