import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { numberNestedLists } from './selection';

export const hasValidListIndentationLevel = ({
  tr,
  maxIndentation,
}: {
  tr: Transaction;
  maxIndentation: number;
}): boolean => {
  const initialIndentationLevel = numberNestedLists(tr.selection.$from);
  let currentIndentationLevel: number;
  let currentPos = tr.selection.$to.pos;
  do {
    const resolvedPos = tr.doc.resolve(currentPos);
    currentIndentationLevel = numberNestedLists(resolvedPos);
    if (currentIndentationLevel > maxIndentation) {
      return false;
    }
    currentPos++;
  } while (currentIndentationLevel >= initialIndentationLevel);

  return true;
};
