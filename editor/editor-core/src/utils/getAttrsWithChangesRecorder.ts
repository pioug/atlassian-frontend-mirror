import { Node } from 'prosemirror-model';

export interface GetAttrsChange<T, V> {
  node: Node;
  prevAttrs?: T;
  newAttrs: T | false | undefined;
  options: V;
}

export type GetAttrsWithChangesRecorder<T, V> = {
  getAttrs(prevAttrs?: T | undefined, node?: Node): T | false | undefined;
  getAndResetAttrsChanges(): GetAttrsChange<T, V>[];
};

/**
 * Create a new getAttrs handler who will wrap the original function,
 * and store the changes internally to be used for other
 * tools like Analytics later in the code.
 *
 * @param getAttrs - Function who gets the new attributes
 * @return object
 * @property handler - New handler to get indentation attributes (It wraps the original)
 * @property getChanges - Return all the stored changes.
 * @property clear - Clear the changes
 */
export default function getAttrsWithChangesRecorder<T, V>(
  getAttrs: (prevAttrs?: T, node?: Node) => T | false | undefined,
  options: V,
): GetAttrsWithChangesRecorder<T, V> {
  let changes: GetAttrsChange<T, V>[] = [];

  function getAttrsWithChangesRecorder(
    prevAttrs?: T,
    node?: Node,
  ): T | undefined | false {
    const newAttrs = getAttrs(prevAttrs, node);

    changes.push({
      node: node!,
      prevAttrs,
      newAttrs,
      options,
    });

    return newAttrs;
  }

  return {
    getAttrs: getAttrsWithChangesRecorder,
    getAndResetAttrsChanges() {
      const oldChanges = changes;
      changes = [];
      return oldChanges;
    },
  };
}
