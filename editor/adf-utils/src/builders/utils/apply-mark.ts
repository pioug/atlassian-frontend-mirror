import { isDuplicateMark, duplicateMarkError } from './is-duplicate-mark';
import { WithMark } from '../types';
import { text } from '../nodes/text';

export function applyMark<T>(
  mark: T & { type: string },
  maybeNode: WithMark | string,
) {
  const node = typeof maybeNode === 'string' ? text(maybeNode) : maybeNode;

  if (isDuplicateMark(node, mark.type)) {
    // eslint-disable-next-line no-console
    console.error(duplicateMarkError(node, mark.type));
    return node;
  }

  node.marks = node.marks || [];
  node.marks.push(mark);
  return node;
}
