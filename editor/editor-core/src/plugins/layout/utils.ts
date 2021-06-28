import { Fragment, Node, Slice, Schema } from 'prosemirror-model';
import { flatmap, mapFragment } from '../../utils/slice';

const isLayoutNode = (node: Node) =>
  node.type === node.type.schema.nodes.layoutSection ||
  node.type === node.type.schema.nodes.layoutColumn;

export function unwrapContentFromLayout(
  maybeLayoutSection: Node,
): Node | Node[] {
  const fragment = mapFragment(Fragment.from(maybeLayoutSection), (node) => {
    return isLayoutNode(node) ? node.content : node;
  });

  const nodes = [] as Node[];
  fragment.forEach((i) => nodes.push(i));
  return nodes;
}

export function removeLayoutFromFirstChild(node: Node, i: number) {
  return i === 0 ? unwrapContentFromLayout(node) : node;
}

export function removeLayoutFromLastChild(
  node: Node,
  i: number,
  fragment: Fragment,
) {
  return i === fragment.childCount - 1 ? unwrapContentFromLayout(node) : node;
}

/**
 * When we have a slice that cuts across a layoutSection/layoutColumn
 * we can end up with unexpected behaviour on paste/drop where a user
 * is able to add columns to a layoutSection. By 'lifting' any content
 * inside an 'open' layoutSection/layoutColumn to the top level, we
 * can ensure prevent this.
 *
 * We only care about slices with non-zero openStart / openEnd's here
 * as we're totally fine for people to copy/paste a full layoutSection
 */
export function transformSliceToRemoveOpenLayoutNodes(
  slice: Slice,
  schema: Schema,
) {
  // Case 1: A slice entirely within a single layoutSection
  if (slice.openStart && slice.openEnd && slice.content.childCount === 1) {
    const maybeLayoutSection = slice.content.firstChild!;
    if (maybeLayoutSection.type === schema.nodes.layoutSection) {
      return new Slice(
        flatmap(slice.content, removeLayoutFromFirstChild),
        // '-2' here because we've removed the layoutSection/layoutColumn; reducing the open depth.
        slice.openStart - 2,
        slice.openEnd - 2,
      );
    }
  }

  // Case 2: A slice starting inside a layoutSection and finishing outside
  if (
    slice.openStart &&
    slice.content.firstChild!.type === schema.nodes.layoutSection
  ) {
    slice = new Slice(
      flatmap(slice.content, removeLayoutFromFirstChild),
      slice.openStart - 2,
      slice.openEnd,
    );
  }

  // Case 3: A slice starting outside a layoutSection and finishing inside
  if (
    slice.openEnd &&
    slice.content.lastChild!.type === schema.nodes.layoutSection
  ) {
    slice = new Slice(
      flatmap(slice.content, removeLayoutFromLastChild),
      slice.openStart,
      slice.openEnd - 2,
    );
  }

  // Case 2 & 3 also handles a slice starting in one layoutSection & finishing in a different layoutSection

  return slice;
}
