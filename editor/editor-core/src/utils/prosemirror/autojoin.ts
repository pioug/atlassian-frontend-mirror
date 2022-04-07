import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { canJoin } from 'prosemirror-transform';

/**
 * Checks whether two adjacent nodes can be joined. If so, the document
 * will be updated to join those nodes. If not, the original transaction
 * remains untouched.
 *
 * Nodes are considered joinable if the `isJoinable` predicate returns true or,
 * if an array of strings was passed, if their node type name is in that array.
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L597-L610
 */
export function autoJoinTr(
  tr: Transaction,
  isJoinable: ((before: Node, after: Node) => boolean) | string[],
) {
  if (Array.isArray(isJoinable)) {
    let types = isJoinable;
    isJoinable = (node: Node) => types.indexOf(node.type.name) > -1;
  }

  const ranges: number[] = [];
  for (let i = 0; i < tr.mapping.maps.length; i++) {
    const map = tr.mapping.maps[i];
    for (let j = 0; j < ranges.length; j++) {
      ranges[j] = map.map(ranges[j]);
    }
    map.forEach((_s: unknown, _e: unknown, from: number, to: number) =>
      ranges.push(from, to),
    );
  }

  // Figure out which joinable points exist inside those ranges,
  // by checking all node boundaries in their parent nodes.
  const joinable = [];
  for (let i = 0; i < ranges.length; i += 2) {
    const from = ranges[i];
    const to = ranges[i + 1];
    const $from = tr.doc.resolve(from);
    const depth = $from.sharedDepth(to);
    const parent = $from.node(depth);
    for (
      let index = $from.indexAfter(depth), pos = $from.after(depth + 1);
      pos <= to;
      ++index
    ) {
      const after = parent.maybeChild(index);
      if (!after) {
        break;
      }
      if (index && joinable.indexOf(pos) === -1) {
        const before = parent.child(index - 1);
        if (before.type === after.type && isJoinable(before, after)) {
          joinable.push(pos);
        }
      }
      pos += after.nodeSize;
    }
  }
  // Join the joinable points
  joinable.sort((a, b) => a - b);
  for (let i = joinable.length - 1; i >= 0; i--) {
    if (canJoin(tr.doc, joinable[i])) {
      tr.join(joinable[i]);
    }
  }
}
