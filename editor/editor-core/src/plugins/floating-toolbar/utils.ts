import { Node } from 'prosemirror-model';

export const shallowEqual = (objA?: Object, objB?: Object) => {
  if (objA === objB) {
    return true;
  }
  if (objA == null || objB == null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    if ((objA as any)[key] !== (objB as any)[key]) {
      return false;
    }
  }

  return true;
};
export const compareArrays = <T>(
  left: Array<T>,
  right: Array<T>,
  compareFn: (left: T, right: T) => boolean = shallowEqual,
) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let idx = 0; idx < left.length; idx++) {
    if (!compareFn(left[idx], right[idx])) {
      return false;
    }
  }

  return true;
};

// find node in descendants by condition
export function findNode(
  parent: Node,
  predicate: (node: Node) => boolean,
): Node | undefined {
  let matchedNode: Node | undefined;

  parent.descendants((node) => {
    // dont run predicate if node already found
    if (matchedNode) {
      return false;
    }
    if (predicate(node)) {
      matchedNode = node;
      return false;
    }
    return true;
  });
  return matchedNode;
}
