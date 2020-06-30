import { Fragment, Schema, Slice } from 'prosemirror-model';

// If slice is decisionItem, wrap it inside a decisionList. This prevents an
// additional newline from being pasted along with the selected decision item.
export const transformSliceToDecisionList = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const node = slice.content.firstChild;
  if (
    slice.content.childCount === 1 &&
    node &&
    node.type.name === 'decisionItem'
  ) {
    const decisionListWrapperNode = schema.nodes.decisionList.create({}, node);
    return new Slice(
      Fragment.from(decisionListWrapperNode),
      slice.openStart,
      slice.openEnd,
    );
  }
  return slice;
};
