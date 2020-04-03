import { Node, Fragment, Slice } from 'prosemirror-model';

/**
 * A helper to get the underlying array of a fragment.
 */
export function getFragmentBackingArray(
  fragment: Fragment,
): ReadonlyArray<Node> {
  return (fragment as any).content as Node[];
}

export function mapFragment(
  content: Fragment,
  callback: (
    node: Node,
    parent: Node | null,
    index: number,
  ) => Node | Node[] | Fragment | null,
  parent: Node | null = null,
) {
  const children = [] as Node[];
  for (let i = 0, size = content.childCount; i < size; i++) {
    const node = content.child(i);
    const transformed = node.isLeaf
      ? callback(node, parent, i)
      : callback(
          node.copy(mapFragment(node.content, callback, node)),
          parent,
          i,
        );
    if (transformed) {
      if (transformed instanceof Fragment) {
        children.push(...getFragmentBackingArray(transformed));
      } else if (Array.isArray(transformed)) {
        children.push(...transformed);
      } else {
        children.push(transformed);
      }
    }
  }
  return Fragment.fromArray(children);
}

export function mapSlice(
  slice: Slice,
  callback: (
    node: Node,
    parent: Node | null,
    index: number,
  ) => Node | Node[] | Fragment | null,
): Slice {
  const fragment = mapFragment(slice.content, callback);
  return new Slice(fragment, slice.openStart, slice.openEnd);
}

export type FlatMapCallback = (
  node: Node,
  index: number,
  fragment: Fragment,
) => Node | Node[];

export function flatmap(
  fragment: Fragment,
  callback: FlatMapCallback,
): Fragment {
  const fragmentContent = [] as Node[];
  for (let i = 0; i < fragment.childCount; i++) {
    const child = callback(fragment.child(i), i, fragment);
    if (Array.isArray(child)) {
      fragmentContent.push(...child);
    } else {
      fragmentContent.push(child);
    }
  }
  return Fragment.fromArray(fragmentContent);
}

export type MapWithCallback<T> = (
  node: Node,
  index: number,
  fragment: Fragment,
) => T;

export function mapChildren<T>(
  node: Node | Fragment,
  callback: MapWithCallback<T>,
): Array<T> {
  const array: Array<T> = [];
  for (let i = 0; i < node.childCount; i++) {
    array.push(
      callback(
        node.child(i),
        i,
        node instanceof Fragment ? node : node.content,
      ),
    );
  }

  return array;
}
